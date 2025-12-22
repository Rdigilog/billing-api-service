/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class CardinformationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponsesService,
  ) {
    // super(userConfigService);
  }
  // Fetch paginated card information for a company
  async companyCardInformation(
    companyId: string,
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);

      const filter: Prisma.CardInformationWhereInput = { companyId };

      if (search) {
        filter.OR = [
          { last4: { contains: search } },
          { cardType: { contains: search } },
          { bank: { contains: search } },
          { brand: { contains: search } },
        ];
      }

      const result = await this.prisma.cardInformation.findMany({
        where: filter,
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.cardInformation.count({
        where: filter,
      });

      const paginatedCards = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );

      return { error: 0, body: paginatedCards };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  // Delete a card by id
  async deleteCard(cardId: string, companyId: string) {
    try {
      const card = await this.prisma.cardInformation.findUnique({
        where: { id: cardId },
      });

      if (!card || card.companyId !== companyId) {
        return { error: 1, body: 'Card not found or unauthorized' };
      }

      await this.prisma.cardInformation.delete({
        where: { id: cardId, companyId },
      });

      return { error: 0, body: 'Card deleted successfully' };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }
}
