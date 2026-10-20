import type { Metadata } from "next";
import { getBanners, getMedia } from "@/lib/marketing";
import { storageConfigured } from "@/lib/storage";
import { BannersForm, VideoBlockForm } from "./marketing-forms";

export const metadata: Metadata = { title: "Marketing" };
export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const [media, banners] = await Promise.all([getMedia(), getBanners()]);
  const storage = storageConfigured();
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 pt-5 pb-10 md:px-9 md:pt-6 md:pb-12">
      <header>
        <p className="eyebrow">KODA Clothing</p>
        <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">Marketing</h1>
        <p className="mt-3 text-[15px] text-muted">
          Vidéos de l'accueil et bandeau d'annonces. Chaque enregistrement met la boutique à jour.
        </p>
      </header>

      <section className="card mt-10" aria-labelledby="hero-title">
        <h2 id="hero-title" className="text-[19px] font-semibold tracking-[-0.02em]">
          Vidéo de fond du hero
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted">
          Fond du titre de l'accueil : formes pastel animées, ta vidéo, ou rien. Par défaut : les formes pastel.
        </p>
        <VideoBlockForm
          block="hero"
          current={media.hero}
          defaultLabel="Formes pastel seules"
          storage={storage}
          blobs={media.heroBlobs ?? true}
        />
      </section>

      <section className="card mt-6" aria-labelledby="story-title">
        <h2 id="story-title" className="text-[19px] font-semibold tracking-[-0.02em]">
          Bloc vidéo « Notre histoire »
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted">
          Grand bloc plein cadre sur l'accueil, texte en surimpression. Par défaut : le fichier déposé dans le code
          (public/media/koda-story.mp4), ou masqué s'il manque.
        </p>
        <VideoBlockForm block="story" current={media.story} defaultLabel="Vidéo du code" storage={storage} />
      </section>

      <section className="card mt-6" aria-labelledby="banners-title">
        <h2 id="banners-title" className="text-[19px] font-semibold tracking-[-0.02em]">
          Bandeau d'annonces
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted">
          Messages qui défilent au-dessus du header. Une période permet de programmer une opération (Black Friday…).
        </p>
        <BannersForm initial={banners} />
      </section>
    </main>
  );
}
