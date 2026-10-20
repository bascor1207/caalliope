/** Interface publique serveur de la slice marketing. */
export { listLiveBanners } from "./application/use-cases";
export type { Banner } from "./domain/banner";
export { activeNetworks, handleOf, type SocialLinks, type SocialNetwork } from "./domain/social";
export { bannersRepository } from "./infrastructure/container";
export { getSiteMedia, getSocialLinks, type SiteMedia, type VideoMedia } from "./infrastructure/site-settings";
