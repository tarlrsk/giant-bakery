"use server";

import paths from "@/utils/paths";
import apiPaths from "@/utils/api-path";
import { revalidatePath } from "next/cache";
import { IBakeryCategory } from "@/components/BakeryItems";

// ----------------------------------------------------------------------

export async function getBakeriesByCategory(category: IBakeryCategory) {
  const { getBakeries } = apiPaths();

  const res = await fetch(getBakeries(category));

  const data = await res.json();

  revalidatePath(paths.bakeryList());

  return data;
}

export async function getBakeryBySlug(slug: string, id: string) {
  const { getBakeryBySlug } = apiPaths();

  const res = await fetch(getBakeryBySlug(slug, id));

  const data = await res.json();

  revalidatePath(paths.bakeryItem(slug, id));

  return data;
}
