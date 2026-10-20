import type account from "../../messages/fr/account.json";
import type auth from "../../messages/fr/auth.json";
import type cart from "../../messages/fr/cart.json";
import type catalog from "../../messages/fr/catalog.json";
import type checkout from "../../messages/fr/checkout.json";
import type common from "../../messages/fr/common.json";
import type footer from "../../messages/fr/footer.json";
import type header from "../../messages/fr/header.json";
import type home from "../../messages/fr/home.json";
import type meta from "../../messages/fr/meta.json";
import type newsletter from "../../messages/fr/newsletter.json";
import type notifications from "../../messages/fr/notifications.json";
import type pages from "../../messages/fr/pages.json";
import type { routing } from "./routing";

/** Clés de traduction typées : une faute de clé est une erreur TypeScript. */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      common: typeof common;
      meta: typeof meta;
      header: typeof header;
      footer: typeof footer;
      home: typeof home;
      catalog: typeof catalog;
      cart: typeof cart;
      checkout: typeof checkout;
      newsletter: typeof newsletter;
      pages: typeof pages;
      notifications: typeof notifications;
      auth: typeof auth;
      account: typeof account;
    };
  }
}
