import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

class ValueAccessorBase<T> implements ControlValueAccessor {
  private innerValue: T;

  private changed = new Array<(value: T) => void>();
  private touched = new Array<() => void>();

  get value(): T {
    return this.innerValue;
  }

  set value(value: T) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.changed.forEach(f => f(value));
    }
  }

  touch() {
    this.touched.forEach(f => f());
  }

  writeValue(value: T) {
    this.innerValue = value;
  }

  registerOnChange(fn: (value: T) => void) {
    this.changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }
}

@Component({
  selector: 'app-dropdown-search',
  templateUrl: './dropdown-search.component.html',
  styleUrls: ['./dropdown-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownSearchComponent),
      multi: true
    }
  ]
})
export class DropdownSearchComponent extends ValueAccessorBase<any> implements OnInit {
  @Input() startingItem: any;
  @Input() items: Array<any>;
  @Input() displayFunction: (item: any) => any;
  @Input() matchFunction: (text: string, item: any) => boolean;
  @Output() selectsItem = new EventEmitter<any>();
  @Output() unselectsItem = new EventEmitter<any>();
  @Output() losesFocus = new EventEmitter<any>();

  protected model: NgModel;

  public focusingInput: boolean;
  public hasSelected: boolean;
  public selectedBuffer: boolean;
  public selectedItem: any;
  public uiModel: {
    searchText: string
  };

  constructor() {
    super();
  }

  ngOnInit() {
    this.uiModel = {
      searchText: ''
    };

    this.value = this.startingItem;

    this.focusingInput = false;

    if (this.displayFunction == null) {
      this.displayFunction = (item: any) => { return item; };
    }

    if (this.matchFunction == null) {
      this.matchFunction = (text: string, item: any) => {
        return this.displayFunction(item).toString().toLowerCase().indexOf(text.toLowerCase()) >= 0;
      };
    }

    if (this.value != null) {
      this.hasSelected = true;
      this.selectedBuffer = false;
      this.selectedItem = this.value;
      this.uiModel.searchText = this.displayFunction(this.selectedItem);
    } else {
      this.hasSelected = false;
      this.selectedItem = null;
      this.selectedBuffer = false;
    }
  }

  public selectItem(item: any): void {
    this.selectedItem = item;
    this.uiModel.searchText = this.displayFunction(item);
    this.hasSelected = true;
    this.selectedBuffer = false;
  }

  public changeSearch(ev): void {
    if (this.hasSelected && !this.selectedBuffer) {
      // The text was changed automatically by selecting an item
      this.value = this.selectedItem;
      this.selectedBuffer = true;
      this.selectsItem.emit(this.selectedItem);
      return;
    }

    if (this.hasSelected) {
      this.value = null;
      this.unselectsItem.emit();
    }

    this.hasSelected = false;
    this.selectedItem = null;
  }

  public lostFocus(ev: any): void {
    // lostFocus() is called before selectItem(), which disables selectItem() 
    setTimeout(() => {
      this.focusingInput = false;

      if (!this.hasSelected) {
        this.value = this.uiModel.searchText;
        this.losesFocus.emit(this.uiModel.searchText);
      }
    }, 0);
  }

  public gainedFocus(ev: any): void {
    this.focusingInput = true;
  }

  public getColour(): string {
    if (this.hasSelected) {
      return 'success';
    } else if (!this.focusingInput) {
      return 'warning';
    } else {
      return '';
    }
  }
}
