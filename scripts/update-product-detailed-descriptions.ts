import { eq } from "drizzle-orm";
import { db, sqlClient } from "../lib/db";
import { products } from "../lib/db/schema";

const detailedDescriptions: Record<string, string> = {
  "midnight-amber":
    "Midnight Amber is crafted for evening presence, opening with a smooth amber warmth that feels polished without becoming heavy. Vanilla softens the composition with a creamy sweetness, while sandalwood adds a refined woody base that lingers close to the skin. The result is a confident fragrance for dinners, celebrations, and cooler nights when you want a scent that feels calm, elegant, and memorable.",
  "musk-bloom":
    "Musk Bloom blends romantic rose with soft vanilla and clean musk for a fragrance that feels graceful, comforting, and modern. The floral opening is gentle rather than sharp, moving into a smooth heart where vanilla adds warmth and musk creates a fresh, skin-like finish. It is ideal for daily wear, office days, brunch plans, and moments when you want a feminine perfume that stays refined from morning to evening.",
  "golden-noir":
    "Golden Noir is a bold luxury scent built around oud, bright bergamot, and glowing amber. Bergamot gives the first spray a crisp lift, while oud brings depth, richness, and a slightly smoky character. Amber rounds the fragrance with warmth, making it feel elegant and expressive. It suits evening wear, special occasions, and anyone who prefers a statement perfume with a polished, long-lasting trail.",
  "floral-noir":
    "Floral Noir gives a feminine floral profile a darker, more sophisticated finish. Bergamot adds freshness at the top, oud adds depth through the heart, and amber creates a warm base that stays smooth on the skin. It is designed for customers who enjoy floral perfumes but want something richer than a typical daytime scent, making it a strong choice for dinner plans, events, and refined daily wear.",
  "rose-velour":
    "Rose Velour is soft, elegant, and quietly luxurious. Rose creates a graceful floral opening, vanilla adds creamy warmth, and musk gives the fragrance a clean, comfortable finish. It feels polished without being overpowering, making it easy to wear through the day while still feeling special enough for evenings. This scent is a strong fit for anyone who loves romantic florals with a smooth modern base.",
  "oud-ember":
    "Oud Ember is made for depth and confidence, pairing smoky oud with bright bergamot and warm amber. The bergamot keeps the opening fresh, while oud gives the fragrance a rich woody character and amber adds a glowing finish. It is bold but controlled, ideal for men who want a premium scent that feels mature, distinctive, and suitable for evenings, business occasions, and cooler weather.",
  "saffron-mist":
    "Saffron Mist is a smooth unisex fragrance with warm spice, amber depth, and soft sandalwood. Saffron gives the scent a refined opening with subtle spice, amber adds richness, and sandalwood creates a creamy woody base that feels balanced on every wearer. It is versatile enough for daytime but has enough character for evening plans, making it a strong signature scent for any season.",
  "cedar-amber":
    "Cedar Amber is structured, clean, and masculine, built around amber, cedarwood, and a light jasmine accent. Cedarwood gives the scent its crisp woody backbone, amber adds warmth, and jasmine brings a soft lift that keeps the composition smooth. It works well for daily confidence, office wear, and occasions where you want a fragrance that feels sharp, dependable, and refined.",
  "amber-dusk":
    "Amber Dusk is a balanced unisex fragrance with warm amber, textured cedarwood, and a bright jasmine heart. It opens with a smooth warmth, then settles into a woody floral character that feels modern and easy to wear. The scent is designed for versatility, moving naturally from daytime plans to evening settings while keeping a polished and inviting trail.",
  "velvet-bloom":
    "Velvet Bloom is a soft floral fragrance shaped by rose, vanilla, and clean musk. Rose brings a delicate romantic opening, vanilla adds a smooth sweetness, and musk gives the finish a fresh, elegant feel. The fragrance is feminine, comfortable, and polished, making it ideal for everyday wear, gifting, and moments when you want a scent that feels gentle but memorable.",
  "noir-mystique":
    "Noir Mystique is a deep, polished fragrance centered on oud, bergamot, and amber. The opening is bright and refined, the heart is rich with woody oud, and the amber base gives the scent warmth and staying power. It is designed for customers who want a confident luxury perfume with depth, elegance, and a memorable trail for evenings, events, and signature wear.",
};

async function main() {
  for (const [slug, detailedDescription] of Object.entries(detailedDescriptions)) {
    await db
      .update(products)
      .set({
        detailedDescription,
        updatedAt: new Date(),
      })
      .where(eq(products.slug, slug));
  }

  console.log(`Updated ${Object.keys(detailedDescriptions).length} product descriptions.`);
  await sqlClient.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
