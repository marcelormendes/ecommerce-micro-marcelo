import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator";

export class Items {
    @IsNotEmpty()
    @IsString()
    itemId: string

    @IsNotEmpty()
    @IsInt()
    quantity: number
}

export class StockUpdate {
    @IsNotEmpty()
    items: Items[]
}

export const isTypeItems = (obj: any): obj is Items => {
    return 'itemId' in obj && typeof obj.itemId === 'string';
}

export enum StockError {
    INTERNAL_ERROR_ADD_ITEMS = 'Internal error on add-items',
    INTERNAL_ERROR_REMOVE_ITEMS = 'Internal error on remove-items'
}

export const getStockErrorCode = (value: string) => {
    return Object.keys(StockError).find(key => StockError[key as any] === value);
};

export enum StockOperation {
    PHYSICAL_STOCK,
    AVAILABLE_STOCK,
    BOTH
}


