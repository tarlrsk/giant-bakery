import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { prismaCart } from "@/persistence/cart";
import { prismaUser } from "@/persistence/user";
import { getFileUrl } from "@/lib/gcs/getFileUrl";
import { prismaOrder } from "@/persistence/order";
import { createStripeSession } from "@/lib/stripe";
import { calculateShippingFee } from "@/lib/interExpress";
import { responseWrapper } from "@/utils/api-response-wrapper";
import { checkoutCartValidateSchema } from "@/lib/validationSchema";
import { prismaCustomerAddress } from "@/persistence/customerAddress";
import { CalGeneralDiscount, CalSnackBoxDiscount } from "@/lib/discount";
import {
  Order,
  Prisma,
  ReceivedVia,
  PaymentType,
  OrderStatus,
  CustomerAddress,
  OrderRefreshment,
  OrderCustomerCake,
  OrderSnackBoxRefreshment,
} from "@prisma/client";

type LineItem = {
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      images: string[];
      name: string;
    };
  };
  quantity: number;
};

var order = null as Order | null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      addressId,
      userId,
      paymentMethod,
      paymentType,
      remark,
      receivedVia,
      email,
      firstName,
      lastName,
      phone,
    } = body;

    const validate = checkoutCartValidateSchema.safeParse(body);
    if (!validate.success) {
      return responseWrapper(400, null, validate.error.message);
    }

    const user = await prismaUser().getUserById(userId);
    if (!user) {
      return responseWrapper(404, null, `User not found.`);
    }

    let cFirstName = user.firstName;
    let cLastName = user.lastName;
    let phoneNo = user.phone;
    let address: CustomerAddress | null = null;
    let shippingFee = 0;
    if (receivedVia === ReceivedVia.DELIVERY) {
      address = await prismaCustomerAddress().getUserAddressById(addressId);
      if (!address) {
        return responseWrapper(404, null, `Address is not found`);
      }
      shippingFee = await calculateShippingFee(address);
      cFirstName = address.cFirstName;
      cLastName = address.cLastName;
      phoneNo = address.phone;
    } else {
      cFirstName = firstName;
      cLastName = lastName;
      phoneNo = phone;
    }

    const cart = await prismaCart().getCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      return responseWrapper(
        404,
        null,
        `Cart with user id: ${userId} is not found.`,
      );
    }

    // MAP LineItems
    // TODO Check STOCK
    const lineItems = [] as LineItem[];
    for (var cartItem of cart.items) {
      switch (cartItem.type) {
        case "PRESET_CAKE":
          if (!cartItem.customerCake || !cartItem.customerCake.cake) {
            return responseWrapper(409, null, "Cake Type is missing cake.");
          }

          var image: string[] = [];
          if (cartItem.customerCake.cake.imagePath) {
            image.push(await getFileUrl(cartItem.customerCake.cake.imagePath));
          }
          lineItems.push({
            price_data: {
              currency: "thb",
              unit_amount: cartItem.customerCake.price,
              product_data: {
                images: image,
                name: cartItem.customerCake.name,
              },
            },
            quantity: cartItem.quantity,
          });
          break;
        case "CUSTOM_CAKE":
          if (!cartItem.customerCake) {
            return responseWrapper(409, null, "Cake Type is missing cake.");
          }

          var image: string[] = [];
          lineItems.push({
            price_data: {
              currency: "thb",
              unit_amount: cartItem.customerCake.price,
              product_data: {
                images: image,
                name: cartItem.customerCake.name,
              },
            },
            quantity: cartItem.quantity,
          });
          break;
        case "REFRESHMENT":
          if (!cartItem.refreshment) {
            return responseWrapper(
              409,
              null,
              "Refreshment is missing refreshment.",
            );
          }

          var image: string[] = [];
          if (cartItem.refreshment.imagePath) {
            image.push(await getFileUrl(cartItem.refreshment.imagePath));
          }
          lineItems.push({
            price_data: {
              currency: "thb",
              unit_amount: cartItem.refreshment.price,
              product_data: {
                images: image,
                name: cartItem.refreshment.name,
              },
            },
            quantity: cartItem.quantity,
          });
          break;
        case "SNACK_BOX":
          if (!cartItem.snackBox) {
            return responseWrapper(
              409,
              null,
              "Snack Box is missing snack box.",
            );
          }
          var image: string[] = [];
          if (cartItem.snackBox.imagePath) {
            image.push(await getFileUrl(cartItem.snackBox.imagePath));
          }
          lineItems.push({
            price_data: {
              currency: "thb",
              unit_amount: cartItem.snackBox.price,
              product_data: {
                images: image,
                name: cartItem.snackBox.name,
              },
            },
            quantity: cartItem.quantity,
          });
          break;
      }
    }
    console.log(lineItems);

    // TODO DISCOUNT
    let snackBoxQty = 0;
    let snackBoxTotalPrice = 0;

    // CREATE ORDER ITEMS
    let subTotal = 0 as number;
    const orderCustomCakes = [] as OrderCustomerCake[];
    const orderRefreshments = [] as OrderRefreshment[];
    const orderSnackBoxes = [] as Prisma.OrderSnackBoxGetPayload<{
      include: { refreshments: true };
    }>[];

    for (var cartItem of cart?.items) {
      switch (cartItem.type) {
        case "PRESET_CAKE":
          if (!cartItem.customerCake || !cartItem.customerCake.cake) {
            return responseWrapper(
              409,
              null,
              "Cake Item missing Customer Cake",
            );
          }
          orderCustomCakes.push({
            id: "",
            name: cartItem.customerCake.cake.name,
            quantity: cartItem.quantity,
            description: cartItem.customerCake.cake.description,
            remark: cartItem.customerCake.cake.remark!,
            imageFileName: cartItem.customerCake.cake.imageFileName!,
            imagePath: cartItem.customerCake.cake.imagePath,
            image: cartItem.customerCake.cake.image,
            pricePer: cartItem.customerCake.price,
            price: cartItem.customerCake.price * cartItem.quantity,
            weight: cartItem.customerCake.cake.weight,
            height: cartItem.customerCake.cake.height,
            length: cartItem.customerCake.cake.length,
            width: cartItem.customerCake.cake.width,
            orderId: "1234",
            cakeType: cartItem.customerCake.type,
            customerCakeId: cartItem.customerCake.id,
            cakeId: cartItem.customerCake.cakeId,
            size: cartItem.customerCake.size?.name || null,
            base: cartItem.customerCake.base?.name || null,
            filling: cartItem.customerCake.filling?.name || null,
            cream: cartItem.customerCake.cream?.name || null,
            creamColor: cartItem.customerCake.cream?.color || null,
            topEdge: cartItem.customerCake.topEdge?.name || null,
            topEdgeColor: cartItem.customerCake.topEdge?.color || null,
            bottomEdge: cartItem.customerCake.bottomEdge?.name || null,
            bottomEdgeColor: cartItem.customerCake.bottomEdge?.color || null,
            decoration: cartItem.customerCake.decoration?.name || null,
            surface: cartItem.customerCake.surface?.name || null,
            cakeMessage: cartItem.customerCake.cakeMessage,
          });

          subTotal += cartItem.customerCake.price * cartItem.quantity;
          break;
        case "CUSTOM_CAKE":
          if (!cartItem.customerCake) {
            return responseWrapper(
              409,
              null,
              "Cake Item missing Customer Cake",
            );
          }

          const size = await prisma.masterCakeSize.findFirst({
            where: {
              id: cartItem.customerCake.sizeId!,
            },
          });
          if (!size) {
            return responseWrapper(404, null, "Size is not found.");
          }

          let weight = 0.0;
          let height = 0.0;
          let length = 0.0;
          let width = 0.0;
          switch (size.name) {
            case "1":
              weight = 100;
              height = 100;
              length = 100;
              width = 100;
              break;
            case "2":
              weight = 100;
              height = 100;
              length = 100;
              width = 100;
              break;
            case "3":
              weight = 100;
              height = 100;
              length = 100;
              width = 100;
              break;
          }

          let description = [
            cartItem.customerCake.size?.name || null,
            cartItem.customerCake.base?.name || null,
            cartItem.customerCake.filling?.name || null,
            cartItem.customerCake.cream?.name || null,
            cartItem.customerCake.cream?.color || null,
            cartItem.customerCake.topEdge?.name || null,
            cartItem.customerCake.topEdge?.color || null,
            cartItem.customerCake.bottomEdge?.name || null,
            cartItem.customerCake.bottomEdge?.color || null,
            cartItem.customerCake.decoration?.name || null,
            cartItem.customerCake.surface?.name || null,
          ]
            .filter(Boolean)
            .join(", ");

          orderCustomCakes.push({
            id: "",
            name: cartItem.customerCake.name,
            quantity: cartItem.quantity,
            description: description,
            remark: null,
            imageFileName: null,
            imagePath: null,
            image: null,
            pricePer: cartItem.customerCake.price,
            price: cartItem.customerCake.price * cartItem.quantity,
            weight: weight,
            height: height,
            length: length,
            width: width,
            orderId: "1234",
            cakeType: cartItem.customerCake.type,
            customerCakeId: cartItem.customerCake.id,
            cakeId: cartItem.customerCake.cakeId,
            size: cartItem.customerCake.size?.name || null,
            base: cartItem.customerCake.base?.name || null,
            filling: cartItem.customerCake.filling?.name || null,
            cream: cartItem.customerCake.cream?.name || null,
            creamColor: cartItem.customerCake.cream?.color || null,
            topEdge: cartItem.customerCake.topEdge?.name || null,
            topEdgeColor: cartItem.customerCake.topEdge?.color || null,
            bottomEdge: cartItem.customerCake.bottomEdge?.name || null,
            bottomEdgeColor: cartItem.customerCake.bottomEdge?.color || null,
            decoration: cartItem.customerCake.decoration?.name || null,
            surface: cartItem.customerCake.surface?.name || null,
            cakeMessage: cartItem.customerCake.cakeMessage,
          });

          subTotal += cartItem.customerCake.price * cartItem.quantity;
          break;
        case "REFRESHMENT":
          if (!cartItem.refreshment) {
            return responseWrapper(
              409,
              null,
              "Refreshment Item missing refreshment",
            );
          }
          orderRefreshments.push({
            id: "",
            name: cartItem.refreshment.name,
            description: cartItem.refreshment.description,
            remark: cartItem.refreshment.remark,
            quantity: cartItem.quantity,
            imageFileName: cartItem.refreshment.imageFileName,
            imagePath: cartItem.refreshment.imagePath,
            image: cartItem.refreshment.image,
            type: cartItem.refreshment.type,
            category: cartItem.refreshment.category,
            weight: cartItem.refreshment.weight,
            height: cartItem.refreshment.height,
            length: cartItem.refreshment.length,
            width: cartItem.refreshment.width,
            pricePer: cartItem.refreshment.price,
            price: cartItem.refreshment.price * cartItem.quantity,
            orderId: "",
            unitType: cartItem.refreshment.unitType,
            qtyPerUnit: cartItem.refreshment.qtyPerUnit,
            refreshmentId: cartItem.refreshment.id,
          });

          subTotal += cartItem.refreshment.price * cartItem.quantity;

          break;
        case "SNACK_BOX":
          if (!cartItem.snackBox) {
            return responseWrapper(
              409,
              null,
              "SnackBox Item missing snack box",
            );
          }

          var orderSnackBoxRefreshment = [] as OrderSnackBoxRefreshment[];
          for (var refreshment of cartItem.snackBox.refreshments) {
            orderSnackBoxRefreshment.push({
              id: "",
              name: refreshment.refreshment.name,
              description: refreshment.refreshment.description,
              remark: refreshment.refreshment.remark,
              imageFileName: refreshment.refreshment.imageFileName,
              imagePath: refreshment.refreshment.imagePath,
              image: refreshment.refreshment.image,
              type: refreshment.refreshment.type,
              category: refreshment.refreshment.category,
              weight: refreshment.refreshment.weight,
              height: refreshment.refreshment.height,
              length: refreshment.refreshment.length,
              width: refreshment.refreshment.width,
              price: refreshment.refreshment.price,
              orderSnackBoxId: "",
              unitType: refreshment.refreshment.unitType,
              qtyPerUnit: refreshment.refreshment.qtyPerUnit,
              refreshmentId: refreshment.refreshment.id,
            });
          }

          orderSnackBoxes.push({
            refreshments: orderSnackBoxRefreshment,
            id: "",
            name: cartItem.snackBox.name,
            quantity: cartItem.quantity,
            pricePer: cartItem.snackBox.price,
            price: cartItem.snackBox.price * cartItem.quantity,
            imageFileName: cartItem.snackBox.imageFileName,
            imagePath: cartItem.snackBox.imagePath,
            image: cartItem.snackBox.image,
            type: cartItem.snackBox.type,
            packageType: cartItem.snackBox.packageType,
            beverage: cartItem.snackBox.beverage,
            snackBoxId: cartItem.snackBox.id,
            orderId: "",
          });

          snackBoxQty += cartItem.quantity;
          snackBoxTotalPrice += cartItem.quantity * cartItem.snackBox.price;
          break;
      }
    }

    // CALCULATE DISCOUNT
    let totalDiscount = 0;
    const generalDiscount = await CalGeneralDiscount(subTotal);
    if (generalDiscount) {
      totalDiscount += generalDiscount.discount;
    }

    const snackBoxDiscount = await CalSnackBoxDiscount(
      snackBoxQty,
      snackBoxTotalPrice,
    );
    if (snackBoxDiscount) {
      totalDiscount += snackBoxDiscount.discount;
    }

    // CREATE ORDER
    order = await prismaOrder().createOrder({
      status: OrderStatus.PENDING_PAYMENT1,
      paymentType: paymentType,
      receivedVia: receivedVia,
      email: email,
      subTotalPrice: subTotal,
      discountPrice: totalDiscount,
      shippingFee: shippingFee,
      totalPrice: subTotal - totalDiscount + shippingFee,
      cFirstName: cFirstName,
      cLastName: cLastName,
      address: address?.address,
      district: address?.district,
      subdistrict: address?.subdistrict,
      province: address?.province,
      postcode: address?.postcode,
      phone: phoneNo,
      remark: remark,
      userId: userId,
      orderCake: {
        create: orderCustomCakes.map((cake) => ({
          name: cake.name,
          quantity: cake.quantity,
          remark: cake.remark,
          imageFileName: cake.imageFileName,
          imagePath: cake.imagePath,
          image: cake.image,
          pricePer: cake.pricePer,
          price: cake.price,
          weight: cake.weight,
          height: cake.height,
          length: cake.length,
          width: cake.width,
          cakeType: cake.cakeType,
          customerCakeId: cake.customerCakeId,
          cakeId: cake.cakeId,
          size: cake.size,
          base: cake.base,
          filling: cake.filling,
          cream: cake.filling,
          creamColor: cake.creamColor,
          topEdge: cake.topEdge,
          topEdgeColor: cake.topEdgeColor,
          bottomEdge: cake.bottomEdge,
          bottomEdgeColor: cake.bottomEdgeColor,
          decoration: cake.decoration,
          surface: cake.surface,
        })),
      },
      orderRefreshment: {
        create: orderRefreshments.map((refreshment) => ({
          name: refreshment.name,
          description: refreshment.description,
          remark: refreshment.remark,
          quantity: cartItem.quantity,
          imageFileName: refreshment.imageFileName,
          imagePath: refreshment.imagePath,
          image: refreshment.image,
          type: refreshment.type,
          category: refreshment.category,
          weight: refreshment.weight,
          height: refreshment.height,
          length: refreshment.length,
          width: refreshment.width,
          pricePer: refreshment.pricePer,
          price: refreshment.price,
          unitType: refreshment.unitType,
          qtyPerUnit: refreshment.qtyPerUnit,
          refreshmentId: refreshment.refreshmentId,
        })),
      },
      orderSnackBox: {
        create: orderSnackBoxes.map((snackBox) => ({
          name: snackBox.name,
          quantity: snackBox.quantity,
          pricePer: snackBox.pricePer,
          price: snackBox.price,
          imageFileName: snackBox.imageFileName,
          imagePath: snackBox.imagePath,
          image: snackBox.image,
          type: snackBox.type,
          packageType: snackBox.packageType,
          beverage: snackBox.beverage,
          snackBoxId: snackBox.snackBoxId,
          refreshments: {
            create: snackBox.refreshments.map((refreshment) => ({
              name: refreshment.name,
              description: refreshment.description,
              remark: refreshment.remark,
              imageFileName: refreshment.imageFileName,
              imagePath: refreshment.imagePath,
              image: refreshment.image,
              type: refreshment.type,
              category: refreshment.category,
              weight: refreshment.weight,
              height: refreshment.height,
              length: refreshment.length,
              width: refreshment.width,
              price: refreshment.price,
              unitType: refreshment.unitType,
              qtyPerUnit: refreshment.qtyPerUnit,
              refreshmentId: refreshment.refreshmentId,
            })),
          },
        })),
      },
    });

    // DETERMINE PAYMENT TYPE LETTER.
    const paymentTypeLetter =
      order.paymentType === PaymentType.SINGLE ? "F" : "D";

    // EXTRACT ORDERED DATE.
    const orderedDate = order.orderedAt;
    const parsedDate = new Date(orderedDate);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    // CHECK RUNNING NUMBER. IF NEW DATE RESET, ELSE INCREMENT.
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const lastTrackingNumber = await prisma.order.findFirst({
      where: {
        orderedAt: {
          gte: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
          ),
        },
      },
      orderBy: { orderedAt: "desc" },
    });

    let runningNumber;

    if (
      lastTrackingNumber &&
      lastTrackingNumber.orderedAt.getDate() === currentDay &&
      lastTrackingNumber.orderNo
    ) {
      const lastRunningNumber = parseInt(
        lastTrackingNumber.orderNo.slice(-4),
        10,
      );
      runningNumber = (lastRunningNumber % 10000) + 1;
    } else {
      runningNumber = 1;
    }

    // FORMAT RUNNING NUMBER TO HAVE 0s IN FRONT.
    const formattedRunningNumber = runningNumber.toString().padStart(4, "0");

    // CREATE TRACKING NUMBER.
    const trackingNumber = `${paymentTypeLetter}${day}${month}${year}${formattedRunningNumber}`;

    // UPDATE ORDER TRACKING NUMBER.
    await prisma.order.update({
      where: { id: order.id },
      data: { orderNo: trackingNumber },
    });

    if (paymentType === PaymentType.INSTALLMENT && totalDiscount === 0) {
      return responseWrapper(
        400,
        null,
        "Unable to proceed at this time as the installment conditions have not been met.",
      );
    } else if (paymentType === PaymentType.INSTALLMENT) {
      totalDiscount += (subTotal - totalDiscount + shippingFee) / 2;
    }
    console.log(totalDiscount);

    const session = await createStripeSession(
      userId,
      order.id,
      paymentMethod,
      shippingFee,
      totalDiscount,
      lineItems,
      req,
      OrderStatus.PENDING_PAYMENT1,
    );

    const data = {
      stripeUrl: session.url,
    };

    await prisma.cart.delete({
      where: {
        userId: userId,
      },
    });

    return responseWrapper(200, data, null);
  } catch (err: any) {
    if (order) {
      await prisma.order.delete({
        where: {
          id: order.id,
        },
      });
    }
    return responseWrapper(500, null, err.message);
  }
}
