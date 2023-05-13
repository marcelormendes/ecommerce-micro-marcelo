// src/CheckoutController.ts

import { Body, Controller, Post, Response } from "@nestjs/common";
import { CheckoutBody, ItemError, Items, OrderError, getItemErrorCode, isTypeItems } from "../models";
import { Response as ExpressResponse } from "express";
import { StockService, ItemService } from "../services";

@Controller('checkout')
export class CheckoutController {
    constructor(private readonly stockService: StockService,
        private readonly itemService: ItemService) { }

    @Post('/begin')
    async beginCheckout(
        @Body() checkoutBody: CheckoutBody,
        @Response() res: ExpressResponse) {
        try {

            const items = await this.itemService.getCartItems(checkoutBody.cartId);
            const aggregatedStock = await this.stockService.updateStockItem(items, false);
            if (isTypeItems(aggregatedStock)) {
                const message = ItemError.ITEMS_NO_STOCK;
                res.status(400).json({ code: getItemErrorCode(message), message, aggregatedStock });
            }

            res.json({ aggregatedStock });
        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_BEGIN_CHECKOUT;
            res.status(500).json({ code: getItemErrorCode(message), message, error: error.message });
        }
    };

    @Post('/cancel')
    async cancelCheckout(
        @Body() checkoutBody: CheckoutBody,
        @Response() res: ExpressResponse) {
        try {
            const items = await this.itemService.getCartItems(checkoutBody.cartId);
            const aggregatedStock = await this.stockService.updateStockItem(items, true);

            res.json({ aggregatedStock });
        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_CANCEL_CHECKOUT;
            res.status(500).json({ code: getItemErrorCode(message), message, error: error.message });
        }
    };


}
