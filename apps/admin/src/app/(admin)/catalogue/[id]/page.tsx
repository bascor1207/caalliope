import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogProduct, getPalette, listCatalog } from "@/lib/catalog";
import { emptyProduct } from "@/lib/catalog-types";
import { storageConfigured } from "@/lib/storage";
import { ProductEditor } from "./product-editor";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (id === "nouveau") return { title: "Nouvelle fiche" };
  const p = await getCatalogProduct(id);
  return { title: p ? p.data.name.fr : "Fiche" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [palette, all] = await Promise.all([getPalette(), listCatalog()]);
  const isNew = id === "nouveau";
  const product = isNew
    ? { id: "nouveau", slug: "", sort: all.length, active: false, data: emptyProduct(), updatedAt: "" }
    : await getCatalogProduct(id);
  if (!product) notFound();
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 py-8 md:px-9 md:py-10">
      <header>
        <p className="eyebrow">
          <Link href="/catalogue" className="hover:underline">
            Catalogue
          </Link>{" "}
          · {isNew ? "Nouvelle fiche" : "Fiche produit"}
        </p>
        <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">
          {isNew ? "Nouvelle fiche" : product.data.name.fr}
        </h1>
        <p className="mt-3 text-[15px] text-muted">
          {isNew ? "Elle apparaît sur la boutique dès qu'elle est en ligne." : `/produits/${product.slug}`}
        </p>
      </header>
      <ProductEditor product={product} palette={Object.values(palette)} storage={storageConfigured()} />
    </main>
  );
}
