import { Component, OnInit } from '@angular/core';

import { Chart } from 'chart.js';

import * as ConstantsHelper from '../../../../util/constantshelper.util';

import { SpinnerService } from '../../../../service/spinner.service';
import { DataService } from '../../../../service/data.service';
import { DateService } from '../../../../service/date.service';
import { ToastService } from '../../../../service/toast.service';
import { Pod } from '../../../../model/pod';

@Component({
  selector: 'app-year',
  templateUrl: './year.page.html',
  styleUrls: ['./year.page.scss'],
})
export class YearPage implements OnInit {
  pods: Pod[];
  podSelected: number;
  years: number[];
  yearSelected: number;
  isFiscal: boolean;
  startDate: string;
  endDate: string;
  monthsLetterStrArr: string[];
  verticals: string[];
  verticalColors: string[];

  teamYearlyPostByMonthCtx;
  teamYearlyPostByVerticalCtx;
  teamYearlyPostByVerticalByMonthCtx;
  teamYearlyPageviewByMonthCtx;
  teamYearlyPageviewByVerticalCtx;
  teamYearlyPageviewByVerticalByMonthCtx;
  teamYearlyAvgPageviewPerPostByMonthCtx;
  teamYearlyAvgPageviewPerPostByVerticalCtx;
  teamYearlyAvgPageviewPerPostByVerticalByMonthCtx;

  teamYearlyPostByMonthOptions;
  teamYearlyPostByVerticalOptions;
  teamYearlyPostByVerticalByMonthOptions;
  teamYearlyPageviewByMonthOptions;
  teamYearlyPageviewByVerticalOptions;
  teamYearlyPageviewByVerticalByMonthOptions;
  teamYearlyAvgPageviewPerPostByMonthOptions;
  teamYearlyAvgPageviewPerPostByVerticalOptions;
  teamYearlyAvgPageviewPerPostByVerticalByMonthOptions;

  teamYearlyPostByMonth;
  teamYearlyPostByVertical;
  teamYearlyPostByVerticalByMonth;
  teamYearlyPageviewByMonth;
  teamYearlyPageviewByVertical;
  teamYearlyPageviewByVerticalByMonth;
  teamYearlyAvgPageviewPerPostByMonth;
  teamYearlyAvgPageviewPerPostByVertical;
  teamYearlyAvgPageviewPerPostByVerticalByMonth;

  teamYearlyPostByMonthChart;
  teamYearlyPostByVerticalChart;
  teamYearlyPostByVerticalByMonthChart;
  teamYearlyPageviewByMonthChart;
  teamYearlyPageviewByVerticalChart;
  teamYearlyPageviewByVerticalByMonthChart;
  teamYearlyAvgPageviewPerPostByMonthChart;
  teamYearlyAvgPageviewPerPostByVerticalChart;
  teamYearlyAvgPageviewPerPostByVerticalByMonthChart;

  constructor(private spinner: SpinnerService, private data: DataService, private toast: ToastService, private date: DateService) {
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

    this.initCharts();
    await this.loadData();
  }

  setVerticalColors() {
    this.verticalColors = this.pods.filter((pod) => pod.podId === this.podSelected)[0].verticalColors.split(',');
  }

  setVerticals() {
    this.verticals = this.pods.filter((pod) => pod.podId === this.podSelected)[0].verticals.split(',');
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
    this.teamYearlyPostByMonthCtx = document.getElementById('team-yearly-post-by-month');
    this.teamYearlyPostByVerticalCtx = document.getElementById('team-yearly-post-by-vertical');
    this.teamYearlyPostByVerticalByMonthCtx = document.getElementById('team-yearly-post-by-vertical-by-month');
    this.teamYearlyPageviewByMonthCtx = document.getElementById('team-yearly-pageview-by-month');
    this.teamYearlyPageviewByVerticalCtx = document.getElementById('team-yearly-pageview-by-vertical');
    this.teamYearlyPageviewByVerticalByMonthCtx = document.getElementById('team-yearly-pageview-by-vertical-by-month');
    this.teamYearlyAvgPageviewPerPostByMonthCtx = document.getElementById('team-yearly-avg-pageview-per-post-by-month');
    this.teamYearlyAvgPageviewPerPostByVerticalCtx = document.getElementById('team-yearly-avg-pageview-per-post-by-vertical');
    this.teamYearlyAvgPageviewPerPostByVerticalByMonthCtx = document.getElementById('team-yearly-avg-pageview-per-post-by-vertical-by-month');
  }

