// src/OrderController.ts

import { Body, Controller, Param, Post, Response, Get, Put } from "@nestjs/common";
import { OrderService, StockService } from "../services";
import {
    CancelOrder,
    ItemError,
    NewOrder,
    OrderError,
    getItemErrorCode,
    getOrderErrorCode,
    isTypeItems
} from "../models";
import { Response as ExpressResponse } from "express";
import { OrderStatus } from "@prisma/client";
import { Payload, MessagePattern } from "@nestjs/microservices";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService,
        private readonly stockService: StockService) { }

    @Get('/all')
    async getAllOrders(
        @Response() res: ExpressResponse) {

        try {
            const order = await this.orderService.findAllOrders();

            if (order) {
                return res.json(order);
            } else {
                const message = OrderError.ORDER_NOT_FOUND;
                return res.status(404).json({ code: getOrderErrorCode(message), message });
            }
        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_RETRIEVING_ORDER;
            res.status(500).json({ code: getOrderErrorCode(message), message, error: error.message });
        }

    };

    @Get('/:id')
    async getOrderById(
        @Param('id') id: string,
        @Response() res: ExpressResponse) {

        try {
            const order = await this.orderService.findOrderById(id);

            if (order) {
                return res.json(order);
            } else {
                const message = OrderError.ORDER_NOT_FOUND;
                return res.status(404).json({ code: getOrderErrorCode(message), message });
            }
        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_RETRIEVING_ORDER;
            res.status(500).json({ code: getOrderErrorCode(message), message, error: error.message });
        }

    };

    @Post()
    async createOrder(
        @Body() newOrder: NewOrder,
        @Response() res: ExpressResponse) {
        try {
            const order = await this.orderService.createOrder(newOrder);
            res.json({ order });
        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_CREATE_ORDER;
            res.status(500).json({ code: getOrderErrorCode(message), message, error: error.message });
        }
    };

    @Put('/submit/:id')
    async submitOrder(
        @Param('id') id: string,
        @Response() res: ExpressResponse) {
        try {
            const order = await this.orderService.findOrderById(id);

            if (!order) {
                const message = OrderError.ORDER_NOT_FOUND;
                return res.json(404).json({ code: getOrderErrorCode(message), message });
            }

            if (order.status === OrderStatus.SUBMITTED) {
                const message = OrderError.ORDER_ALREADY_SUBMITTED;
                return res.status(400).json({ code: getOrderErrorCode(message), message });
            }

            const orderItems = await this.orderService.findOrderItems(id);

            if (!orderItems) {
                const message = OrderError.ORDER_ITEMS_NOT_FOUND;
                return res.status(404).json({ code: getOrderErrorCode(message), message });
            }

            const orderSubmitted = await this.orderService.submitOrder(order, orderItems);
            return res.json({ success: true, orderSubmitted });

        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_SUBMIT_ORDER;
            res.status(500).json({ code: getOrderErrorCode(message), message, error: error.message });
        }
    };



    @Put('/cancel/:id')
    async cancelOrder(
        @Param('id') id: string,
        @Body() _reason: CancelOrder,
        @Response() res: ExpressResponse) {
        try {
            const order = await this.orderService.findOrderById(id);

            if (order.status === OrderStatus.CANCELLED) {
                const message = OrderError.ORDER_ALREADY_CANCELLED;
                return res.status(400).json({ code: getOrderErrorCode(message), message });
            }

            if (order.status === OrderStatus.SUBMITTED) {
                const message = OrderError.ORDER_ALREADY_SUBMITTED;
                return res.status(400).json({ code: getOrderErrorCode(message), message });
            }

            if (order.status === OrderStatus.COMPLETED) {
                const message = OrderError.ORDER_ALREADY_COMPLETED;
                return res.status(400).json({ code: getOrderErrorCode(message), message });
            }

            const result = await this.orderService.updateOrderStatus(id, OrderStatus.CANCELLED);

            if (result) {
                const orderItems = await this.orderService.findOrderItems(id);
                const stockResult = await this.stockService.updateStockItem(orderItems, false);

                if (isTypeItems(stockResult)) {
                    const message = ItemError.ITEMS_NO_STOCK;
                    return res.status(400).json({ code: getItemErrorCode(message), message, stockResult });
                }
            }

            return res.json({ result });
        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_CANCEL_ORDER;
            res.status(500).json({ code: getOrderErrorCode(message), message, error: error.message });
        }
    };

    @MessagePattern('order_status_updated')
    async handleStockUpdates(@Payload() order: { id: string, status: OrderStatus }): Promise<void> {
        await this.orderService.updateOrderStatus(order.id, order.status);
    }

}
