import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../service/account.service';
import { User } from '../../model/user';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  title: string;
  currentUser: User;

  constructor(private router: Router, private account: AccountService) {
  }

  async ngOnInit() {
    this.title = this.router.url.split('/').pop().toUpperCase();
    await this.account.initializeUser();
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  }

}
