import type { Locale } from "@/shared/kernel/locale";
import { type Banner, liveBanners } from "../domain/banner";
import type { BannersRepository } from "./ports";

export async function listLiveBanners(repo: BannersRepository, locale: Locale, now = new Date()): Promise<Banner[]> {
  return liveBanners(await repo.listBanners(), locale, now);
}
