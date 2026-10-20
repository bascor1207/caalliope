import { hasDatabase } from "@koda/db";
import type { BannersRepository } from "../application/ports";
import { BANNERS } from "./banners.data";
import { getBanners } from "./site-settings";

/** Bannières : réglages du back-office quand la base est là, sinon le fichier du code. */
export const bannersRepository: BannersRepository = {
  listBanners: async () => (hasDatabase() ? getBanners() : BANNERS),
};
