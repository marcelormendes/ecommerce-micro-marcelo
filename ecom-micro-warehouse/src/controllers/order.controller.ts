// src/OrderController.ts

import { Body, Controller, Param, Response, Get, Put } from "@nestjs/common";
import { OrderService, StockService } from "../services";
import { CancelOrder, OrderError, SubmitOrder, getOrderErrorCode, isTypeItems } from "../interfaces";
import { Response as ExpressResponse } from "express";
import { OrderStatus } from "@prisma/client";
import { StockOperation } from "../models/Stock";
import { MessagePattern, Payload } from "@nestjs/microservices";

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
                res.json(order);
            } else {
                const message = OrderError.ORDER_NOT_FOUND;
                res.status(404).json({ code: getOrderErrorCode(message), message });
            }
        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_RETRIEVING_ORDER;
            res.status(400).json({ code: getOrderErrorCode(message), message, error: error.message });
        }

    };

    @Put('/ship/:id')
    async shipOrder(
        @Param('id') id: string,
        @Response() res: ExpressResponse) {
        try {
            const order = await this.orderService.updateOrderStatus(id, OrderStatus.SHIPPED);
            this.orderService.updateOrderStatus(id, OrderStatus.SHIPPED);
            res.json({ order });
        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_SHIP_ORDER;
            res.status(400).json({ code: getOrderErrorCode(message), error: error.message });
        }
    };

    @Put('/complete/:id')
    async completeOrder(
        @Param('id') id: string,
        @Response() res: ExpressResponse) {
        try {
            const order = await this.orderService.updateOrderStatus(id, OrderStatus.COMPLETED);
            const orderItems = await this.orderService.findOrderItems(id);
            const stockResult = await this.stockService.updateStockItem(orderItems, false, StockOperation.PHYSICAL_STOCK);

            if (isTypeItems(stockResult)) {
                const message = OrderError.ITEMS_NO_STOCK;
                res.status(400).json({ code: getOrderErrorCode(message), message, stockResult });
            }

            res.json({ order });
        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_SHIP_ORDER;
            res.status(400).json({ code: getOrderErrorCode(message), error: error.message });
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

            if (order.status === OrderStatus.SHIPPED) {
                const message = OrderError.ORDER_ALREADY_SHIPPED;
                return res.status(400).json({ code: getOrderErrorCode(message), message });
            }

            if (order.status === OrderStatus.COMPLETED) {
                const message = OrderError.ORDER_ALREADY_COMPLETED;
                return res.status(400).json({ code: getOrderErrorCode(message), message });
            }

            const result = await this.orderService.updateOrderStatus(id, OrderStatus.CANCELLED);

            if (result) {
                const orderItems = await this.orderService.findOrderItems(id);
                const stockResult = await this.stockService.updateStockItem(orderItems, false, StockOperation.BOTH);

                if (isTypeItems(stockResult)) {
                    const message = OrderError.ITEMS_NO_STOCK;
                    return res.status(400).json({ code: getOrderErrorCode(message), message, stockResult });
                } else {
                    return res.json({ result });
                }
            }

        } catch (error) {
            const message = OrderError.INTERNAL_ERROR_CANCEL_ORDER;
            res.status(400).json({ code: getOrderErrorCode(message), message, error: error.message });
        }
    };


    @MessagePattern('order_submitted')
    async handleOrderCreated(@Payload() order: SubmitOrder) {
        console.log('Received new order:', order);
        await this.orderService.createOrder(order);
        await this.stockService.updateStockItem(order.items, false, StockOperation.AVAILABLE_STOCK);
    }
}
