import type { Metadata } from "next";
import { Sections } from "@/components/sections";
import { getAnnouncement, getBanners, getMedia } from "@/lib/marketing";
import { defaultVideo, storageConfigured } from "@/lib/storage";
import { AnnouncementForm, BannersForm, VideoBlockForm } from "./marketing-forms";

export const metadata: Metadata = { title: "Marketing" };
export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const [media, banners, announcement] = await Promise.all([getMedia(), getBanners(), getAnnouncement()]);
  const storage = storageConfigured();
  const defaults = { hero: defaultVideo("koda-hero"), story: defaultVideo("koda-story") };
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 pt-5 pb-10 md:px-9 md:pt-6 md:pb-12">
      <header>
        <p className="eyebrow">KODA Clothing</p>
        <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">Marketing</h1>
        <p className="mt-3 text-[15px] text-muted">
          Vidéos de l'accueil, bandeau d'annonces et annonce plein écran. Chaque enregistrement met la boutique à jour.
        </p>
      </header>
      <Sections
        items={[
          {
            id: "hero",
            label: "Hero",
            children: (
              <>
                <section className="card mt-10" aria-labelledby="hero-title">
                  <h2 id="hero-title" className="text-[19px] font-semibold tracking-[-0.02em]">
                    Vidéo de fond du hero
                  </h2>
                  <p className="mt-1 mb-6 text-sm text-muted">
                    Fond du titre de l'accueil : la vidéo de marque (fond.mp4, hébergée sur Supabase Storage) sous les
                    formes pastel, ta propre vidéo, ou un fond uni.
                  </p>
                  <VideoBlockForm
                    block="hero"
                    current={media.hero}
                    defaultLabel="Vidéo du code + formes pastel"
                    storage={storage}
                    blobs={media.heroBlobs ?? true}
                    defaultVideo={defaults.hero}
                  />
                </section>
              </>
            ),
          },
          {
            id: "histoire",
            label: "Histoire",
            children: (
              <>
                <section className="card mt-6" aria-labelledby="story-title">
                  <h2 id="story-title" className="text-[19px] font-semibold tracking-[-0.02em]">
                    Bloc vidéo « Notre histoire »
                  </h2>
                  <p className="mt-1 mb-6 text-sm text-muted">
                    Grand bloc plein cadre sur l'accueil, texte en surimpression. Par défaut : la vidéo de marque
                    hébergée sur Supabase Storage (marketing/koda-story.mp4).
                  </p>
                  <VideoBlockForm
                    block="story"
                    current={media.story}
                    defaultLabel="Vidéo de marque"
                    storage={storage}
                    defaultVideo={defaults.story}
                  />
                </section>
              </>
            ),
          },
          {
            id: "bandeau",
            label: "Bandeau",
            children: (
              <>
                <section className="card mt-6" aria-labelledby="banners-title">
                  <h2 id="banners-title" className="text-[19px] font-semibold tracking-[-0.02em]">
                    Bandeau d'annonces
                  </h2>
                  <p className="mt-1 mb-6 text-sm text-muted">
                    Messages qui défilent au-dessus du header. Une période permet de programmer une opération (Black
                    Friday…).
                  </p>
                  <BannersForm initial={banners} />
                </section>
              </>
            ),
          },
          {
            id: "annonce",
            label: "Annonce",
            children: (
              <>
                <section className="card mt-6" aria-labelledby="announcement-title">
                  <h2 id="announcement-title" className="text-[19px] font-semibold tracking-[-0.02em]">
                    Annonce plein écran
                  </h2>
                  <p className="mt-1 mb-6 text-sm text-muted">
                    Une modale à l'arrivée sur la boutique : avertissement (retard, fermeture), promo avec code,
                    nouveauté. Vue une fois par visiteur, programmable.
                  </p>
                  <AnnouncementForm current={announcement} />
                </section>
              </>
            ),
          },
        ]}
      />
    </main>
  );
}
