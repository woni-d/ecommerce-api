import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomerService } from '../../models/customer/customer.service';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class AuthCustomerService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private customerService: CustomerService,
    ) {}

    async validateCustomer(email: string, password: string) {
        const store = await this.customerService.getItem(email);

        if (store && (await bcrypt.compare(password, store.password))) {
            const { _id: id } = store;

            return { id };
        }
        return null;
    }

    signIn({ id }: JwtPayload) {
        const payload = { id };
        const accessToken = this.jwtService.sign(
            payload,
            { issuer: this.configService.get<string>('JWT_ISSUER') }
        );
        return accessToken;
    }
}