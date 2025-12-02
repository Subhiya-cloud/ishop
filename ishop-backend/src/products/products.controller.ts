import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ProductService } from './products.service';
import {
  FilterProductsDto,
  CreateProductDto,
  UpdateProductDto,
} from './products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Get()
  getAll(@Query() query: FilterProductsDto) {
    return this.productService.getAll(query);
  }

  @Get('id')
  getById(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateProductDto) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Только админ может создавать товары');
    }

    return this.productService.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Только админ может редактировать товары');
    }
    return this.productService.updateProduct(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Только админ может удалять товары');
    }

    return this.productService.deleteProduct(id);
  }
}
