import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { SnackBoxType } from "@prisma/client";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

type GetSnackBoxBySlug = {
  params: {
    slug: string;
  };
};

export async function GET(req: NextRequest, { params }: GetSnackBoxBySlug) {
  try {
    const id = req.nextUrl.searchParams.get("id") as string;
    const { slug } = params;

    const snackBox = await prisma.snackBox.findFirst({
      where: {
        id: id,
        isActive: true,
        isDeleted: false,
        type: SnackBoxType.PRESET,
      },
      include: {
        refreshments: {
          include: {
            refreshment: true,
          },
        },
      },
    });

    if (!snackBox) {
      return responseWrapper(
        404,
        null,
        `${slug} with given id ${id} not found.`,
      );
    }

    if (snackBox.imagePath != null && snackBox.imagePath != "") {
      (snackBox as any).image = await getFileUrl(snackBox.imagePath);
    }

    for (var snackBoxRefreshment of snackBox.refreshments) {
      if (snackBoxRefreshment.refreshment.imagePath) {
        snackBoxRefreshment.refreshment.image = await getFileUrl(
          snackBoxRefreshment.refreshment.imagePath,
        );
      }
    }

    revalidatePath(paths.snackBoxList());

    return responseWrapper(200, snackBox, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
