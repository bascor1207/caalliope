#!/usr/bin/env node
/**
 * Règles d'architecture : vertical slices, clean architecture dans chaque slice, domaine pur.
 * Vérifiées sur les imports de src/** (et tests/**, qui peuvent cibler les internes d'une slice).
 *
 * Interface publique d'une slice = ses fichiers `public-<type>.ts(x)` à sa racine
 * (public-types, public-server, public-store, public-ui...). Tout import venant de l'extérieur
 * d'une slice DOIT cibler `@/slices/<slice>/public-<type>` : jamais un fichier interne.
 *
 *  - slices/<s>/domain          → son propre dossier et @/shared/kernel. Aucune librairie.
 *  - slices/<s>/application     → domain/application de la slice, @/shared/kernel, @/shared/event-bus, @reduxjs/*.
 *  - slices/<s>/infrastructure  → sa slice, @/shared/*, et les autres slices via leur interface publique (adapters).
 *  - slices/<s>/ui, content     → sa slice, @/shared/*, @/i18n/*, @/store/hooks, libs UI. Jamais une autre slice.
 *  - slices/<s>/public-*.ts(x)  → sa slice uniquement (ré-exports).
 *  - app/**, store/**           → les slices uniquement via leur interface publique.
 *  - shared/**, i18n/**         → jamais une slice, ni le store, ni l'app.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const SRC = new URL("../src/", import.meta.url).pathname;
const TESTS = new URL("../tests/", import.meta.url).pathname;
const IMPORT_RE = /(?:import|export)\s[^"']*?from\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
const PUBLIC_FILE = /^public-[a-z0-9-]+$/;

const walk = (dir) => {
  try {
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return walk(full);
      return /\.(ts|tsx|mjs)$/.test(name) && !name.endsWith(".d.ts") ? [full] : [];
    });
  } catch {
    return [];
  }
};

const sliceOf = (rel) => rel.match(/^slices\/([^/]+)\//)?.[1] ?? null;
const layerOf = (rel) => {
  const inner = rel.match(/^slices\/[^/]+\/(domain|application|infrastructure|ui|content)\//)?.[1];
  if (inner) return inner;
  const root = rel.match(/^slices\/[^/]+\/([^/]+)\.tsx?$/)?.[1];
  if (root && PUBLIC_FILE.test(root)) return "public";
  return root ? "root" : null;
};

/** Décompose un import `@/slices/<s>/<reste>`. */
const parseSliceTarget = (target) => {
  const m = target?.match(/^slices\/([^/]+)(?:\/(.+))?$/);
  if (!m) return null;
  const [, slice, rest = ""] = m;
  return { slice, rest, isPublic: PUBLIC_FILE.test(rest) };
};

const violations = [];
const fail = (rel, spec, rule) => violations.push(`${rel}\n    → "${spec}"  (${rule})`);

const check = (file, root, { isTest }) => {
  const rel = relative(root, file).split(sep).join("/");
  const source = readFileSync(file, "utf8");
  const slice = isTest ? null : sliceOf(rel);
  const layer = isTest ? null : layerOf(rel);

  for (const match of source.matchAll(IMPORT_RE)) {
    const spec = match[1] ?? match[2];
    if (!spec) continue;
    const isRelative = spec.startsWith(".");
    const isAlias = spec.startsWith("@/");
    const isLib = !isRelative && !isAlias;
    const target = isAlias ? spec.slice(2) : null;
    const sliceTarget = parseSliceTarget(target);

    if (isTest) continue; // les tests peuvent cibler les internes (tests unitaires de domaine)

    if (slice) {
      if (layer === "root")
        fail(rel, spec, "seuls des fichiers public-<type>.ts(x) sont autorisés à la racine d'une slice");

      // Cross-slice : uniquement via l'interface publique, et uniquement depuis l'infrastructure.
      if (sliceTarget && sliceTarget.slice !== slice) {
        if (!sliceTarget.isPublic) fail(rel, spec, "import cross-slice : passer par public-<type> de la slice cible");
        if (layer !== "infrastructure") {
          fail(rel, spec, "seule la couche infrastructure (adapters) peut dépendre d'une autre slice");
        }
      }
      // Une slice ne s'importe elle-même qu'en relatif (évite les cycles via son interface publique).
      if (sliceTarget && sliceTarget.slice === slice)
        fail(rel, spec, "à l'intérieur d'une slice, utiliser des imports relatifs");
      if (target?.startsWith("store/") && layer !== "ui") fail(rel, spec, "seule la couche ui peut lire le store");
      if (target?.startsWith("app/")) fail(rel, spec, "une slice n'importe jamais l'app");

      if (layer === "domain") {
        if (isLib && !spec.startsWith("@koda/"))
          fail(rel, spec, "le domaine est pur : aucune librairie (hors packages @koda/*)");
        if (isAlias && !target.startsWith("shared/kernel")) fail(rel, spec, "le domaine n'importe que @/shared/kernel");
        if (isRelative && spec.includes("../")) fail(rel, spec, "le domaine n'importe que son propre dossier");
      }
      if (layer === "application") {
        if (isLib && !/^(@reduxjs|@koda)\//.test(spec))
          fail(rel, spec, "l'application n'utilise que RTK et les packages @koda/* comme librairies");
        if (isAlias && !/^shared\/(kernel|event-bus)/.test(target))
          fail(rel, spec, "l'application n'importe que kernel et event-bus");
        if (isRelative && /\.\.\/(infrastructure|ui|content)\//.test(spec))
          fail(rel, spec, "l'application ne dépend ni de l'infrastructure ni de l'ui");
      }
      if (layer === "infrastructure" && isRelative && /\.\.\/ui\//.test(spec))
        fail(rel, spec, "l'infrastructure ne dépend pas de l'ui");
      if (layer === "public" && !isRelative)
        fail(rel, spec, "un fichier public-<type> ne fait que ré-exporter sa propre slice");
    } else if (/^(shared|i18n)\//.test(rel)) {
      if (target && /^(slices|store|app)\//.test(target))
        fail(rel, spec, "shared et i18n ne connaissent ni les slices, ni le store, ni l'app");
    } else if (/^(app|store)\//.test(rel)) {
      if (sliceTarget && !sliceTarget.isPublic)
        fail(rel, spec, "app et store n'importent les slices que via public-<type>");
    }
  }
};

for (const file of walk(SRC)) check(file, SRC, { isTest: false });
for (const file of walk(TESTS)) check(file, TESTS, { isTest: true });

if (violations.length) {
  console.error(`✖ ${violations.length} violation(s) d'architecture :\n`);
  for (const v of violations) console.error(`  ${v}\n`);
  process.exit(1);
}
console.log(
  "✔ Architecture OK : vertical slices étanches (interfaces public-<type>), domaine pur, dépendances dirigées.",
);
