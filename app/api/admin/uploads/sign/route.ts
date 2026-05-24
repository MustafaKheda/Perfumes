import { createUploadSignature, type CloudinaryUploadFolder } from "@/lib/cloudinary";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, ok, unauthorized } from "@/lib/api/http";

const allowedFolders: CloudinaryUploadFolder[] = [
  "scentora/products",
  "scentora/collections",
];

export async function POST(request: Request) {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const folder = getUploadFolder(body);

  if (!folder) {
    return badRequest("A valid upload folder is required");
  }

  try {
    return ok({
      data: createUploadSignature(folder),
    });
  } catch {
    return badRequest("Cloudinary is not configured");
  }
}

function getUploadFolder(value: unknown): CloudinaryUploadFolder | null {
  if (!value || typeof value !== "object" || !("folder" in value)) {
    return "scentora/products";
  }

  const folder = (value as { folder: unknown }).folder;

  if (typeof folder !== "string") {
    return null;
  }

  if (allowedFolders.includes(folder as CloudinaryUploadFolder)) {
    return folder as CloudinaryUploadFolder;
  }

  return null;
}