  setChartOptions() {
    this.teamYearlyPostByMonthOptions = {
      title: {
        display: true,
        text: 'TEAM YEARLY POST BY MONTH',
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

    this.teamYearlyPostByVerticalOptions = {
      title: {
        display: true,
        text: 'TEAM YEARLY POST BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.teamYearlyPostByVerticalByMonthOptions = {
      title: {
        display: true,
        text: 'TEAM YEARLY POST BY VERTICAL BY MONTH',
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

    this.teamYearlyPageviewByMonthOptions = {
      title: {
        display: true,
        text: 'TEAM YEARLY PAGEVIEW BY MONTH',
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

    this.teamYearlyPageviewByVerticalOptions = {
      title: {
        display: true,
        text: 'TEAM YEARLY PAGEVIEW BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.teamYearlyPageviewByVerticalByMonthOptions = {
      title: {
        display: true,
        text: 'TEAM YEARLY PAGEVIEW BY VERTICAL BY MONTH',
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

    this.teamYearlyAvgPageviewPerPostByMonthOptions = {
      title: {
        display: true,
        text: 'TEAM YEARLY AVERAGE PAGEVIEW PER POST BY MONTH',
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

    this.teamYearlyAvgPageviewPerPostByVerticalOptions = {
      title: {
        display: true,
        text: 'TEAM YEARLY AVERAGE PAGEVIEW PER POST BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.teamYearlyAvgPageviewPerPostByVerticalByMonthOptions = {
      title: {
        display: true,
        text: 'TEAM YEARLY AVERAGE PAGEVIEW PER POST BY VERTICAL BY MONTH',
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
      const teamYearlyPostByMonthResponse = await this.data.get(`/api/analytics/get?metric=*&aggregation=count&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=publishDate&groupByUnit=year,month`, { headers: { 'Content-Type': 'application/json' } }) as any;

      const teamYearlyPostByMonthData = [];

      for (var monthLetterStr of this.monthsLetterStrArr) {
        var entry = {};
        entry['label'] = monthLetterStr;
        var element = teamYearlyPostByMonthResponse.filter((e) => {
          return e['month(publishDate)'] === this.date.monthLetterStrToDigit(monthLetterStr);
        });
        entry['data'] = element.length > 0 ? element[0]['count(*)'] : 0;
        teamYearlyPostByMonthData.push(entry);
      }

      this.teamYearlyPostByMonth = {
        labels: teamYearlyPostByMonthData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          label: 'NUM OF POSTS',
          borderColor: ConstantsHelper.LINE_COLOR,
          borderWidth: 2,
          data: teamYearlyPostByMonthData.map(entry => entry['data'])
        }]
      };

      const teamYearlyPostByVerticalResponse = await this.data.get(`/api/analytics/get?metric=*&aggregation=count&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const teamYearlyPostByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = teamYearlyPostByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() === vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? element[0]['count(*)'] : 0;
        teamYearlyPostByVerticalData.push(entry);
      }

      this.teamYearlyPostByVertical = {
        labels: teamYearlyPostByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: teamYearlyPostByVerticalData.map(entry => entry['data'])
        }]
      };

      const teamYearlyPostByVerticalByMonthResponse = await this.data.get(`/api/analytics/get?metric=*&aggregation=count&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupBy=publishDate&groupByUnit=&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const teamYearlyPostByVerticalByMonthData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        entry['data'] = [];
        for (var monthLetterStr of this.monthsLetterStrArr) {
          var subEntry = {};
          subEntry['label'] = monthLetterStr;
          var element = teamYearlyPostByVerticalByMonthResponse.filter((e) => {
            return e['vertical'] && e['vertical'].toLowerCase() === vertical.toLowerCase() && e['month(publishDate)'] === this.date.monthLetterStrToDigit(monthLetterStr);
          });
          subEntry['data'] = element.length > 0 ? element[0]['count(*)'] : 0;
          entry['data'].push(subEntry);
        }
        teamYearlyPostByVerticalByMonthData.push(entry);
      }

      this.teamYearlyPostByVerticalByMonth = {
        labels: teamYearlyPostByVerticalByMonthData[0]['data'].map(subEntry => subEntry['label'].toUpperCase()),
        datasets: teamYearlyPostByVerticalByMonthData.map(entry => {
          return {
            'label': entry['label'].toUpperCase(),
            'backgroundColor': this.verticalColors[this.verticals.indexOf(entry['label'])],
            'data': entry['data'].map(subEntry => subEntry['data'])
          }
        }),
      };

      const teamYearlyPageviewByMonthResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=sum&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=publishDate&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const teamYearlyPageviewByMonthData = [];

      for (var monthLetterStr of this.monthsLetterStrArr) {
        var entry = {};
        entry['label'] = monthLetterStr;
        var element = teamYearlyPageviewByMonthResponse.filter((e) => {
          return e['month(publishDate)'] === this.date.monthLetterStrToDigit(monthLetterStr);
        });
        entry['data'] = element.length > 0 ? element[0]['sum(pageview)'] : 0;
        teamYearlyPageviewByMonthData.push(entry);
      }

      this.teamYearlyPageviewByMonth = {
        labels: teamYearlyPageviewByMonthData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          label: 'PAGEVIEW',
          borderColor: ConstantsHelper.LINE_COLOR,
          borderWidth: 2,
          data: teamYearlyPageviewByMonthData.map(entry => entry['data'])
        }]
      };

      const teamYearlyPageviewByVerticalResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=sum&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const teamYearlyPageviewByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = teamYearlyPageviewByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() === vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? element[0]['sum(pageview)'] : 0;
        teamYearlyPageviewByVerticalData.push(entry);
      }

      this.teamYearlyPageviewByVertical = {
        labels: teamYearlyPageviewByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: teamYearlyPageviewByVerticalData.map(entry => entry['data'])
        }]
      };

      const teamYearlyPageviewByVerticalByMonthResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=sum&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupBy=publishDate&groupByUnit=&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const teamYearlyPageviewByVerticalByMonthData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        entry['data'] = [];
        for (var monthLetterStr of this.monthsLetterStrArr) {
          var subEntry = {};
          subEntry['label'] = monthLetterStr;
          var element = teamYearlyPageviewByVerticalByMonthResponse.filter((e) => {
            return e['vertical'] && e['vertical'].toLowerCase() === vertical.toLowerCase() && e['month(publishDate)'] === this.date.monthLetterStrToDigit(monthLetterStr);
          });
          subEntry['data'] = element.length > 0 ? element[0]['sum(pageview)'] : 0;
          entry['data'].push(subEntry);
        }
        teamYearlyPageviewByVerticalByMonthData.push(entry);
      }

      this.teamYearlyPageviewByVerticalByMonth = {
        labels: teamYearlyPageviewByVerticalByMonthData[0]['data'].map(subEntry => subEntry['label'].toUpperCase()),
        datasets: teamYearlyPageviewByVerticalByMonthData.map(entry => {
          return {
            'label': entry['label'].toUpperCase(),
            'backgroundColor': this.verticalColors[this.verticals.indexOf(entry['label'])],
            'data': entry['data'].map(subEntry => subEntry['data'])
          }
        }),
      };

      const teamYearlyAvgPageviewPerPostByMonthResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=avg&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=publishDate&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;


      const teamYearlyAvgPageviewPerPostByMonthData = [];

      for (var monthLetterStr of this.monthsLetterStrArr) {
        var entry = {};
        entry['label'] = monthLetterStr;
        var element = teamYearlyAvgPageviewPerPostByMonthResponse.filter((e) => {
          return e['month(publishDate)'] === this.date.monthLetterStrToDigit(monthLetterStr);
        });
        entry['data'] = element.length > 0 ? Math.round(element[0]['avg(pageview)']) : 0;
        teamYearlyAvgPageviewPerPostByMonthData.push(entry);
      }

      this.teamYearlyAvgPageviewPerPostByMonth = {
        labels: teamYearlyAvgPageviewPerPostByMonthData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          label: 'AVG PAGEVIEW PER POST',
          borderColor: ConstantsHelper.LINE_COLOR,
          borderWidth: 2,
          data: teamYearlyAvgPageviewPerPostByMonthData.map(entry => entry['data'])
        }]
      };

      const teamYearlyAvgPageviewPerPostByVerticalResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=avg&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const teamYearlyAvgPageviewPerPostByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = teamYearlyAvgPageviewPerPostByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() === vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? Math.round(element[0]['avg(pageview)']) : 0;
        teamYearlyAvgPageviewPerPostByVerticalData.push(entry);
      }

      this.teamYearlyAvgPageviewPerPostByVertical = {
        labels: teamYearlyAvgPageviewPerPostByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: teamYearlyAvgPageviewPerPostByVerticalData.map(entry => entry['data'])
        }]
      };


      const teamYearlyAvgPageviewPerPostByVerticalByMonthResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=avg&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupBy=publishDate&groupByUnit=&groupByUnit=year,month`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;
      const teamYearlyAvgPageviewPerPostByVerticalByMonthData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        entry['data'] = [];
        for (var monthLetterStr of this.monthsLetterStrArr) {
          var subEntry = {};
          subEntry['label'] = monthLetterStr;
          var element = teamYearlyAvgPageviewPerPostByVerticalByMonthResponse.filter((e) => {
            return e['vertical'] && e['vertical'].toLowerCase() === vertical.toLowerCase() && e['month(publishDate)'] === this.date.monthLetterStrToDigit(monthLetterStr);
          });
          subEntry['data'] = element.length > 0 ? Math.round(element[0]['avg(pageview)']) : 0;
          entry['data'].push(subEntry);
        }
        teamYearlyAvgPageviewPerPostByVerticalByMonthData.push(entry);
      }

      this.teamYearlyAvgPageviewPerPostByVerticalByMonth = {
        labels: teamYearlyAvgPageviewPerPostByVerticalByMonthData[0]['data'].map(subEntry => subEntry['label'].toUpperCase()),
        datasets: teamYearlyAvgPageviewPerPostByVerticalByMonthData.map(entry => {
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
    this.teamYearlyPostByMonthChart = new Chart(this.teamYearlyPostByMonthCtx, {
      type: 'line',
      data: this.teamYearlyPostByMonth,
      options: this.teamYearlyPostByMonthOptions
    });

    this.teamYearlyPostByVerticalChart = new Chart(this.teamYearlyPostByVerticalCtx, {
      type: 'pie',
      data: this.teamYearlyPostByVertical,
      options: this.teamYearlyPostByVerticalOptions
    });

    this.teamYearlyPostByVerticalByMonthChart = new Chart(this.teamYearlyPostByVerticalByMonthCtx, {
      type: 'bar',
      data: this.teamYearlyPostByVerticalByMonth,
      options: this.teamYearlyPostByVerticalByMonthOptions
    });

    this.teamYearlyPageviewByMonthChart = new Chart(this.teamYearlyPageviewByMonthCtx, {
      type: 'line',
      data: this.teamYearlyPageviewByMonth,
      options: this.teamYearlyPageviewByMonthOptions
    });

    this.teamYearlyPageviewByVerticalChart = new Chart(this.teamYearlyPageviewByVerticalCtx, {
      type: 'pie',
      data: this.teamYearlyPageviewByVertical,
      options: this.teamYearlyPageviewByVerticalOptions
    });

    this.teamYearlyPageviewByVerticalByMonthChart = new Chart(this.teamYearlyPageviewByVerticalByMonthCtx, {
      type: 'bar',
      data: this.teamYearlyPageviewByVerticalByMonth,
      options: this.teamYearlyPageviewByVerticalByMonthOptions
    });

    this.teamYearlyAvgPageviewPerPostByMonthChart = new Chart(this.teamYearlyAvgPageviewPerPostByMonthCtx, {
      type: 'line',
      data: this.teamYearlyAvgPageviewPerPostByMonth,
      options: this.teamYearlyAvgPageviewPerPostByMonthOptions
    });

    this.teamYearlyAvgPageviewPerPostByVerticalChart = new Chart(this.teamYearlyAvgPageviewPerPostByVerticalCtx, {
      type: 'pie',
      data: this.teamYearlyAvgPageviewPerPostByVertical,
      options: this.teamYearlyAvgPageviewPerPostByVerticalOptions
    });

    this.teamYearlyAvgPageviewPerPostByVerticalByMonthChart = new Chart(this.teamYearlyAvgPageviewPerPostByVerticalByMonthCtx, {
      type: 'bar',
      data: this.teamYearlyAvgPageviewPerPostByVerticalByMonth,
      options: this.teamYearlyAvgPageviewPerPostByVerticalByMonthOptions
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
    this.isFiscal = basisSelected === 1;
    await this.setYears();
    this.setMonths();
    this.setStartDateEndDate();
    await this.loadData();
  }

  resetData() {
    this.teamYearlyPostByMonth = null;
    this.teamYearlyPostByVertical = null;
    this.teamYearlyPostByVerticalByMonth = null;
    this.teamYearlyPageviewByMonth = null;
    this.teamYearlyPageviewByVertical = null;
    this.teamYearlyPageviewByVerticalByMonth = null;
    this.teamYearlyAvgPageviewPerPostByMonth = null;
    this.teamYearlyAvgPageviewPerPostByVertical = null;
    this.teamYearlyAvgPageviewPerPostByVerticalByMonth = null;
  }

  resetCharts() {
    this.teamYearlyPostByMonthChart.destroy();
    this.teamYearlyPostByVerticalChart.destroy();
    this.teamYearlyPostByVerticalByMonthChart.destroy();
    this.teamYearlyPageviewByMonthChart.destroy();
    this.teamYearlyPageviewByVerticalChart.destroy();
    this.teamYearlyPageviewByVerticalByMonthChart.destroy();
    this.teamYearlyAvgPageviewPerPostByMonthChart.destroy();
    this.teamYearlyAvgPageviewPerPostByVerticalChart.destroy();
    this.teamYearlyAvgPageviewPerPostByVerticalByMonthChart.destroy();
  }

}
