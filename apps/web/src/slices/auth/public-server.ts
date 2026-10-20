/** Interface publique serveur de la slice auth : session courante, feature flags, rafraîchissement de session. */
export { getAuthFeatures } from "./infrastructure/features";
export { getSessionUser } from "./infrastructure/session";
export { supabaseServer } from "./infrastructure/supabase.server";
export { refreshSession } from "./infrastructure/update-session";
