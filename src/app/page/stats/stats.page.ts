import { Component, OnInit } from '@angular/core';

import { SpinnerService } from "../../service/spinner.service";
import { DataService } from '../../service/data.service';
import { ToastService } from '../../service/toast.service';

import { Pod } from '../../model/pod';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})

export class StatsPage implements OnInit {
  searchRequestForm: FormGroup;
  pods: Pod[];
  podSelected: number;

  keywords: string[];

  tableHeaders: string[];
  orderBys: string[];
  orderIcons: string[];
  ascOrderIcon: string;
  dscOrderIcon: string;

  orderIconColorDefault: string;
  orderIconColorHover: string;
  orderIconColorSelected: string;

  orders: number[];
  orderByOrders: number[];

  skip: number;
  limit: number;

  currentQuery: string;

  records: [];
  dataSize: number;

  constructor(private formBuilder: FormBuilder, private spinner: SpinnerService, private data: DataService, private toast: ToastService) { 
    this.searchRequestForm = this.formBuilder.group({
      keywords: ['']
    });
  }

  async ngOnInit() {
    this.keywords = [];

    if (!sessionStorage.getItem("pods")) await this.data.initializeData();
    this.pods = JSON.parse(sessionStorage.getItem("pods"));
    this.podSelected = 0;

    this.tableHeaders = ['authorName', 'vertical', 'publishDate', 'title', 'pageview'];
    
    this.orderBys = [];

    this.dscOrderIcon = '../../../assets/icon/arrow-down.svg';
    this.ascOrderIcon = '../../../assets/icon/arrow-up.svg';
    this.orderIcons = [];
    this.tableHeaders.forEach(() => this.orderIcons.push(this.ascOrderIcon));

    this.orderIconColorDefault = 'transparent';
    this.orderIconColorHover = '#757575';
    this.orderIconColorSelected = '#20252b';

    this.orders = [0, 0, 0, 0, 0];
    this.orderByOrders = [];
    this.skip = 0;
    this.limit = 15;
    this.updateCurrentQuery();
    await this.getDataSize();
    await this.loadData();
  }

  private updateCurrentQuery() {
    this.currentQuery = `filterBy=podId&filterByValue=${this.podSelected}`
    if (this.keywords.length != 0) this.currentQuery += `&filterBy=title,vertical,authorName&filterByValue='${this.keywords.join('\',\'')}'`;
    this.orderBys.forEach((orderBy, index) => this.currentQuery += `&orderBy=${orderBy}&orderByOrder=${this.orderByOrders[index]}`);
  }

  async getDataSize() {
    const res = await this.data.get(`/api/blog/get?metric=*&aggregation=count&${this.currentQuery}`, { headers: { 'Content-Type': 'application/json' } }).catch(err => console.log(err)) as any;
    this.dataSize = res.length > 0 ? res[0]['count(*)'] : 0;
  }

  async loadData() {
    await this.spinner.present({
      message: 'Loading data ...'
    });
    const res = await this.data.get(`/api/blog/get?${this.currentQuery}&skip=${this.skip}&limit=${this.limit}`, { headers: { 'Content-Type': 'application/json' } }).catch(
      async (err) => {
        console.log(err);
        await this.spinner.dismiss();
        await this.toast.present({
          message: 'Error loading data. Please contact EyesOnBlog support.',
          cssClass: 'toast-fail',
          duration: 10000
        });
      }) as any;
    this.records = res;
    await this.spinner.dismiss();
  }

  async selectPod(podSelected) {
    this.resetData();
    this.podSelected = podSelected;
    this.updateCurrentQuery();
    await this.getDataSize();
    await this.loadData();
  }

  private resetData() {
    this.records = [];
  }

  private resetSkip() {
    this.skip = 0;
  }

  async onSubmitSearchRequest() {
    this.resetData();
    this.resetSkip();
    this.keywords = this.searchRequestForm.value['keywords'].trim().split(' ');
    this.updateCurrentQuery();
    await this.getDataSize();
    await this.loadData();
  }

  async onClickOrderIcon(e: HTMLElement) {
    var index = Number.parseInt(e.id);
    switch (this.orders[index]) {
      case 0:
        e.style.color = this.orderIconColorSelected;
        this.orderBys.push(this.tableHeaders[index]);
        this.orderByOrders.push(1);
        this.orders[index] = 1;
        this.resetData();
        this.updateCurrentQuery();
        await this.getDataSize();
        await this.loadData();
        break;
      case 1:
        this.orderIcons[index] = this.dscOrderIcon;
        e.style.color = this.orderIconColorSelected;
        var indexToChange = this.orderBys.indexOf(this.tableHeaders[index]);
        this.orderByOrders[indexToChange] = -1;
        this.orders[index] = -1;
        this.resetData();
        this.updateCurrentQuery();
        await this.getDataSize();
        await this.loadData();
        break;
      case -1:
        this.orderIcons[index] = this.ascOrderIcon;
        e.style.color = this.orderIconColorDefault;
        var indexToRemove = this.orderBys.indexOf(this.tableHeaders[index]);
        delete this.orderBys[indexToRemove];
        delete this.orderByOrders[indexToRemove];
        this.orderBys = this.orderBys.filter(orderBy => orderBy != undefined);
        this.orderByOrders = this.orderByOrders.filter(order => order != undefined);
        this.orders[index] = 0;
        this.resetData();
        this.updateCurrentQuery();
        await this.getDataSize();
        await this.loadData();
        break;
    }
  }

  onMouseEnterOrderIcon(e: HTMLElement) {
    if (this.orders[Number.parseInt(e.id)] == 0) {
      e.style.color = this.orderIconColorHover;
    }
  }

  onMouseLeaveOrderIcon(e: HTMLElement) {
    if (this.orders[Number.parseInt(e.id)] == 0) {
      e.style.color = this.orderIconColorDefault;
    }
  }

  async onClickPrevButton() {
    this.resetData();
    this.skip = this.skip >= this.limit ? this.skip - this.limit : 0;
    this.updateCurrentQuery();
    await this.getDataSize();
    await this.loadData();
  }

  async onClickNextButton() {
    this.resetData();
    this.skip = this.skip >= this.dataSize ? 0 : this.skip + this.limit;
    this.updateCurrentQuery();
    await this.getDataSize();
    await this.loadData();
  }
}
