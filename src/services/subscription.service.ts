/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { UpdateSubscriptionUsersDto } from 'src/models/plans/plan.dto';
import { ResponsesService } from 'src/utils/services/responses.service';
import { PaystackService } from './thirdparty/paystack.service';
import { InitializePaymentDto } from 'src/models/subscription/payment.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponsesService,
    private readonly paystackService: PaystackService,
  ) {
    // super(userConfigService);
  }

  async companySubscription(companyId: string) {
    try {
      const result = await this.prisma.subscription.findFirst({
        where: { companyId },
        include: {
          plan: true,
        },
      });

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async companyBillingHistory(
    companyId: string,
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.BillingHistoryWhereInput = { companyId };
      if (search) {
        filter.OR = [];
      }

      const result = await this.prisma.billingHistory.findMany({
        where: filter,
        include: {
          plan: true,
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.billingHistory.count({
        where: filter,
      });
      const paginatedProduct = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );
      return { error: 0, body: paginatedProduct };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async addUsers(companyId: string, payload: UpdateSubscriptionUsersDto) {
    try {
      const result = await this.prisma.subscription.update({
        where: { companyId },
        data: payload,
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async cancelSubscription(companyId: string) {
    try {
      await this.prisma.subscription.update({
        where: { companyId },
        data: { status: 'CANCELLED' },
      });
      return { error: 0, body: 'Subscription cancelled sccessfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async initiateInvoicePayment(body: InitializePaymentDto) {
    try {
      const result = await this.prisma.billingHistory.findUnique({
        where: { id: body.id, status: 'PENDING' },
        include: {
          company: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      if (!result) {
        return { error: 2, body: 'Invoice not found' };
      }
      const paystackResponse = await this.paystackService.initializePayment(
        result.amount,
        result.invoiceNo,
        result.company.email,
        result.company.name as string,
        body.callbackUrl,
      );
      return {
        error: 0,
        body: { ...paystackResponse.data, totalSum: result.amount },
      };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async verifyInvoicePayment(reference: string, saveCard: boolean = false) {
    try {
      const paystackResponse =
        await this.paystackService.verifyPayment(reference);

      if (
        !paystackResponse.data ||
        paystackResponse.data.status !== 'success'
      ) {
        return { error: 2, body: 'Payment verification failed' };
      }

      const result = await this.prisma.billingHistory.update({
        where: {
          invoiceNo: reference,
          status: 'PENDING',
        },
        data: {
          status: 'PAID',
          date: new Date(),
        },
      });

      if (saveCard && paystackResponse.data.authorization.reusable) {
        const { authorization } = paystackResponse.data;

        await this.prisma.cardInformation.create({
          data: {
            company: {
              connect: { id: result.companyId },
            },
            authorizationCode: authorization.authorization_code,
            cardType: authorization.card_type,
            last4: authorization.last4,
            expMonth: authorization.exp_month,
            expYear: authorization.exp_year,
            bank: authorization.bank,
            brand: authorization.brand,
            reusable: authorization.reusable,
            currency: paystackResponse.data.currency,
            channel: paystackResponse.data.channel,
          },
        });
      }

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
