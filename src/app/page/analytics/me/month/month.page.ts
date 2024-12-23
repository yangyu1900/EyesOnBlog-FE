import { Component, OnInit } from '@angular/core';

import { Chart } from 'chart.js';

import * as ConstantsHelper from '../../../../util/constantshelper.util';

import { SpinnerService } from '../../../../service/spinner.service';
import { DataService } from '../../../../service/data.service';
import { DateService } from '../../../../service/date.service';
import { AccountService } from '../../../../service/account.service';
import { ToastService } from '../../../../service/toast.service';

import { User } from '../../../../model/user';
import { Pod } from '../../../../model/pod';

@Component({
  selector: 'app-month',
  templateUrl: './month.page.html',
  styleUrls: ['./month.page.scss'],
})
export class MonthPage implements OnInit {
  currentUser: User;
  pods: Pod[];
  podSelected: number;
  years: number[];
  yearSelected: number;
  months: number[];
  monthSelected: number;
  startDate: string;
  endDate: string;
  verticals: string[];
  verticalColors: string[];

  myMonthlyPostByVerticalCtx;
  myMonthlyPageviewByVerticalCtx;
  myMonthlyAvgPageviewPerPostByVerticalCtx;

  myMonthlyPostByVerticalOptions;
  myMonthlyPageviewByVerticalOptions;
  myMonthlyAvgPageviewPerPostByVerticalOptions;

  myMonthlyPostByVerticalChart;
  myMonthlyPageviewByVerticalChart;
  myMonthlyAvgPageviewPerPostByVerticalChart;

  myMonthlyPostByVertical;
  myMonthlyPageviewByVertical;
  myMonthlyAvgPageviewPerPostByVertical;

  constructor(private spinner: SpinnerService, private account: AccountService, private data: DataService, private toast: ToastService, private date: DateService) {
  }

  async ngOnInit() {
    if (!sessionStorage.getItem("pods")) await this.data.initializeData();
    this.pods = JSON.parse(sessionStorage.getItem("pods"));
    this.podSelected = 0;

    this.setVerticals();
    this.setVerticalColors();

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
    this.verticalColors = this.pods.filter((pod) => pod.podId === this.podSelected)[0].verticalColors.split(',');
  }

  setVerticals() {
    this.verticals = this.pods.filter((pod) => pod.podId === this.podSelected)[0].verticals.split(',');
  }

  async setYears() {
    this.years = await this.date.getCalendarYearsAsDigitArr(this.podSelected);
    if(!this.yearSelected) this.yearSelected = this.date.getCurrentCalendarYearAsDigit();
  }

  setMonths() {
    this.months = this.date.getCalendarMonthsAsDigitArr();
    this.monthSelected = this.date.getCurrentCalendarMonthAsDigit();
  }

  setStartDateEndDate() {
    this.startDate = `${this.yearSelected}-${this.monthSelected}-01`;
    this.endDate = `${this.yearSelected}-${this.monthSelected + 1}-01`
  }

  initCharts() {
    this.initChartContexts();
    this.setChartOptions();
  }

  initChartContexts() {
    this.myMonthlyPostByVerticalCtx = document.getElementById('my-monthly-post-by-vertical');
    this.myMonthlyPageviewByVerticalCtx = document.getElementById('my-monthly-pageview-by-vertical');
    this.myMonthlyAvgPageviewPerPostByVerticalCtx = document.getElementById('my-monthly-avg-pageview-per-post-by-vertical');
  }

  setChartOptions() {
    this.myMonthlyPostByVerticalOptions = {
      title: {
        display: true,
        text: 'MY MONTHLY POST BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myMonthlyPageviewByVerticalOptions = {
      title: {
        display: true,
        text: 'MY MONTHLY PAGEVIEW BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.myMonthlyAvgPageviewPerPostByVerticalOptions = {
      title: {
        display: true,
        text: 'MY MONTHLY AVERAGE PAGEVIEW PER POST BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
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
      const myMonthlyPostByVerticalResponse = await this.data.get(`/api/analytics/get?metric=*&aggregation=count&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const myMonthlyPostByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = myMonthlyPostByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() === vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? element[0]['count(*)'] : 0;
        myMonthlyPostByVerticalData.push(entry);
      }

      this.myMonthlyPostByVertical = {
        labels: myMonthlyPostByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: myMonthlyPostByVerticalData.map(entry => entry['data'])
        }]
      };


      const myMonthlyPageviewByVerticalResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=sum&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const myMonthlyPageviewByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = myMonthlyPageviewByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() === vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? element[0]['sum(pageview)'] : 0;
        myMonthlyPageviewByVerticalData.push(entry);
      }

      this.myMonthlyPageviewByVertical = {
        labels: myMonthlyPageviewByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: myMonthlyPageviewByVerticalData.map(entry => entry['data'])
        }]
      };

      const myMonthlyAvgPageviewPerPostByVerticalResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=avg&filterBy=podId&filterByValue=${this.podSelected}&filterBy=authorId&filterByValue=${this.currentUser.userId}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const myMonthlyAvgPageviewPerPostByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = myMonthlyAvgPageviewPerPostByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() === vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? Math.round(element[0]['avg(pageview)']) : 0;
        myMonthlyAvgPageviewPerPostByVerticalData.push(entry);
      }

      this.myMonthlyAvgPageviewPerPostByVertical = {
        labels: myMonthlyAvgPageviewPerPostByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: myMonthlyAvgPageviewPerPostByVerticalData.map(entry => entry['data'])
        }]
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
    this.myMonthlyPostByVerticalChart = new Chart(this.myMonthlyPostByVerticalCtx, {
      type: 'pie',
      data: this.myMonthlyPostByVertical,
      options: this.myMonthlyPostByVerticalOptions
    });

    this.myMonthlyPageviewByVerticalChart = new Chart(this.myMonthlyPageviewByVerticalCtx, {
      type: 'pie',
      data: this.myMonthlyPageviewByVertical,
      options: this.myMonthlyPageviewByVerticalOptions
    });

    this.myMonthlyAvgPageviewPerPostByVerticalChart = new Chart(this.myMonthlyAvgPageviewPerPostByVerticalCtx, {
      type: 'pie',
      data: this.myMonthlyAvgPageviewPerPostByVertical,
      options: this.myMonthlyAvgPageviewPerPostByVerticalOptions
    });
  }

  async selectPod(podSelected) {
    this.resetData();
    this.resetCharts();
    this.podSelected = Number(podSelected);
    this.setVerticals();
    this.setVerticalColors;
    await this.setYears();
    await this.loadData();
  }

  async selectYear(yearSelected) {
    this.resetData();
    this.resetCharts();
    this.yearSelected = Number(yearSelected);
    this.setStartDateEndDate();
    await this.loadData();
  }

  async selectMonth(monthSelected) {
    this.resetData();
    this.resetCharts();
    this.monthSelected = Number(monthSelected);
    this.setStartDateEndDate();
    await this.loadData();
  }

  resetData() {
    this.myMonthlyPostByVertical = null;
    this.myMonthlyPageviewByVertical = null;
    this.myMonthlyAvgPageviewPerPostByVertical = null;
  }

  resetCharts() {
    this.myMonthlyPostByVerticalChart.destroy();
    this.myMonthlyPageviewByVerticalChart.destroy();
    this.myMonthlyAvgPageviewPerPostByVerticalChart.destroy();
  }
}
