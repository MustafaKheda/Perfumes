import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, notFound, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { collections } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateCollectionBody = {
  displayOrder?: unknown;
};

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const { id } = await context.params;
  let body: UpdateCollectionBody;

  try {
    body = (await request.json()) as UpdateCollectionBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const displayOrder = toInteger(body.displayOrder);

  if (displayOrder === null) {
    return badRequest("displayOrder must be a valid non-negative integer");
  }

  const [collection] = await db
    .update(collections)
    .set({ displayOrder, updatedAt: new Date() })
    .where(eq(collections.id, id))
    .returning();

  if (!collection) {
    return notFound("Collection not found");
  }

  return ok({
    message: "Collection order updated",
    data: serializeCollection(collection),
  });
}

function toInteger(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
}

function serializeCollection(collection: typeof collections.$inferSelect) {
  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    image: collection.image,
    images: collection.images,
    countLabel: collection.countLabel,
    displayOrder: collection.displayOrder,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  };
}
