type RangeType = 'day' | 'week' | 'month' | 'year';
export declare class GeneralService {
    getDateRange(rangeType: RangeType): {
        currentEndDate: Date;
        currentStartDate: Date;
        previousEndDate: Date;
        previousStartDate: Date;
    };
}
export {};
