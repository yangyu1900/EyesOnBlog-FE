import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class DateService {
    constructor(private data: DataService) {
    }

    async getEarliestRecord(podId) {
        return await this.data.get(`/api/blog/get?filterBy=podId&filterByValue=${podId}&orderBy=publishDate&orderByOrder=1&limit=1`, { headers: { 'Content-Type': 'application/json' } }).catch(err => console.log(err)) as any;
    }

    monthLetterStrToDigit(monthLetterStr) {
        return this.getCalendarMonthsAsLetterStrArr().indexOf(monthLetterStr) + 1;
    }

    getCalendarMonthsAsLetterStrArr() {
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    getFiscalMonthsAsLetterStrArr() {
        return ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    }

    getCalendarMonthsAsDigitArr() {
        const calendarMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        return calendarMonths;
    }

    async getCalendarYearsAsDigitArr(podId) {
        const calendarYears = [];
        const earliestRecord = await this.getEarliestRecord(podId);
        const baseCalendarYear = earliestRecord.length > 0 ? new Date(Date.parse(earliestRecord[0]['publishDate'])).getFullYear() : 2000;
        const currentCalendarDate = new Date();
        for (var i = 0; i <= currentCalendarDate.getFullYear() - baseCalendarYear; i++) {
            calendarYears.push(baseCalendarYear + i);
        }
        return calendarYears.reverse();
    }

    getCurrentCalendarYearAsDigit() {
        return new Date().getFullYear();
    }

    getCurrentCalendarMonthAsDigit() {
        return new Date().getMonth() + 1;
    }

    async getFiscalYearsAsDigitArr(podId:number) {
        const fiscalYears = [];
        const earliestRecord = await this.getEarliestRecord(podId);
        const publishDate = earliestRecord.length > 0 ? new Date(Date.parse(earliestRecord[0]['publishDate'])) : new Date(Date.parse('2019-07-01'));
        const baseFiscalYear = publishDate.getMonth() >= 6 ? publishDate.getFullYear() : publishDate.getFullYear() - 1;
        const currentCalendarDate = new Date();
        const fiscalYearStartDate = new Date(currentCalendarDate.getFullYear(), 6, 1);
        const currentFiscalYear = currentCalendarDate.getTime() - fiscalYearStartDate.getTime() >= 0 ? currentCalendarDate.getFullYear() + 1 : currentCalendarDate.getFullYear();
        for (var i = 0; i <= currentFiscalYear - baseFiscalYear; i++) {
            fiscalYears.push(baseFiscalYear + i);
        }
        return fiscalYears.reverse();
    }

    getCurrentFiscalYearAsDigit(podId:number) {
        const currentFiscalYear = this.getCurrentCalendarMonthAsDigit() >= 7 ? this.getCurrentCalendarYearAsDigit() + 1 : this.getCurrentCalendarYearAsDigit();
        return currentFiscalYear;
    }
}