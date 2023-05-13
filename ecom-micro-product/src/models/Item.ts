import { IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class NewItem {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    otherDetails: string;
}


export class AddCartItem {
    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsString()
    itemId: string

    @IsNotEmpty()
    @IsInt()
    quantity: number
}

export class CartItem {
    @IsNotEmpty()
    @IsString()
    itemId: string

    @IsNotEmpty()
    @IsString()
    cartId: string

    @IsNotEmpty()
    @IsInt()
    quantity: number
}

export class Items {
    @IsNotEmpty()
    @IsString()
    itemId: string

    @IsNotEmpty()
    quantity: number
}

export class StockUpdate {
    @IsNotEmpty()
    items: Items[];
}

export class CheckoutBody {
    @IsNotEmpty()
    @IsString()
    cartId: string;
}

export const isTypeItems = (obj: any): obj is Items => {
    return 'itemId' in obj && typeof obj.itemId === 'string';
}

export enum ItemError {
    ITEM_NOT_FOUND = 'Item not found',
    ITEMS_NO_STOCK = 'The Follow items does not have stock',
    INTERNAL_ERROR_RETRIEVING_ITEM = 'Internal error retrieving item',
    INTERNAL_ERROR_CREATE_ITEM = 'Internal error create item',
    INTERNAL_ERROR_UPDATE_ITEM = 'Internal error update item',
    INTERNAL_ERROR_DELETE_ITEM = 'Internal error delete item',
    INTERNAL_ERROR_UPDATE_CART_ITEM = 'Internal error update cart item',
}

export const getItemErrorCode = (value: string) => {
    return Object.keys(ItemError).find(key => ItemError[key as any] === value);
};

