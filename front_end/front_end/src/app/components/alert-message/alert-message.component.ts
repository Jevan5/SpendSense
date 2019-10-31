import { Component, OnInit, Input } from '@angular/core';
import { Loadable } from '../../util/loadable/loadable';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
})
export class AlertMessageComponent implements OnInit {
  @Input() loadable: Loadable;

  constructor() { }

  ngOnInit() {}

}
