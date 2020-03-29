import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-search',
  templateUrl: './dropdown-search.component.html',
  styleUrls: ['./dropdown-search.component.scss']
})
export class DropdownSearchComponent implements OnInit {
  /**
   * Underlying value of the dropdown search component. Will be the item that is selected,
   * null if unselected, or the text that is orange.
   */
  public _value: any;
  /**
   * Items which fill the dropdown menu as options.
   */
  @Input() items: Array<any>;
  /**
   * How to display an item as a string.
   */
  @Input() displayFunction: (item: any) => string;
  /**
   * How to determine if an item matches against the text in the text box.
   */
  @Input() matchFunction: (text: string, item: any) => boolean;
  private settingValueToTextNotItem: boolean;
  /**
   * Two-way binded value for this dropdown search.
   */
  @Input() set value(value: any) {
    this._value = value;

    if (value != null) {
      if (this.settingValueToTextNotItem) {
        this.hasSelected = false;
        this.model = {
          searchText: value
        };

        setTimeout(() => {
          this.settingValueToTextNotItem = false;
        }, 50);
      } else {
        this.hasSelected = true;
        this.model = {
          searchText: this.displayFunction(value)
        };
      }

      this.selectedBuffer = false;
    } else {
      this.model = {
        searchText: ''
      };
      this.hasSelected = false;
    }

    this.valueChange.emit(this.value);
  }
  get value(): any {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<any>();
  /**
   * Emitted when an item is selected.
   */
  @Output() selectsItem = new EventEmitter<any>();
  /**
   * Emitted when an item is unselected.
   */
  @Output() unselectsItem = new EventEmitter<any>();
  /**
   * Emitted when the user clicks away without selecting.
   */
  @Output() losesFocus = new EventEmitter<any>();

  /**
   * Whether or not the text box has focus.
   */
  public focusingInput: boolean;
  /**
   * Whether or not an item has been selected last.
   */
  public hasSelected: boolean;
  /**
   * Buffer between selecting an item and changing the textbox text.
   */
  public selectedBuffer: boolean;
  /**
   * Text displayed in the textbox.
   */
  public model: {
    searchText: string
  };

  constructor() { }

  ngOnInit() {
    this.settingValueToTextNotItem = false;
    this.model = {
      searchText: ''
    };

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
      this.model.searchText = this.displayFunction(this.value);
    } else {
      this.hasSelected = false;
      this.selectedBuffer = false;
    }
  }

  /**
   * Called when an item is selected from the dropdown menu.
   * @param item Item selected.
   */
  public selectItem(item: any): void {
    this.model.searchText = this.displayFunction(item);
    this.hasSelected = true;
    this.selectedBuffer = false;
    this.value = item;

    this.selectsItem.emit(this.value);
  }

  /**
   * Called when the text data is changed.
   * @param ev Event.
   */
  public changeSearch(ev): void {
    if (this.hasSelected && !this.selectedBuffer) {
      // The text was changed automatically by selecting an item
      this.selectedBuffer = true;
      return;
    }

    if (this.hasSelected) {
      this.value = null;
      this.unselectsItem.emit();
    }

    this.hasSelected = false;
  }

  /**
   * Called when the text input loses focus.
   * @param ev Event.
   */
  public lostFocus(ev: any): void {
    // lostFocus() is called before selectItem(), which disables selectItem() 
    setTimeout(() => {
      this.focusingInput = false;

      if (!this.hasSelected) {
        this.settingValueToTextNotItem = true;
        this.value = this.model.searchText;
        this.losesFocus.emit(this.model.searchText);
      }
    }, 0);
  }

  /**
   * Called when the text input gains focus.
   * @param ev Event.
   */
  public gainedFocus(ev: any): void {
    this.focusingInput = true;
  }

  /**
   * Gets the colour for the text input based on the state of
   * this dropdown search.
   * @returns {string} Colour that the text in the text input should be.
   */
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
