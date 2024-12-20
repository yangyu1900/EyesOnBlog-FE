import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appPages = [
    {
      title: 'Analytics', url: null, icon: '../assets/icon/analytics.svg', icon_close: '../assets/icon/chevron-forward.svg', icon_open: '../assets/icon/chevron-down.svg', showSubPages: false, subPages: [
        {
          title: 'Team', url: null, icon_close: '../assets/icon/chevron-forward.svg', icon_open: '../assets/icon/chevron-down.svg', showSubPages: false, subPages: [
            { title: 'Year', url: '/page/analytics/team/year', icon_close: null, icon_open: null, showSubPages: null, subPages: null },
            { title: 'Month', url: '/page/analytics/team/month', icon_close: null, icon_open: null, showSubPages: null, subPages: null },
          ]
        },
        {
          title: 'Me', url: null, icon_close: '../assets/icon/chevron-forward.svg', icon_open: '../assets/icon/chevron-down.svg', showSubPages: false, subPages: [
            { title: 'Year', url: '/page/analytics/me/year', icon_close: null, icon_open: null, showSubPages: null, subPages: null },
            { title: 'Month', url: '/page/analytics/me/month', icon_close: null, icon_open: null, showSubPages: null, subPages: null },
          ]
        },
      ]
    },
    { title: 'Stats', url: '/page/stats/', icon: '../assets/icon/stats.svg', icon_close: null, icon_open: null, showSubPages: null, subPages: null },
    { title: 'Review', url: '/page/review/', icon: '../assets/icon/reader.svg', icon_close: null, icon_open: null, showSubPages: null, subPages: null },
    {
      title: 'Wiki', url: null, icon: '../assets/icon/school.svg', icon_close: '../assets/icon/chevron-forward.svg', icon_open: '../assets/icon/chevron-down.svg', showSubPages: false, subPages: [
        { title: 'Join', url: '/page/wiki/join', icon_close: null, icon_open: null, showSubPages: null, subPages: null },
        { title: 'Post', url: '/page/wiki/post', icon_close: null, icon_open: null, showSubPages: null, subPages: null },
        { title: 'Review', url: '/page/wiki/review', icon_close: null, icon_open: null, showSubPages: null, subPages: null },
      ]
    },
  ];

  constructor() {
  }

  toggleSubPages(eventTarget: HTMLElement, page) {
    page.showSubPages = !page.showSubPages;
    eventTarget.focus();
  }
}
