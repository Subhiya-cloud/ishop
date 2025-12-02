import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  FilterProductsDto,
  CreateProductDto,
  UpdateProductDto,
} from './products.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  getAll(dto: FilterProductsDto) {
    const where: any = {};

    if (dto.search) {
      where.name = { contains: dto.search, mode: 'insensitive' };
    }

    if (dto.category) {
      where.category = dto.category;
    }

    if (dto.minPrice !== undefined) {
      where.price = { ...where.price, gte: Number(dto.minPrice) };
    }
    if (dto.maxPrice !== undefined) {
      where.price = { ...where.price, lte: Number(dto.maxPrice) };
    }

    return this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return product;
  }

  async createProduct(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: dto,
    });

    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
    });

    return product;
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.delete({
      where: { id },
    });

    return product;
  }
}
