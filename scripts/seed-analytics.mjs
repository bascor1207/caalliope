#!/usr/bin/env node
/**
 * Données de démonstration pour le dashboard : simule 30 jours de visites et les envoie
 * à l'endpoint d'ingestion de la boutique (même chemin que les vrais navigateurs).
 *
 *   pnpm seed:analytics                # boutique sur http://localhost:3000
 *   pnpm seed:analytics -- --base http://localhost:3111 --days 30 --sessions 400
 */
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]]] : acc), []),
);
const BASE = args.base ?? "http://localhost:3000";
const DAYS = Number(args.days ?? 30);
const SESSIONS = Number(args.sessions ?? 400);

const products = ["pull-a-capuche-koda", "sweat-koda", "t-shirt-koda"];
const colors = ["bleu-ciel", "rose", "vert-pastel", "noir", "beige"];
const sizes = ["S", "M", "L", "XL"];
const targets = [
  "hero.cta",
  "hero.card",
  "card.open",
  "card.see",
  "pdp.size-guide",
  "community.follow",
  "reco.product",
];
const prices = { "pull-a-capuche-koda": 69.99, "sweat-koda": 59.99, "t-shirt-koda": 34.99 };
const rnd = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rnd(arr.length)];

let sent = 0;
for (let i = 0; i < SESSIONS; i++) {
  const session = `demo-${i}`;
  const locale = Math.random() < 0.85 ? "fr" : "en";
  const dayOffset = Math.floor((1 - Math.random() ** 1.6) * DAYS); // plus de trafic récemment
  let t = Date.now() - dayOffset * 86_400_000 - rnd(86_400_000);
  const step = () => {
    t += 5_000 + rnd(40_000);
    return new Date(t).toISOString();
  };
  const home = locale === "fr" ? "/" : "/en";
  const batch = [{ name: "page_view", at: step(), session, path: home, locale, props: {} }];
  if (Math.random() < 0.35)
    batch.push({ name: "click", at: step(), session, path: home, locale, props: { target: pick(targets) } });
  if (Math.random() < 0.12) {
    const noResult = Math.random() < 0.4;
    batch.push({
      name: "search",
      at: step(),
      session,
      path: home,
      locale,
      props: { query: noResult ? pick(["chaussettes", "casquette", "bonnet"]) : "hoodie", results: noResult ? 0 : 3 },
    });
  }
  if (Math.random() < 0.6) {
    const productId = pick(products);
    const colorKey = pick(colors);
    const path = `${locale === "fr" ? "/produits/" : "/en/products/"}${productId}`;
    batch.push({ name: "page_view", at: step(), session, path, locale, props: {} });
    batch.push({ name: "product_view", at: step(), session, path, locale, props: { productId, colorKey } });
    if (Math.random() < 0.4) {
      batch.push({
        name: "product_chosen",
        at: step(),
        session,
        path,
        locale,
        props: { productId, colorKey, size: pick(sizes), unitPrice: prices[productId] },
      });
      if (Math.random() < 0.3)
        batch.push({ name: "click", at: step(), session, path, locale, props: { target: "reco.product" } });
      if (Math.random() < 0.55) {
        const total = prices[productId];
        batch.push({
          name: "checkout_started",
          at: step(),
          session,
          path: "/commande",
          locale,
          props: { count: 1, total },
        });
        if (Math.random() < 0.25)
          batch.push({
            name: "checkout_failed",
            at: step(),
            session,
            path: "/commande",
            locale,
            props: { code: pick(["invalid-zip", "invalid-email", "payment-declined"]) },
          });
        else batch.push({ name: "order_placed", at: step(), session, path: "/commande", locale, props: { total } });
      }
    }
  }
  if (Math.random() < 0.08)
    batch.push({ name: "newsletter_subscribed", at: step(), session, path: home, locale, props: {} });
  const res = await fetch(`${BASE}/api/track`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(batch),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  sent += batch.length;
}
console.log(`${sent} événements envoyés à ${BASE}/api/track (${SESSIONS} sessions sur ${DAYS} jours).`);
