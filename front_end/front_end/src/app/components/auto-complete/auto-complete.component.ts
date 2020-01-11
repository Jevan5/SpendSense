import { Component, OnInit,} from '@angular/core';


@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent implements OnInit {
  public labelAttribute: string;

  public objects: any[];

  constructor() { }

  protected filter(keyword){
    keyword = keyword.toLowerCase();

    return this.objects.filter(
      (object) => {
        const value = object[this.labelAttribute].toLowerCase();

        return value.includes(keyword);
      }
    );
  }
  ngOnInit() {}

}
