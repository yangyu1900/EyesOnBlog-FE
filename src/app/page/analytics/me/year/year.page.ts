import { Component, OnInit } from '@angular/core';

import { Chart } from 'chart.js';

import * as ConstantsHelper from '../../../../util/constantshelper.util';

import { SpinnerService } from '../../../../service/spinner.service';
import { AccountService } from '../../../../service/account.service';
import { DataService } from '../../../../service/data.service';
import { DateService } from '../../../../service/date.service';
import { ToastService } from '../../../../service/toast.service';

import { User } from '../../../../model/user';
import { Pod } from '../../../../model/pod';


@Component({
  selector: 'app-year',
  templateUrl: './year.page.html',
  styleUrls: ['./year.page.scss'],
})
export class YearPage implements OnInit {
  pods: Pod[];
  podSelected: number;
  currentUser: User;
  years: number[];
  yearSelected: number;
  isFiscal: boolean;
  startDate: string;
  endDate: string;
  monthsLetterStrArr: string[];
  verticals: string[];
  verticalColors: string[];

  myYearlyPostByMonthCtx;
  myYearlyPostByVerticalCtx;
  myYearlyPostByVerticalByMonthCtx;
  myYearlyPageviewByMonthCtx;
  myYearlyPageviewByVerticalCtx;
  myYearlyPageviewByVerticalByMonthCtx;
  myYearlyAvgPageviewPerPostByMonthCtx;
  myYearlyAvgPageviewPerPostByVerticalCtx;
  myYearlyAvgPageviewPerPostByVerticalByMonthCtx;

  myYearlyPostByMonthOptions;
  myYearlyPostByVerticalOptions;
  myYearlyPostByVerticalByMonthOptions;
  myYearlyPageviewByMonthOptions;
  myYearlyPageviewByVerticalOptions;
  myYearlyPageviewByVerticalByMonthOptions;
  myYearlyAvgPageviewPerPostByMonthOptions;
  myYearlyAvgPageviewPerPostByVerticalOptions;
  myYearlyAvgPageviewPerPostByVerticalByMonthOptions;

  myYearlyPostByMonth;
  myYearlyPostByVertical;
  myYearlyPostByVerticalByMonth;
  myYearlyPageviewByMonth;
  myYearlyPageviewByVertical;
  myYearlyPageviewByVerticalByMonth;
  myYearlyAvgPageviewPerPostByMonth;
  myYearlyAvgPageviewPerPostByVertical;
  myYearlyAvgPageviewPerPostByVerticalByMonth;

  myYearlyPostByMonthChart;
  myYearlyPostByVerticalChart;
  myYearlyPostByVerticalByMonthChart;
  myYearlyPageviewByMonthChart;
  myYearlyPageviewByVerticalChart;
  myYearlyPageviewByVerticalByMonthChart;
  myYearlyAvgPageviewPerPostByMonthChart;
  myYearlyAvgPageviewPerPostByVerticalChart;
  myYearlyAvgPageviewPerPostByVerticalByMonthChart;

  constructor(private spinner: SpinnerService, private account: AccountService, private data: DataService, private toast: ToastService, private date: DateService) {
  }

  async ngOnInit() {
    if (!sessionStorage.getItem("pods")) await this.data.initializeData();
    this.pods = JSON.parse(sessionStorage.getItem("pods"));
    this.podSelected = 0;

    this.setVerticals();
    this.setVerticalColors();

    this.isFiscal = false;
    await this.setYears();
    this.setMonths();
    this.setStartDateEndDate();

    if (!sessionStorage.getItem("currentUser")) await this.account.initializeUser();
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    // this.currentUser = ConstantsHelper.TEST_USER;

    this.initCharts();
    await this.loadData();
  }

  setVerticalColors() {
    this.verticalColors = this.pods.filter((pod) => pod.podId == this.podSelected)[0].verticalColors.split(',');
  }

  setVerticals() {
    this.verticals = this.pods.filter((pod) => pod.podId == this.podSelected)[0].verticals.split(',');
  }

  async setYears() {
    this.years = this.isFiscal ? await this.date.getFiscalYearsAsDigitArr(this.podSelected) : await this.date.getCalendarYearsAsDigitArr(this.podSelected);
    if(!this.yearSelected || this.years.indexOf(this.yearSelected) < 0) this.yearSelected = this.date.getCurrentCalendarYearAsDigit();
  }

