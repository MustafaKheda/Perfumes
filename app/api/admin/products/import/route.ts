import * as XLSX from "xlsx";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";

type ImportRow = Record<string, unknown>;

export async function POST(request: Request) {
  const admin = await requireAdminUser();
  if (!admin) return unauthorized("Admin login required");

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return badRequest("Upload file is required");
  }

  const bytes = await file.arrayBuffer();
  const workbook = XLSX.read(bytes, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return badRequest("No sheet found in file");
  const rows = XLSX.utils.sheet_to_json<ImportRow>(workbook.Sheets[sheetName], { defval: "" });
  if (rows.length === 0) return badRequest("No rows found");

  const categoryRows = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
  const categoryBySlug = new Map(categoryRows.map((row) => [row.slug.toLowerCase(), row.id]));
  const existingProducts = await db.select({ id: products.id, modelNo: products.modelNo }).from(products);
  const productIdByModelNo = new Map(existingProducts.map((p) => [p.modelNo.toUpperCase(), p.id]));

  const created: string[] = [];
  const errors: string[] = [];
  const staged: Array<{
    rowIndex: number;
    modelNo: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    categoryId: string;
    parentModelNo: string | null;
    price: number;
    purchasePrice: number;
    stock: number;
  }> = [];

  for (let i = 0; i < rows.length; i++) {
    const rowIndex = i + 2;
    const row = rows[i];
    const modelNo = read(row, "modelNo").toUpperCase();
    const name = read(row, "name");
    const slug = slugify(read(row, "slug") || name);
    const description = read(row, "description");
    const image = read(row, "image");
    const categorySlug = read(row, "categorySlug").toLowerCase();
    const parentModelNoRaw = read(row, "parentModelNo").toUpperCase();
    const categoryId = categoryBySlug.get(categorySlug);
    const price = Number(read(row, "price"));
    const purchasePrice = Number(read(row, "purchasePrice") || "0");
    const stock = Number(read(row, "stock"));

    if (!modelNo || !name || !slug || !description || !image || !categoryId) {
      errors.push(`Row ${rowIndex}: missing required fields`);
      continue;
    }
    if (!Number.isFinite(price) || !Number.isFinite(stock)) {
      errors.push(`Row ${rowIndex}: invalid price or stock`);
      continue;
    }
    if (productIdByModelNo.has(modelNo) || staged.some((x) => x.modelNo === modelNo)) {
      errors.push(`Row ${rowIndex}: modelNo already exists (${modelNo})`);
      continue;
    }
    staged.push({
      rowIndex,
      modelNo,
      name,
      slug,
      description,
      image,
      categoryId,
      parentModelNo: parentModelNoRaw || null,
      price,
      purchasePrice: Number.isFinite(purchasePrice) ? purchasePrice : 0,
      stock: Math.max(0, Math.floor(stock)),
    });
  }

  if (staged.length === 0) {
    return badRequest(errors[0] ?? "No valid rows found");
  }

  for (const row of staged) {
    let parentProductId: string | null = null;
    if (row.parentModelNo) {
      parentProductId = productIdByModelNo.get(row.parentModelNo) ?? null;
      if (!parentProductId) {
        errors.push(`Row ${row.rowIndex}: parent model not found (${row.parentModelNo})`);
        continue;
      }
    }

    const [inserted] = await db
      .insert(products)
      .values({
        modelNo: row.modelNo,
        name: row.name,
        slug: row.slug,
        description: row.description,
        image: row.image,
        purchasePrice: row.purchasePrice.toFixed(2),
        price: row.price.toFixed(2),
        stock: row.stock,
        categoryId: row.categoryId,
        parentProductId,
      })
      .returning({ id: products.id, modelNo: products.modelNo });
    created.push(inserted.modelNo);
    productIdByModelNo.set(inserted.modelNo.toUpperCase(), inserted.id);
  }

  return ok({
    message: "Import completed",
    data: {
      importedCount: created.length,
      importedModelNos: created,
      errors,
      requiredColumns: [
        "modelNo",
        "name",
        "slug",
        "description",
        "image",
        "categorySlug",
        "price",
        "stock",
        "purchasePrice",
        "parentModelNo",
      ],
    },
  });
}

function read(row: ImportRow, key: string) {
  const value = row[key];
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
