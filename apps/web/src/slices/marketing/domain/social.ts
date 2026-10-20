/** Liens sociaux et contact affichés par la boutique. Pur. */
export interface SocialLinks {
  instagram: string;
  tiktok: string;
  facebook: string;
  youtube: string;
  email: string;
}

export type SocialNetwork = Exclude<keyof SocialLinks, "email">;

export const SOCIAL_NETWORKS: SocialNetwork[] = ["instagram", "tiktok", "facebook", "youtube"];

/** Réseaux renseignés, dans l'ordre d'affichage. */
export const activeNetworks = (links: SocialLinks): Array<[SocialNetwork, string]> =>
  SOCIAL_NETWORKS.flatMap((n) => (links[n] ? [[n, links[n]] as [SocialNetwork, string]] : []));

/** « https://www.instagram.com/koda__clothing/ » → « @koda__clothing ». */
export const handleOf = (url: string): string => {
  const path = url.replace(/^https?:\/\/[^/]+\//, "").replace(/\/+$/, "");
  const last = path.split("/").pop() ?? "";
  return last ? `@${last.replace(/^@/, "")}` : url;
};
