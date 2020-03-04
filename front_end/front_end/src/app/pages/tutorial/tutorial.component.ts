import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {
  public page: number;

  constructor() {
    this.page = 0;
  }

  ngOnInit() {}

  public setPage(page: number): void {
    this.page = page;
  }
}
