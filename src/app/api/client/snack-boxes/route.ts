import paths from "@/utils/paths";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { SnackBoxType } from "@prisma/client";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { responseWrapper } from "@/utils/api-response-wrapper";

export async function GET(_req: NextRequest) {
  try {
    const snackBoxes = await prisma.snackBox.findMany({
      where: {
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

    for (var snackBox of snackBoxes) {
      if (snackBox.imagePath) {
        (snackBox as any).image = await getFileUrl(snackBox.imagePath);
      }

      for (var snackBoxRefreshment of snackBox.refreshments) {
        if (snackBoxRefreshment.refreshment.imagePath) {
          snackBoxRefreshment.refreshment.image = await getFileUrl(
            snackBoxRefreshment.refreshment.imagePath,
          );
        }
      }
    }

    revalidatePath(paths.snackBoxList());

    return responseWrapper(200, snackBoxes, null);
  } catch (err: any) {
    return responseWrapper(500, null, err.message);
  }
}
