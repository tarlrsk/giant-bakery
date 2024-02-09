"use server";

import paths from "@/utils/paths";
import apiPaths from "@/utils/api-path";
import { revalidatePath } from "next/cache";

// ----------------------------------------------------------------------

export async function getBakeryByCategory(category: string) {
  const { getBakeryByCat } = apiPaths();

  const res = await fetch(getBakeryByCat(category));

  const data = await res.json();

  revalidatePath(paths.bakeryList());

  return data;
}
