import type { BannerSource } from "../domain/banner";

/** Port de lecture des bannières. In-memory pour le POC ; l'espace d'admin écrira dans une vraie base. */
export interface BannersRepository {
  listBanners(): Promise<BannerSource[]>;
}
