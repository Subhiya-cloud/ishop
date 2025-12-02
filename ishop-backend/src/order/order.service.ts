import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string) {
    const cartItem = await this.cartService.getCart(userId);

    if (cartItem.length) {
      throw new NotFoundException('Корзина пуста');
    }

    const order = await this.prisma.order.create({
      data: { userId },
    });

    const orderItemsData = cartItem.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    }));

    await this.prisma.orderItem.createMany({
      data: orderItemsData,
    });

    await this.cartService.clearCart(userId);

    return {
      message: 'Заказ успешно создан',
      orderId: order.id,
    };
  }

  async getOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }

  async getOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }
}