  setMonths() {
    this.monthsLetterStrArr = this.isFiscal ? this.date.getFiscalMonthsAsLetterStrArr() : this.date.getCalendarMonthsAsLetterStrArr();
  }

  setStartDateEndDate() {
    this.startDate = this.isFiscal ? (this.yearSelected - 1) + '-07-01' : this.yearSelected + '-01-01';
    this.endDate = this.isFiscal ? + this.yearSelected + '-07-01' : (this.yearSelected + 1) + '-01-01';
  }

  initCharts() {
    this.initChartContexts();
    this.setChartOptions();
  }

  initChartContexts() {
    this.myYearlyPostByMonthCtx = document.getElementById('my-yearly-post-by-month');
    this.myYearlyPostByVerticalCtx = document.getElementById('my-yearly-post-by-vertical');
    this.myYearlyPostByVerticalByMonthCtx = document.getElementById('my-yearly-post-by-vertical-by-month');
    this.myYearlyPageviewByMonthCtx = document.getElementById('my-yearly-pageview-by-month');
    this.myYearlyPageviewByVerticalCtx = document.getElementById('my-yearly-pageview-by-vertical');
    this.myYearlyPageviewByVerticalByMonthCtx = document.getElementById('my-yearly-pageview-by-vertical-by-month');
    this.myYearlyAvgPageviewPerPostByMonthCtx = document.getElementById('my-yearly-avg-pageview-per-post-by-month');
    this.myYearlyAvgPageviewPerPostByVerticalCtx = document.getElementById('my-yearly-avg-pageview-per-post-by-vertical');
    this.myYearlyAvgPageviewPerPostByVerticalByMonthCtx = document.getElementById('my-yearly-avg-pageview-per-post-by-vertical-by-month');
  }

