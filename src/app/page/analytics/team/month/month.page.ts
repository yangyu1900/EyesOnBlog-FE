import { Component, OnInit } from '@angular/core';

import { Chart } from 'chart.js';

import { SpinnerService } from '../../../../service/spinner.service';
import { DataService } from '../../../../service/data.service';
import { DateService } from '../../../../service/date.service';
import { ToastService } from '../../../../service/toast.service';
import { Pod } from '../../../../model/pod';

@Component({
  selector: 'app-month',
  templateUrl: './month.page.html',
  styleUrls: ['./month.page.scss'],
})
export class MonthPage implements OnInit {
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

  teamMonthlyPostByVerticalCtx;
  teamMonthlyPageviewByVerticalCtx;
  teamMonthlyAvgPageviewPerPostByVerticalCtx;

  teamMonthlyPostByVerticalOptions;
  teamMonthlyPageviewByVerticalOptions;
  teamMonthlyAvgPageviewPerPostByVerticalOptions;

  teamMonthlyPostByVerticalChart;
  teamMonthlyPageviewByVerticalChart;
  teamMonthlyAvgPageviewPerPostByVerticalChart;

  teamMonthlyPostByVertical;
  teamMonthlyPageviewByVertical;
  teamMonthlyAvgPageviewPerPostByVertical;

  constructor(private spinner: SpinnerService, private data: DataService, private toast: ToastService, private date: DateService) {
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
    this.teamMonthlyPostByVerticalCtx = document.getElementById('team-monthly-post-by-vertical');
    this.teamMonthlyPageviewByVerticalCtx = document.getElementById('team-monthly-pageview-by-vertical');
    this.teamMonthlyAvgPageviewPerPostByVerticalCtx = document.getElementById('team-monthly-avg-pageview-per-post-by-vertical');
  }

  setChartOptions() {
    this.teamMonthlyPostByVerticalOptions = {
      title: {
        display: true,
        text: 'TEAM MONTHLY POST BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.teamMonthlyPageviewByVerticalOptions = {
      title: {
        display: true,
        text: 'TEAM MONTHLY PAGEVIEW BY VERTICAL',
        fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
      },
      legend: {
        labels: {
          fontSize: window.innerWidth > 1440 ? 12 : window.innerWidth > 479 ? 10 : 8,
          boxWidth: window.innerWidth > 1440 ? 40 : window.innerWidth > 479 ? 30 : 25,
        }
      }
    };

    this.teamMonthlyAvgPageviewPerPostByVerticalOptions = {
      title: {
        display: true,
        text: 'TEAM MONTHLY AVERAGE PAGEVIEW PER POST BY VERTICAL',
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
      const teamMonthlyPostByVerticalResponse = await this.data.get(`/api/analytics/get?metric=*&aggregation=count&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const teamMonthlyPostByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = teamMonthlyPostByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() == vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? element[0]['count(*)'] : 0;
        teamMonthlyPostByVerticalData.push(entry);
      }

      this.teamMonthlyPostByVertical = {
        labels: teamMonthlyPostByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: teamMonthlyPostByVerticalData.map(entry => entry['data'])
        }]
      };


      const teamMonthlyPageviewByVerticalResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=sum&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const teamMonthlyPageviewByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = teamMonthlyPageviewByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() == vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? element[0]['sum(pageview)'] : 0;
        teamMonthlyPageviewByVerticalData.push(entry);
      }

      this.teamMonthlyPageviewByVertical = {
        labels: teamMonthlyPageviewByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: teamMonthlyPageviewByVerticalData.map(entry => entry['data'])
        }]
      };

      const teamMonthlyAvgPageviewPerPostByVerticalResponse = await this.data.get(`/api/analytics/get?metric=pageview&aggregation=avg&filterBy=podId&filterByValue=${this.podSelected}&filterBy=publishDate&filterByValue=${this.startDate},${this.endDate}&groupBy=vertical&groupByUnit=`, {
        headers: { 'Content-Type': 'application/json' }
      }) as any;

      const teamMonthlyAvgPageviewPerPostByVerticalData = [];

      for (var vertical of this.verticals) {
        var entry = {};
        entry['label'] = vertical;
        var element = teamMonthlyAvgPageviewPerPostByVerticalResponse.filter((e) => {
          return e['vertical'] && e['vertical'].toLowerCase() == vertical.toLowerCase();
        });
        entry['data'] = element.length > 0 ? Math.round(element[0]['avg(pageview)']) : 0;
        teamMonthlyAvgPageviewPerPostByVerticalData.push(entry);
      }

      this.teamMonthlyAvgPageviewPerPostByVertical = {
        labels: teamMonthlyAvgPageviewPerPostByVerticalData.map(entry => entry['label'].toUpperCase()),
        datasets: [{
          backgroundColor: this.verticalColors,
          data: teamMonthlyAvgPageviewPerPostByVerticalData.map(entry => entry['data'])
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
    this.teamMonthlyPostByVerticalChart = new Chart(this.teamMonthlyPostByVerticalCtx, {
      type: 'pie',
      data: this.teamMonthlyPostByVertical,
      options: this.teamMonthlyPostByVerticalOptions
    });

    this.teamMonthlyPageviewByVerticalChart = new Chart(this.teamMonthlyPageviewByVerticalCtx, {
      type: 'pie',
      data: this.teamMonthlyPageviewByVertical,
      options: this.teamMonthlyPageviewByVerticalOptions
    });

    this.teamMonthlyAvgPageviewPerPostByVerticalChart = new Chart(this.teamMonthlyAvgPageviewPerPostByVerticalCtx, {
      type: 'pie',
      data: this.teamMonthlyAvgPageviewPerPostByVertical,
      options: this.teamMonthlyAvgPageviewPerPostByVerticalOptions
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
    this.setStartDateEndDate();
    await this.loadData();
  }

  async selectMonth(monthSelected) {
    this.resetData();
    this.resetCharts();
    this.monthSelected = monthSelected;
    this.setStartDateEndDate();
    await this.loadData();
  }

  resetData() {
    this.teamMonthlyPostByVertical = null;
    this.teamMonthlyPageviewByVertical = null;
    this.teamMonthlyAvgPageviewPerPostByVertical = null;
  }

  resetCharts() {
    this.teamMonthlyPostByVerticalChart.destroy();
    this.teamMonthlyPageviewByVerticalChart.destroy();
    this.teamMonthlyAvgPageviewPerPostByVerticalChart.destroy();
  }
}
