"use server";

import paths from "@/utils/api-path";

// ----------------------------------------------------------------------

export async function getBakeryByCategory(category: string) {
  const { getBakeryByCat } = paths();

  const res = await fetch(getBakeryByCat(category));

  const data = await res.json();

  return data;
}
