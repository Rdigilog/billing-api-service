/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Delete,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthComapny } from 'src/decorators/logged-in-user-decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  ApiResponseDto,
  PaginatedResponse,
} from 'src/models/responses/generic.dto';
// import { CardAuthorizationDto } from 'src/models/responses/card.dto';
import type { activeCompaany } from 'src/models/types/user.types';
// import { CardAuthorizationService } from 'src/services/card-authorization.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { CardinformationService } from 'src/services/cardinformation.service';
import { CardInformationDto } from 'src/models/responses/card.information';

@ApiTags('Card Authorization')
@Controller('card')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class CardinformationController {
  constructor(
    private readonly service: CardinformationService,
    private readonly responseService: ResponsesService,
  ) {}

  @ApiExtraModels(ApiResponseDto, CardInformationDto, PaginatedResponse)
  @ApiOkResponse({
    description: 'Paginated company saved cards',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              allOf: [
                { $ref: getSchemaPath(PaginatedResponse) },
                {
                  properties: {
                    result: {
                      type: 'array',
                      items: { $ref: getSchemaPath(CardInformationDto) },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get()
  async listCards(
    @AuthComapny() company: activeCompaany,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      const result = await this.service.companyCardInformation(
        company.id,
        page,
        size,
        search,
        sortBy,
        sortDirection,
      );
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @ApiOperation({ summary: 'Delete a saved card by ID' })
  @Delete(':id')
  async deleteCard(
    @AuthComapny() company: activeCompaany,
    @Param('id') cardId: string,
  ) {
    try {
      const result = await this.service.deleteCard(cardId, company.id);
      if (result.error) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
