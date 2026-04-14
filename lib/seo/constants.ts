/** Sitewide default: root layout `description`, homepage, JSON-LD `WebSite.description`. */
export const SITE_DESCRIPTION =
  "Family relocation guides for parents — compare cities on visas, international schools, childcare, safety, and monthly costs before you move.";

/** Homepage only: same string for `<title>`, `og:title`, and `twitter:title`. */
export const SITE_HOME_TITLE =
  "Family Relocation Guide: Visas, Schools & Childcare | Family Relocation Engine";

/**
 * Homepage social preview (`/public` asset). OG + Twitter + JSON-LD `WebSite.image`.
 * `?v=` cache-busts Facebook/LinkedIn when you replace the file — otherwise platforms
 * keep the old image (or a fallback scrapped from the page) for days.
 */
export const SITE_HOME_OG_IMAGE = "/og-home.png?v=2";

/** Alt text for `SITE_HOME_OG_IMAGE` (accessibility + some crawlers). */
export const SITE_HOME_OG_IMAGE_ALT =
  "Family on a beach at sunset — a relaxed, hopeful mood for planning your next move abroad";
