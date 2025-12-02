import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
    return cart;
  }

  async addToCart(userId: string, productId: string) {
    const existed = await this.prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existed) {
      return this.prisma.cartItem.update({
        where: { id: existed.id },
        data: { quantity: existed.quantity + 1 },
      });
    }
    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity: 1,
      },
    });
  }

  async removeFromCart(userId: string, productId: string) {
    const existing = await this.prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (!existing) throw new NotFoundException('Товар не найден в корзине');

    if (existing.quantity > 1) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity - 1 },
      });
    }

    return this.prisma.cartItem.delete({
      where: { id: existing.id },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}
