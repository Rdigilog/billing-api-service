import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DashboardStatsResponseDto } from 'src/models/responses/analytic.dto';
import type { LoggedInUser } from 'src/models/types/user.types';
import { AnalyticsService } from 'src/services/analytics.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('dashboard')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@ApiTags('Dashboard')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(
    private readonly service: AnalyticsService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('analytics.dashboard')
  @ApiOkResponse({
    description: 'Returns analytics summary',
    type: DashboardStatsResponseDto,
  })
  @Get()
  async getAnalytics(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.dashboardSummary(
        user.userRole[0].companyId as string,
      );
      if (result.error == 1) return this.responseService.notFound(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get('attendance')
  async getAttendanceLast7Days(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.attendanceLast7Days(
        user.userRole[0].companyId as string,
      );
      if (result.error == 1) return this.responseService.notFound(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
