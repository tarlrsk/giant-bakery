import { prisma } from "./prisma";
import { Discount, DiscountType } from "@prisma/client";

type Discounts = {
    id: string;
    name: string;
    discount: number;
};

export async function FindSuggestDiscounts(snackBoxQty: number, subTotal: number): Promise<string[]> {
    const result: string[] = []
    const suggest1 = await FindSuggestGeneralDiscount(subTotal)
    if (suggest1) {
        result.push(suggest1)
    }
    const suggest2 = await FindSuggestSnackBoxDiscount(snackBoxQty)
    if (suggest2) {
        result.push(suggest2)
    }
    return result
}

export async function FindSuggestGeneralDiscount(subTotal: number): Promise<string | null> {
    const discounts = await prisma.discount.findMany({
        where: {
            type: DiscountType.NORMAL
        },
        orderBy: {
            conditionValue: "asc"
        }
    })
    let suggestDiscount: Discount | null = null
    for (let discount of discounts) {
        if (subTotal < discount.conditionValue) {
            suggestDiscount = discount
            break;
        }
    }
    if (suggestDiscount) {
        return `${suggestDiscount.description} ส่วนลด ${suggestDiscount.pct}%`
    }
    return null
}

export async function FindSuggestSnackBoxDiscount(snackBoxQty: number): Promise<string | null> {
    const discounts = await prisma.discount.findMany({
        where: {
            type: DiscountType.SNACK_BOX
        },
        orderBy: {
            conditionValue: "asc"
        }
    })
    let suggestDiscount: Discount | null = null
    for (let discount of discounts) {
        if (snackBoxQty < discount.conditionValue) {
            suggestDiscount = discount
            break;
        }
    }
    if (suggestDiscount) {
        return `${suggestDiscount.description} ส่วนลด ${suggestDiscount.pct}%`
    }
    return null
}

export async function CalGeneralDiscount(subTotal: number): Promise<Discounts | null> {
    const discounts = await prisma.discount.findMany({
        where: {
            type: DiscountType.NORMAL
        },
        orderBy: {
            conditionValue: "asc"
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
        },
        orderBy: {
            conditionValue: "asc"
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