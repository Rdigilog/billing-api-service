/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  PaystackInitResponse,
  PaystackVerificationResponse,
} from 'src/models/thridparty/paystack.dto';

@Injectable()
export class PaystackService {
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly callbackUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('PAYSTACK_BASEURL') as string;
    this.secretKey = this.configService.get<string>(
      'PAYSTACK_SECRET_KEY',
    ) as string;
    this.callbackUrl = this.configService.get<string>(
      'PAYSTACK_CALLBACK',
    ) as string;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async initializePayment(
    amount: number,
    reference: string,
    email: string,
    name: string,
    callbackUrl?: string,
  ): Promise<PaystackInitResponse> {
    try {
      const response$ = this.httpService.post<PaystackInitResponse>(
        `${this.baseUrl}/transaction/initialize`,
        {
          amount: amount * 100, // Paystack expects kobo
          currency: 'NGN',
          reference,
          email,
          metadata: { name },
          callback_url: callbackUrl ?? this.callbackUrl,
        },
        { headers: this.headers },
      );

      const { data } = await firstValueFrom(response$);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        error?.response?.data?.message || 'Payment initialization failed',
      );
    }
  }

  async verifyPayment(
    reference: string,
  ): Promise<PaystackVerificationResponse> {
    try {
      const response$ = this.httpService.get<PaystackVerificationResponse>(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.headers },
      );

      const { data } = await firstValueFrom(response$);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        error?.response?.data?.message || 'Payment verification failed',
      );
    }
  }
}
