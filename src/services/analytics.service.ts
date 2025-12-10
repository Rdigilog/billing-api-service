import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { format, subDays } from 'date-fns';

type RangeType = 'day' | 'week' | 'month' | 'year';
@Injectable()
export class AnalyticsService extends PrismaService {
  constructor(
    private readonly responseService: ResponsesService,
    // private readonly generalService: GeneralService,
  ) {
    super();
  }
  async dashboardSummary(companyId: string, range: RangeType = 'day') {
    try {
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      const company = await this.company.findUniqueOrThrow({
        where: { id: companyId },
      });
      // const dateRange = this.generalService.getDateRange(range); // 'day', 'week', etc.
      // const currentStart = format(dateRange.currentStartDate, 'yyyy-MM-dd');
      // const currentEnd = format(dateRange.currentEndDate, 'yyyy-MM-dd');
      // const previousStart = format(
      //     dateRange.previousStartDate,
      //     'yyyy-MM-dd',
      // );
      // const previousEnd = format(dateRange.previousEndDate, 'yyyy-MM-dd');
      const result = await this.$transaction(
        async (tx) => {
          const [
            totalUsers,
            totalNewUsers,
            totalCurrentAttendance,
            totalArrivedEarlyAttendance,
            totalArrivedOnTimeAttendance,
            totalArrivedLateAttendance,
            usersWithNoAttendanceToday,
            usersWithNoAttendanceYesterday,
            employeeCountByWorkType,
            // current,
            // previous,
            // currentAbsent,
            // previousAbsent,
          ] = await Promise.all([
            tx.user.count({
              where: {
                userRole: {
                  some: { companyId },
                },
              },
            }),

            tx.user.count({
              where: {
                userRole: {
                  some: { companyId },
                },
                createdAt: {
                  gte: new Date(new Date().setMonth(new Date().getMonth() - 1)), // last 1 month
                },
              },
            }),

            tx.attendance.count({
              where: {
                companyId,
                date: format(new Date(), 'yyyy-MM-dd'),
              },
            }),

            tx.attendance.count({
              where: {
                companyId,
                date: format(new Date(), 'yyyy-MM-dd'),
                timeIn: {
                  lt: company.resumptionTime || '09:00',
                },
              },
            }),

            tx.attendance.count({
              where: {
                companyId,
                date: format(new Date(), 'yyyy-MM-dd'),
                timeIn: {
                  equals: company.resumptionTime || '09:00',
                },
              },
            }),

            tx.attendance.count({
              where: {
                companyId,
                date: format(new Date(), 'yyyy-MM-dd'),
                timeIn: {
                  gte: company.resumptionTime || '09:00',
                },
              },
            }),

            tx.employee.count({
              where: {
                companyId,
                attendance: {
                  none: {
                    date: format(new Date(), 'yyyy-MM-dd'),
                  },
                },
              },
            }),

            tx.employee.count({
              where: {
                companyId,
                attendance: {
                  none: {
                    date: yesterday,
                  },
                },
              },
            }),

            tx.jobInformation.groupBy({
              by: ['workType'],
              _count: {
                _all: true,
              },
            }),

            // tx.attendance.groupBy({
            //     by: ["status"],
            //     where: {
            //         date: {
            //             gte: currentStart,
            //             lte: currentEnd,
            //         },
            //         companyId,
            //     },
            // }),

            // tx.attendance.groupBy({
            //     by: ["status"],
            //     where: {
            //         date: {
            //             gte: currentStart,
            //             lte: currentEnd,
            //         },
            //         companyId,
            //     },
            // }),

            // tx.employee.findMany({
            //     where: {
            //         companyId,
            //     },
            //     select: {
            //         profile: {
            //             select: {
            //                 user: {
            //                     select: {
            //                         attendance: {
            //                             where: {
            //                                 date: {
            //                                     gte: currentStart,
            //                                     lte: currentEnd,
            //                                 },
            //                             },
            //                         },
            //                     },
            //                 },
            //             },
            //         },
            //     },
            // }),

            // tx.employee.findMany({
            //     where: {
            //         companyId,
            //     },
            //     select: {
            //         profile: {
            //             select: {
            //                 user: {
            //                     select: {
            //                         attendance: {
            //                             where: {
            //                                 date: {
            //                                     gte: currentStart,
            //                                     lte: currentEnd,
            //                                 },
            //                             },
            //                         },
            //                     },
            //                 },
            //             },
            //         },
            //     },
            // }),
          ]);

          return {
            totalUsers,
            totalNewUsers,
            totalCurrentAttendance,
            totalArrivedEarlyAttendance,
            totalArrivedOnTimeAttendance,
            totalArrivedLateAttendance,
            usersWithNoAttendanceToday,
            usersWithNoAttendanceYesterday,
            employeeCountByWorkType,
            // current,
            // previous,
            // currentAbsent,
            // previousAbsent,
          };
        },
        {
          timeout: 10000,
        },
      );

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async attendanceLast7Days(companyId: string) {
    try {
      const today = new Date();
      const company = await this.company.findUniqueOrThrow({
        where: { id: companyId },
      });

      const resumption = company.resumptionTime || '09:00';

      const result = await this.$transaction(async (tx) => {
        const attendanceByDay: {
          date: string;
          early: number;
          ontime: number;
          late: number;
        }[] = [];

        // Loop through last 7 days
        for (let i = 0; i < 7; i++) {
          const d = format(subDays(today, 6 - i), 'yyyy-MM-dd');

          const [early, ontime, late] = await Promise.all([
            tx.attendance.count({
              where: {
                companyId,
                date: d,
                timeIn: { lt: resumption },
              },
            }),
            tx.attendance.count({
              where: {
                companyId,
                date: d,
                timeIn: { equals: resumption },
              },
            }),
            tx.attendance.count({
              where: {
                companyId,
                date: d,
                timeIn: { gt: resumption },
              },
            }),
          ]);

          attendanceByDay.push({
            date: d,
            early: early ?? 0,
            ontime: ontime ?? 0,
            late: late ?? 0,
          });
        }

        return attendanceByDay;
      });

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
