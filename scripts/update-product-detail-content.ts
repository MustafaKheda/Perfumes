import { eq } from "drizzle-orm";
import { db, sqlClient } from "../lib/db";
import { products } from "../lib/db/schema";

function toDetailHtml(product: typeof products.$inferSelect) {
  const notes =
    product.notes.length > 0 ? product.notes : ["Amber", "Vanilla", "Sandalwood"];
  const [first, second, third] = notes;

  return `
<p>${product.name} is a refined perfume created for customers who want a fragrance that feels polished, memorable, and easy to wear. It opens with ${first}, moves into a smooth heart shaped by ${second ?? first}, and settles into a warm base led by ${third ?? first}. The scent is suitable for daily confidence, evening occasions, and gifting because it balances presence with comfort. Its character is elegant without being loud, giving the wearer a premium trail that stays close and sophisticated.</p>
<p><b>Features</b></p>
<ul>
  <li>Signature scent profile built around ${notes.join(", ")}.</li>
  <li>Smooth long-wear character for day and evening use.</li>
  <li>Balanced perfume trail that feels premium but not overpowering.</li>
  <li>Gift-ready fragrance choice for personal use or special occasions.</li>
  <li>Professionally written product content stored in the catalog database.</li>
  <li>Selectable smell options make it easier to choose the preferred scent style.</li>
</ul>`.trim();
}

async function main() {
  const items = await db.query.products.findMany();

  for (const product of items) {
    const scentOptions =
      product.scentOptions.length > 0
        ? product.scentOptions
        : product.notes.length > 0
          ? product.notes
          : ["Amber", "Vanilla", "Sandalwood"];

    await db
      .update(products)
      .set({
        detailedDescription:
          product.detailedDescription ??
          `${product.name} offers a premium fragrance profile with ${scentOptions.join(", ")}. It is crafted for a refined scent experience that works for daily wear, evening occasions, and gifting.`,
        productDetailHtml: product.productDetailHtml ?? toDetailHtml(product),
        scentOptions,
        updatedAt: new Date(),
      })
      .where(eq(products.id, product.id));
  }

  console.log(`Updated ${items.length} product detail records.`);
  await sqlClient.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
