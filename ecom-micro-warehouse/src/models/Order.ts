import { OrderStatus } from "@prisma/client"
import { IsDecimal, IsInt, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

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

export class SubmitOrder {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    @IsPhoneNumber('US')
    @IsString()
    phone: string

    @IsNotEmpty()
    @IsString()
    address1: string

    address2: string

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
    items: OrderItemBody[]
}

export class CancelOrder {
    @IsNotEmpty()
    @IsString()
    reason: string;
}

export enum OrderError {
    ORDER_NOT_FOUND = 'Order not found',
    REASON_REQUIRED = 'Reason is required',
    ORDER_ALREADY_CANCELLED = 'Order already canceled',
    ORDER_ALREADY_SHIPPED = 'Order already shipped',
    ORDER_ALREADY_COMPLETED = 'Order already completed',
    ITEMS_NO_STOCK = 'The Follow items does not have stock',
    INTERNAL_ERROR_RETRIEVING_ORDER = 'Internal error retrieving order',
    INTERNAL_ERROR_CANCEL_ORDER = 'Internal error cancel order',
    INTERNAL_ERROR_SHIP_ORDER = 'Internal error ship order',
}

export const getOrderErrorCode = (value: string) => {
    return Object.keys(OrderError).find(key => OrderError[key as any] === value);
};
