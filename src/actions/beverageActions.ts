"use server";

import paths from "@/lib/paths";
import apiPaths from "@/utils/api-path";
import { revalidatePath } from "next/cache";

export async function getAllBeverages() {
  const { getBeverages } = apiPaths();

  const res = await fetch(getBeverages());

  const data = await res.json();

  revalidatePath(paths.beverageList());

  return data;
}
