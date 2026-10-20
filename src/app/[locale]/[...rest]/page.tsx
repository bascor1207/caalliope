import { notFound } from "next/navigation";

/** Toute route inconnue sous une locale rend la page 404 localisée. */
export default function CatchAllPage() {
  notFound();
}
