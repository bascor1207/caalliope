import type { BannersRepository } from "../application/ports";
import { BANNERS } from "./banners.data";

export const bannersRepository: BannersRepository = {
  listBanners: async () => BANNERS,
};
