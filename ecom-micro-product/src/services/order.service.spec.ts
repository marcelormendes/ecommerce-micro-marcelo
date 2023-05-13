import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaClient, OrderStatus, Order, OrderItem, Prisma } from '@prisma/client';
import { items, newOrder, ordersMock } from '../_helpers/orderUtils';

describe('OrderService', () => {
    let service: OrderService;
    let mockPrisma: PrismaClient;
    let mockProductClient: ClientProxy;

    beforeEach(async () => {
        mockPrisma = new PrismaClient();
        mockProductClient = {} as ClientProxy;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                { provide: process.env.RABBITMQ_NAME, useValue: mockProductClient },
            ],
        }).overrideProvider(PrismaClient).useValue(mockPrisma).compile();

        service = module.get<OrderService>(OrderService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOrderById', () => {
        it('should return an order if it exists', async () => {
            const orderId = '1';
            const expectedOrder = ordersMock[0];
            jest.spyOn(mockPrisma.order, 'findUnique').mockResolvedValue(expectedOrder);

            const order = await service.findOrderById(orderId);

            expect(order).toEqual(expectedOrder);
            expect(mockPrisma.order.findUnique).toHaveBeenCalledWith({ where: { id: orderId } });
        });
    });

    describe('findAllOrders', () => {
        it('should return all orders', async () => {
            const expectedOrders = ordersMock;
            jest.spyOn(mockPrisma.order, 'findMany').mockResolvedValue(expectedOrders);

            const orders = await service.findAllOrders();

            expect(orders).toEqual(expectedOrders);
            expect(mockPrisma.order.findMany).toHaveBeenCalled();
        });
    });

    describe('findOrderItems', () => {
        it('should return all items for a given order', async () => {
            const orderId = '1';
            const expectedOrderItems = [{ id: '1', orderId: '1', itemId: '2', quantity: 3 }];
            jest.spyOn(mockPrisma.orderItem, 'findMany').mockResolvedValue(expectedOrderItems);

            const orderItems = await service.findOrderItems(orderId);

            expect(orderItems).toEqual(expectedOrderItems);
            expect(mockPrisma.orderItem.findMany).toHaveBeenCalledWith({ where: { orderId } });
        });
    });

    describe('updateOrderStatus', () => {
        it('should update the status of a given order', async () => {
            const orderId = '1';
            const expectedOrder = { status: OrderStatus.SUBMITTED, ...ordersMock[0] };
            jest.spyOn(mockPrisma.order, 'update').mockResolvedValue(expectedOrder);

            const order = await service.updateOrderStatus(orderId, OrderStatus.COMPLETED);

            expect(order).toEqual(expectedOrder);
            expect(mockPrisma.order.update).toHaveBeenCalledWith({
                where: { id: orderId },
                data: { status: OrderStatus.COMPLETED }
            });
        });
    });

    describe('createOrder', () => {
        it('should create a new order and its associated items', async () => {

            jest.spyOn(mockPrisma.item, 'findMany').mockResolvedValue(items);

            const expectedOrder = { id: '1', customerId: '1', price: 20, status: OrderStatus.CREATED };
            jest.spyOn(mockPrisma.order, 'create').mockResolvedValue(ordersMock[0]);

            const expectedOrderItems = [{ itemId: '1', quantity: 2, orderId: '1' }];
            jest.spyOn(mockPrisma.orderItem, 'createMany').mockResolvedValue({ count: expectedOrderItems.length });

            const result = await service.createOrder(newOrder);

            expect(result).toEqual({ order: expectedOrder, orderItems: { count: expectedOrderItems.length } });
            expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
                where: { id: { in: ['1'] } },
                select: { id: true, price: true }
            });
            expect(mockPrisma.order.create).toHaveBeenCalledWith({ data: expect.anything() });
            expect(mockPrisma.orderItem.createMany).toHaveBeenCalledWith({ data: expect.anything() });
        });
    });

    describe('submitOrder', () => {
        it('should submit an order and update its status', async () => {
            const mockOrder: Order = ordersMock[0];
            const mockOrderItems: OrderItem[] = [{ id: '1', orderId: '1', itemId: '1', quantity: 2 }];

            const expectedOrder = { ...mockOrder, status: OrderStatus.SUBMITTED };
            jest.spyOn(mockPrisma.order, 'update').mockResolvedValue(expectedOrder);

            jest.spyOn(mockProductClient, 'emit').mockImplementation(() => null);

            const result = await service.submitOrder(mockOrder, mockOrderItems);

            expect(result).toEqual(expectedOrder);
            expect(mockProductClient.emit).toHaveBeenCalledWith('order_submitted', expect.anything());
            expect(mockPrisma.order.update).toHaveBeenCalledWith({
                where: { id: mockOrder.id },
                data: { status: OrderStatus.SUBMITTED }
            });
        });
    });

});
