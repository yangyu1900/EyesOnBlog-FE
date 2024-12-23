import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor() {
  }

  async ngOnInit() {
  }

  skipToMainContent(event?: KeyboardEvent) {
    if(event && event.key !== 'Enter') return;
    let element = document.getElementById('main-menu') as HTMLElement;
    element.focus();
  }

}
