import { Injectable, BadRequestException, UnauthorizedException  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    ) {}

    async register(email: string, password: string) {
        const existed = await this.prisma.user.findUnique({
            where: { email },
        });

        if(existed) {
            throw new BadRequestException('Email уже заригистрирован');
        }

        const hased = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hased,
            },
        });

        const token = await this.generateToken(user.id, user.email, user.role);

        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            throw new UnauthorizedException('Неверный email или пароль');
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        const token = await this.generateToken(user.id, user.email, user.role);

        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }


    private async generateToken( id: string, email: string, role: string) {
        const payload = {sub: id, email, role};
        return this.jwtService.signAsync(payload);
    }
}
