import { Order } from "@prisma/client"
import { IsInt, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export type OrderToSubmit = Omit<Order, 'createdAt' | 'updatedAt' | 'status' | 'customerId'> & { items: OrderItemBody[] }

export class OrderItemBody {
    @IsNotEmpty()
    @IsString()
    orderId: string

    @IsNotEmpty()
    @IsString()
    itemId: string

    @IsNotEmpty()
    @IsInt()
    quantity: number
}

export class CancelOrder {
    @IsNotEmpty()
    @IsString()
    reason: string;
}

export class NewOrder {

    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('US')
    phone: string

    @IsNotEmpty()
    @IsString()
    address1: string

    address2?: string

    @IsNotEmpty()
    @IsString()
    city: string

    @IsNotEmpty()
    @IsString()
    state: string

    @IsNotEmpty()
    @IsString()
    zip: string

    @IsNotEmpty()
    @IsString()
    cartId: string
}


export enum OrderError {
    ORDER_NOT_FOUND = 'Order not found',
    ORDER_ITEMS_NOT_FOUND = `Order doesn't have any items`,
    ORDER_ALREADY_CANCELLED = 'Order already canceled',
    ORDER_ALREADY_COMPLETED = 'Order already completed',
    ORDER_ALREADY_SUBMITTED = 'Order already submitted',
    INTERNAL_ERROR_RETRIEVING_ORDER = 'Internal error retrieving order',
    INTERNAL_ERROR_CREATE_ORDER = 'Internal error create order',
    INTERNAL_ERROR_CANCEL_ORDER = 'Internal error cancel order',
    INTERNAL_ERROR_SUBMIT_ORDER = 'Internal error submit order',
    INTERNAL_ERROR_BEGIN_CHECKOUT = 'Internal error begin checkout',
    INTERNAL_ERROR_CANCEL_CHECKOUT = 'Internal error cancel checkout',
}

export const getOrderErrorCode = (value: string) => {
    return Object.keys(OrderError).find(key => OrderError[key as any] === value);
};