import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss'],
})
export class ManualEntryComponent implements OnInit {
  items = [{}]

  constructor() { }

  ngOnInit() {}

  private newItem(): void{
    this.items.push({});
  }

  private submit(): void{

  }

  private delete(item): void{
    var i;
    for (i=0; i < this.items.length; i++)
    {
      if(this.items[i] == item){
        this.items.splice(i,1);
      }
    }
  }


}
