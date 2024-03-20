import { prisma } from "./prisma";
import { Discount, DiscountType } from "@prisma/client";

type Discounts = {
    id: string;
    name: string;
    discount: number;
};

export async function CalGeneralDiscount(subTotal: number): Promise<Discounts | null> {
    const discounts = await prisma.discount.findMany({
        where: {
            type: DiscountType.NORMAL
        }
    })
    let achieveDiscount: Discount | null = null
    for (let discount of discounts) {
        if (subTotal >= discount.conditionValue) {
            achieveDiscount = discount
        } else {
            break;
        }
    }
    let result: Discounts | null = null
    if (achieveDiscount) {
        result = {
            id: achieveDiscount.id,
            name: `${achieveDiscount.description} ส่วนลด ${achieveDiscount.pct}%`,
            discount: Math.round(achieveDiscount.pct / 100 * subTotal)
        }
    }
    return result
}

export async function CalSnackBoxDiscount(snackBoxQty: number, snackBoxTotalPrice: number): Promise<Discounts | null> {
    const discounts = await prisma.discount.findMany({
        where: {
            type: DiscountType.SNACK_BOX
        }
    })
    let achieveDiscount: Discount | null = null
    for (let discount of discounts) {
        if (snackBoxQty >= discount.conditionValue) {
            achieveDiscount = discount
        } else {
            break;
        }
    }
    let result: Discounts | null = null
    if (achieveDiscount) {
        result = {
            id: achieveDiscount.id,
            name: `${achieveDiscount.description} ส่วนลด ${achieveDiscount.pct}%`,
            discount: Math.round(achieveDiscount.pct / 100 * snackBoxTotalPrice)
        }
    }
    return result
}