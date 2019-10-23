import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private items: Array<string>;
  private itemToAdd: string;

  constructor(private router: Router) {

  }

  ngOnInit() {

  }
}