  setChartOptions() {
    this.myYearlyPostByMonthOptions = {
      title: {
        display: true,
        text: 'MY YEARLY POST BY MONTH',
        fontSize: window.innerWidth > 960 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision: 0,
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }]
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myYearlyPostByVerticalOptions = {
      title: {
        display: true,
        text: 'MY YEARLY POST BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myYearlyPostByVerticalByMonthOptions = {
      title: {
        display: true,
        text: 'MY YEARLY POST BY VERTICAL BY MONTH',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision: 0,
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }]
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myYearlyPageviewByMonthOptions = {
      title: {
        display: true,
        text: 'MY YEARLY PAGEVIEW BY MONTH',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }]
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myYearlyPageviewByVerticalOptions = {
      title: {
        display: true,
        text: 'MY YEARLY PAGEVIEW BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myYearlyPageviewByVerticalByMonthOptions = {
      title: {
        display: true,
        text: 'MY YEARLY PAGEVIEW BY VERTICAL BY MONTH',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }]
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myYearlyAvgPageviewPerPostByMonthOptions = {
      title: {
        display: true,
        text: 'MY YEARLY AVERAGE PAGEVIEW PER POST BY MONTH',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }]
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myYearlyAvgPageviewPerPostByVerticalOptions = {
      title: {
        display: true,
        text: 'MY YEARLY AVERAGE PAGEVIEW PER POST BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myYearlyAvgPageviewPerPostByVerticalByMonthOptions = {
      title: {
        display: true,
        text: 'MY YEARLY AVERAGE PAGEVIEW PER POST BY VERTICAL BY MONTH',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          }
        }]
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };
  }

  async loadData() {
    await this.spinner.present({
      message: 'Loading data ...'
    });

    try {
      const myYearlyPostByMonthResponse = await this.data.get(`/api/analytics/get?metric=*&aggregation=count&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=publishDate&groupByUnit=year,month`, { headers: { 'Content-Type': 'application/json' } }) as any;

      const myYearlyPostByMonthData = [];

      for (var monthLetterStr of this.monthsLetterStrArr) {
        var entry = {};
        entry['label'] = monthLetterStr;
        var element = myYearlyPostByMonthResponse.filter((e) => {
          return e['month(publishDate)'] == this.date.monthLetterStrToDigit(monthLetterStr);
        });
        entry['data'] = element.length > 0 ? element[0]['count(*)'] : 0;
        myYearlyPostByMonthData.push(entry);
      }

      this.myYearlyPostByMonth = {
        labels: myYearlyPostByMonthData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          label: 'NUM OF POSTS',
          borderColor: ConstantsHelper.LINE_COLOR,
          borderWidth: 2,
          data: myYearlyPostByMonthData.map(entry => entry['data'])
        }]
      };

      const myYearlyPostByVerticalResponse = await this.data.get(`/api/analytics/get?metric=*&aggregation=count&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const myYearlyPostByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = myYearlyPostByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() == vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? element[0]['count(*)'] : 0;
        myYearlyPostByVerticalData.push(entry);
      }

      this.myYearlyPostByVertical = {
        labels: myYearlyPostByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: myYearlyPostByVerticalData.map(entry => entry['data'])
        }]
      };

      const myYearlyPostByVerticalByMonthResponse = await this.data.get(`/api/analytics/get?metric=*&aggregation=count&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupBy=publishDate&groupByUnit=&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const myYearlyPostByVerticalByMonthData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        entry['data'] = [];
        for (var monthLetterStr of this.monthsLetterStrArr) {
          var subEntry = {};
          subEntry['label'] = monthLetterStr;
          var element = myYearlyPostByVerticalByMonthResponse.filter((e) => {
            return e['vertical'] && e['vertical'].toLowerCase() == vertical.toLowerCase() && e['month(publishDate)'] == this.date.monthLetterStrToDigit(monthLetterStr);
          });
          subEntry['data'] = element.length > 0 ? element[0]['count(*)'] : 0;
          entry['data'].push(subEntry);
        }
        myYearlyPostByVerticalByMonthData.push(entry);
      }

      this.myYearlyPostByVerticalByMonth = {
        labels: myYearlyPostByVerticalByMonthData[0]['data'].map(subEntry => subEntry['label'].toUpperCase()),
        datasets: myYearlyPostByVerticalByMonthData.map(entry => {
          return {
            'label': entry['label'].toUpperCase(),
            'backgroundColor': this.verticalColors[this.verticals.indexOf(entry['label'])],
            'data': entry['data'].map(subEntry => subEntry['data'])
          }
        }),
      };

      const myYearlyPageviewByMonthResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=sum&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=publishDate&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const myYearlyPageviewByMonthData = [];

      for (var monthLetterStr of this.monthsLetterStrArr) {
        var entry = {};
        entry['label'] = monthLetterStr;
        var element = myYearlyPageviewByMonthResponse.filter((e) => {
          return e['month(publishDate)'] == this.date.monthLetterStrToDigit(monthLetterStr);
        });
        entry['data'] = element.length > 0 ? element[0]['sum(pageview)'] : 0;
        myYearlyPageviewByMonthData.push(entry);
      }

      this.myYearlyPageviewByMonth = {
        labels: myYearlyPageviewByMonthData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          label: 'PAGEVIEW',
          borderColor: ConstantsHelper.LINE_COLOR,
          borderWidth: 2,
          data: myYearlyPageviewByMonthData.map(entry => entry['data'])
        }]
      };

      const myYearlyPageviewByVerticalResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=sum&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const myYearlyPageviewByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = myYearlyPageviewByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() == vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? element[0]['sum(pageview)'] : 0;
        myYearlyPageviewByVerticalData.push(entry);
      }

      this.myYearlyPageviewByVertical = {
        labels: myYearlyPageviewByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: myYearlyPageviewByVerticalData.map(entry => entry['data'])
        }]
      };

      const myYearlyPageviewByVerticalByMonthResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=sum&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupBy=publishDate&groupByUnit=&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const myYearlyPageviewByVerticalByMonthData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        entry['data'] = [];
        for (var monthLetterStr of this.monthsLetterStrArr) {
          var subEntry = {};
          subEntry['label'] = monthLetterStr;
          var element = myYearlyPageviewByVerticalByMonthResponse.filter((e) => {
            return e['vertical'] && e['vertical'].toLowerCase() == vertical.toLowerCase() && e['month(publishDate)'] == this.date.monthLetterStrToDigit(monthLetterStr);
          });
          subEntry['data'] = element.length > 0 ? element[0]['sum(pageview)'] : 0;
          entry['data'].push(subEntry);
        }
        myYearlyPageviewByVerticalByMonthData.push(entry);
      }

      this.myYearlyPageviewByVerticalByMonth = {
        labels: myYearlyPageviewByVerticalByMonthData[0]['data'].map(subEntry => subEntry['label'].toUpperCase()),
        datasets: myYearlyPageviewByVerticalByMonthData.map(entry => {
          return {
            'label': entry['label'].toUpperCase(),
            'backgroundColor': this.verticalColors[this.verticals.indexOf(entry['label'])],
            'data': entry['data'].map(subEntry => subEntry['data'])
          }
        }),
      };

      const myYearlyAvgPageviewPerPostByMonthResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=avg&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=publishDate&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;


      const myYearlyAvgPageviewPerPostByMonthData = [];

      for (var monthLetterStr of this.monthsLetterStrArr) {
        var entry = {};
        entry['label'] = monthLetterStr;
        var element = myYearlyAvgPageviewPerPostByMonthResponse.filter((e) => {
          return e['month(publishDate)'] == this.date.monthLetterStrToDigit(monthLetterStr);
        });
        entry['data'] = element.length > 0 ? Math.round(element[0]['avg(pageview)']) : 0;
        myYearlyAvgPageviewPerPostByMonthData.push(entry);
      }

      this.myYearlyAvgPageviewPerPostByMonth = {
        labels: myYearlyAvgPageviewPerPostByMonthData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          label: 'AVG PAGEVIEW PER POST',
          borderColor: ConstantsHelper.LINE_COLOR,
          borderWidth: 2,
          data: myYearlyAvgPageviewPerPostByMonthData.map(entry => entry['data'])
        }]
      };

      const myYearlyAvgPageviewPerPostByVerticalResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=avg&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const myYearlyAvgPageviewPerPostByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = myYearlyAvgPageviewPerPostByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() == vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? Math.round(element[0]['avg(pageview)']) : 0;
        myYearlyAvgPageviewPerPostByVerticalData.push(entry);
      }

      this.myYearlyAvgPageviewPerPostByVertical = {
        labels: myYearlyAvgPageviewPerPostByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: myYearlyAvgPageviewPerPostByVerticalData.map(entry => entry['data'])
        }]
      };


      const myYearlyAvgPageviewPerPostByVerticalByMonthResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=avg&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupBy=publishDate&groupByUnit=&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;
      const myYearlyAvgPageviewPerPostByVerticalByMonthData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        entry['data'] = [];
        for (var monthLetterStr of this.monthsLetterStrArr) {
          var subEntry = {};
          subEntry['label'] = monthLetterStr;
          var element = myYearlyAvgPageviewPerPostByVerticalByMonthResponse.filter((e) => {
            return e['vertical'] && e['vertical'].toLowerCase() == vertical.toLowerCase() && e['month(publishDate)'] == this.date.monthLetterStrToDigit(monthLetterStr);
          });
          subEntry['data'] = element.length > 0 ? Math.round(element[0]['avg(pageview)']) : 0;
          entry['data'].push(subEntry);
        }
        myYearlyAvgPageviewPerPostByVerticalByMonthData.push(entry);
      }

      this.myYearlyAvgPageviewPerPostByVerticalByMonth = {
        labels: myYearlyAvgPageviewPerPostByVerticalByMonthData[0]['data'].map(subEntry => subEntry['label'].toUpperCase()),
        datasets: myYearlyAvgPageviewPerPostByVerticalByMonthData.map(entry => {
          return {
            'label': entry['label'].toUpperCase(),
            'backgroundColor': this.verticalColors[this.verticals.indexOf(entry['label'])],
            'data': entry['data'].map(subEntry => subEntry['data'])
          }
        }),
      };

      this.drawCharts();
      await this.spinner.dismiss();

    } catch (err) {
      console.log(err)
      await this.spinner.dismiss();
      await this.toast.present({
        message: 'Error loading data. Please contact EyesOnBlog support.',
        cssClass: 'toast-fail',
        duration: 10000
      });
    }
  }

  drawCharts() {
    this.myYearlyPostByMonthChart = new Chart(this.myYearlyPostByMonthCtx, {
      type: 'line',
      data: this.myYearlyPostByMonth,
      options: this.myYearlyPostByMonthOptions
    });

    this.myYearlyPostByVerticalChart = new Chart(this.myYearlyPostByVerticalCtx, {
      type: 'pie',
      data: this.myYearlyPostByVertical,
      options: this.myYearlyPostByVerticalOptions
    });

    this.myYearlyPostByVerticalByMonthChart = new Chart(this.myYearlyPostByVerticalByMonthCtx, {
      type: 'bar',
      data: this.myYearlyPostByVerticalByMonth,
      options: this.myYearlyPostByVerticalByMonthOptions
    });

    this.myYearlyPageviewByMonthChart = new Chart(this.myYearlyPageviewByMonthCtx, {
      type: 'line',
      data: this.myYearlyPageviewByMonth,
      options: this.myYearlyPageviewByMonthOptions
    });

    this.myYearlyPageviewByVerticalChart = new Chart(this.myYearlyPageviewByVerticalCtx, {
      type: 'pie',
      data: this.myYearlyPageviewByVertical,
      options: this.myYearlyPageviewByVerticalOptions
    });

    this.myYearlyPageviewByVerticalByMonthChart = new Chart(this.myYearlyPageviewByVerticalByMonthCtx, {
      type: 'bar',
      data: this.myYearlyPageviewByVerticalByMonth,
      options: this.myYearlyPageviewByVerticalByMonthOptions
    });

    this.myYearlyAvgPageviewPerPostByMonthChart = new Chart(this.myYearlyAvgPageviewPerPostByMonthCtx, {
      type: 'line',
      data: this.myYearlyAvgPageviewPerPostByMonth,
      options: this.myYearlyAvgPageviewPerPostByMonthOptions
    });

    this.myYearlyAvgPageviewPerPostByVerticalChart = new Chart(this.myYearlyAvgPageviewPerPostByVerticalCtx, {
      type: 'pie',
      data: this.myYearlyAvgPageviewPerPostByVertical,
      options: this.myYearlyAvgPageviewPerPostByVerticalOptions
    });

    this.myYearlyAvgPageviewPerPostByVerticalByMonthChart = new Chart(this.myYearlyAvgPageviewPerPostByVerticalByMonthCtx, {
      type: 'bar',
      data: this.myYearlyAvgPageviewPerPostByVerticalByMonth,
      options: this.myYearlyAvgPageviewPerPostByVerticalByMonthOptions
    });

  }

  async selectPod(podSelected) {
    this.resetData();
    this.resetCharts();
    this.podSelected = podSelected;
    this.setVerticals();
    this.setVerticalColors();
    await this.setYears();
    await this.loadData();
  }

  async selectYear(yearSelected) {
    this.resetData();
    this.resetCharts();
    this.yearSelected = yearSelected;
    this.setMonths();
    this.setStartDateEndDate();
    await this.loadData();
  }

  async selectBasis(basisSelected) {
    this.resetData();
    this.resetCharts();
    this.isFiscal = basisSelected == 1;
    await this.setYears();
    this.setMonths();
    this.setStartDateEndDate();
    await this.loadData();
  }

  resetData() {
    this.myYearlyPostByMonth = null;
    this.myYearlyPostByVertical = null;
    this.myYearlyPostByVerticalByMonth = null;
    this.myYearlyPageviewByMonth = null;
    this.myYearlyPageviewByVertical = null;
    this.myYearlyPageviewByVerticalByMonth = null;
    this.myYearlyAvgPageviewPerPostByMonth = null;
    this.myYearlyAvgPageviewPerPostByVertical = null;
    this.myYearlyAvgPageviewPerPostByVerticalByMonth = null;
  }

  resetCharts() {
    this.myYearlyPostByMonthChart.destroy();
    this.myYearlyPostByVerticalChart.destroy();
    this.myYearlyPostByVerticalByMonthChart.destroy();
    this.myYearlyPageviewByMonthChart.destroy();
    this.myYearlyPageviewByVerticalChart.destroy();
    this.myYearlyPageviewByVerticalByMonthChart.destroy();
    this.myYearlyAvgPageviewPerPostByMonthChart.destroy();
    this.myYearlyAvgPageviewPerPostByVerticalChart.destroy();
    this.myYearlyAvgPageviewPerPostByVerticalByMonthChart.destroy();
  }

}
