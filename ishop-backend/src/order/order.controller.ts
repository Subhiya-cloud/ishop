import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post()
    createOrder(@Req() req) {
        return this.orderService.createOrder(req.user.userId);
    }

    @Get()
    getOrders(@Req() req) {
        return this.orderService.getOrders(req.user.userId);
    }

    @Get(':id')
    getOrder(@Req() req, @Param('id') id:string) {
        return this.orderService.getOrder(req.user.userId, id)
    }
}