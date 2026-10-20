import type { Metadata } from "next";
import type { Locale } from "@/shared/kernel/locale";
import { CategoryPage, categoryMetadata } from "../../_shell/category-page";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = (props: Props): Promise<Metadata> => categoryMetadata(props, "sweat");

export default function Page(props: Props) {
  return CategoryPage(props, "sweat");
}
