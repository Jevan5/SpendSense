import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadableComponent } from 'src/app/components/loadable/loadable.component';
import { LoadingController, ToastController } from '@ionic/angular';
import { Receipt } from 'src/app/models/receipt/receipt';
import { ReceiptItem } from 'src/app/models/receiptItem/receiptItem';
import { SystemItem } from 'src/app/models/systemItem/systemItem';
import { ModelService } from 'src/app/services/model/model.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent extends LoadableComponent implements OnInit {
  @ViewChild("byTagCanvas", { static: false }) byTagCanvas: ElementRef;
  @ViewChild("overTimeCanvas", { static: false }) overTimeCanvas: ElementRef;

  public TabEnum: {
    BY_TAG: string,
    OVER_TIME: string
  };
  public model: {
    startDate: string,
    endDate: string
  };
  /**
   * Mappings from ids to their models.
   */
  public data: {
    receipts: Map<string, Receipt>,
    receiptItems: Map<string, ReceiptItem>,
    systemItems: Map<string, SystemItem>
  };
  public byTagChart: Chart;
  public overTimeChart: Chart;
  public maxRanges: number;

  constructor(public loadingController: LoadingController,
    public toastController: ToastController,
    public modelService: ModelService) {
    super(loadingController, toastController);
    this.TabEnum = {
      BY_TAG: 'By Tag',
      OVER_TIME: 'Over Time'
    };
    var now = new Date();
    var monthAgo = ReportsComponent.addDaysToDate(now, -31);
    this.model = {
      startDate: monthAgo.getFullYear() + '-' + (monthAgo.getMonth() + 1) + '-' + monthAgo.getDate(),
      endDate: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
    };
    this.data = {
      receipts: null,
      receiptItems: null,
      systemItems: null
    };
    
    this.maxRanges = 10;

    this.setLoadingMessage("Loading receipt data").then(() => {
      return this.loadData();
    }).then(() => {
      this.reloadChartsForTab(this.TabEnum.BY_TAG);
    }).catch((err) => {
      this.setErrorMessage(err);
    });
  }

  ngOnInit() {}

  /**
   * Loads receipt, receipt item, and system item data for
   * the user.
   * @returns Resolves when all the data has been loaded.
   */
  public loadData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.data = {
        receipts: null,
        receiptItems: null,
        systemItems: null
      };

      var systemItemIds = new Set();

      this.modelService.getAll(Receipt).then((receipts: Array<Receipt>) => {
        this.data.receipts = new Map<string, Receipt>();

        receipts.forEach((receipt) => {
          this.data.receipts.set(receipt.getValue('_id'), receipt);
        });

        return this.modelService.getAll(ReceiptItem);
      }).then((receiptItems: Array<ReceiptItem>) => {
        this.data.receiptItems = new Map<string, ReceiptItem>();

        receiptItems.forEach((receiptItem) => {
          this.data.receiptItems.set(receiptItem.getValue('_id'), receiptItem);
          systemItemIds.add(receiptItem.getValue('_systemItemId'));
        });

        return this.modelService.getAll(SystemItem);
      }).then((systemItems: Array<SystemItem>) => {
        this.data.systemItems = new Map<string, SystemItem>();

        systemItems.forEach((systemItem) => {
          if (systemItemIds.has(systemItem.getValue('_id'))) {
            this.data.systemItems.set(systemItem.getValue('_id'), systemItem);
          }
        });

        resolve();
      }).catch((err) => {
        this.data = {
          receipts: null,
          receiptItems: null,
          systemItems: null
        };

        reject(err);
      });
    });
  }

  /**
   * Generates a pie chart based on the spending between
   * this.model.startDate and this.model.endDate, showing
   * the amount spent on each tag.
   * @returns Pie chart detailing the spending by tag between
   * this.model.startDate and this.model.endDate.
   */
  public generateByTagChart(): Chart {
    var receiptItems = this.receiptItemsWithinRange(this.getStartDate(), this.getEndDate());

    if (receiptItems.length === 0) {
      this.setWarningMessage('No items were purchased in this time.');
      return null;
    }

    var tagSpendingTotals = new Map<string, number>();

    receiptItems.forEach((receiptItem) => {
      var tag = this.data.systemItems.get(receiptItem.getValue('_systemItemId')).getValue('tag');

      if (!tagSpendingTotals.has(tag)) {
        tagSpendingTotals.set(tag, 0);
      }

      tagSpendingTotals.set(tag, tagSpendingTotals.get(tag) + receiptItem.getValue('price') * receiptItem.getValue('quantity'));
    });

    var tagArray = [];
    var tagTotals = [];
    var colours = [];
    
    tagSpendingTotals.forEach((total, tag) => {
      tagArray.push(tag);
      tagTotals.push(total);
      colours.push(ReportsComponent.randomColourString());
    });

    return new Chart(this.byTagCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: tagArray,
        datasets: [{
          data: tagTotals,
          backgroundColor: colours
        }]
      }
    });
  }

  /**
   * Generates a line chart that shows the spending between
   * this.model.startDate and this.model.endDAte, showing
   * the amount spent on each tag by different points in
   * the time range.
   * @returns Line chart detailing the spending by tag between
   * this.model.startDate and this.model.endDate.
   */
  public generateOverTimeChart(): Chart {
    var daysBetween = ReportsComponent.daysBetweenDates(this.getStartDate(), this.getEndDate());
    var dates: Array<Date> = [];

    if (daysBetween < this.maxRanges) {  // Each range is 1 day
      for (var i = 0; i <= daysBetween; i++) {
        dates.push(ReportsComponent.addDaysToDate(this.getStartDate(), i));
      }
    } else {  // Each range is 1 or more days
      var averageRange = daysBetween / this.maxRanges;
      var daysPassed = 0;

      for (var i = 0; i < this.maxRanges; i++) {
        var start = this.getStartDate();
        var nextDate = ReportsComponent.addDaysToDate(start, Math.ceil(daysPassed));
        dates.push(nextDate);
        // dates.push(ReportsComponent.addDaysToDate(this.getStartDate(), Math.ceil(daysPassed)));
        daysPassed += averageRange;
      }

      dates.push(this.getEndDate());
    }

    // Dates
    var labels: Array<string> = [];
    dates.forEach((date, index) => {
      if (index === dates.length - 1) {
        return;
      }

      labels.push(date.toDateString());
    });

    // Tags which appear in 
    var tags = new Set<string>();
  
    // Mapping from tag to total spending so far
    var tagSpendingTotals = new Map<string, number>();

    // Mapping from tag to total spending for each date range
    var dataMap = new Map<string, Array<number>>();

    var receiptItems = this.receiptItemsWithinRange(this.getStartDate(), this.getEndDate());

    if (receiptItems.length === 0) {
      this.setWarningMessage('No items were purchased in this time.');
      return null;
    }

    receiptItems.forEach((receiptItem) => {
      var systemItem = this.data.systemItems.get(receiptItem.getValue('_systemItemId'));
      var tag = systemItem.getValue('tag');

      tags.add(tag);
    });

    tags.forEach((tag) => {
      tagSpendingTotals.set(tag, 0);
      dataMap.set(tag, []);
    });

    for (var i = 0; i < dates.length - 1; i++) {  // Iterate over every pair of dates
      var startDate = dates[i];
      var endDate = dates[i + 1];

      var boundedReceiptItems = this.receiptItemsWithinRange(startDate, endDate);

      boundedReceiptItems.forEach((receiptItem) => {  // Update the total spent on each tag up until endDate
        var receipt = this.data.receipts.get(receiptItem.getValue('_receiptId'));
        var receiptDate = new Date(receipt.getValue('date'));

        if (receiptDate < startDate || receiptDate >= endDate) {  // Receipt does not fall between the current range
          return;
        }

        var systemItem = this.data.systemItems.get(receiptItem.getValue('_systemItemId'));
        var tag = systemItem.getValue('tag');

        var price = receiptItem.getValue('price');
        var quantity = receiptItem.getValue('quantity');
        var cost = price * quantity;

        tagSpendingTotals.set(tag, tagSpendingTotals.get(tag) + cost);
      });

      // Add the total spent on each tag up until endDate to the dataset
      tagSpendingTotals.forEach((total, tag) => {
        dataMap.get(tag).push(total);
      });
    }

    var datasets: Array<{ data: Array<number>, label: string, borderColor: string }> = [];

    dataMap.forEach((data, tag) => {
      datasets.push({ data: data, label: tag, borderColor: ReportsComponent.randomColourString() });
    });

    return new Chart(this.overTimeCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        elements: {
          line: {
            tension: 0
          }
        }
      }
    });
  }

  /**
   * Determines which receipt items are between the given dates.
   * @param startDate Date to start from. Inclusive.
   * @param endDate Date to end at. Non-inclusive.
   * @returns The receipt items which are between the given dates.
   */
  public receiptItemsWithinRange(startDate: Date, endDate: Date): Array<ReceiptItem> {
    if (endDate < startDate) {
      throw new Error("End Date can't be earlier than Start Date.");
    }

    var receiptItems = [];

    this.data.receiptItems.forEach((receiptItem) => {
      var receiptDate = new Date(this.data.receipts.get(receiptItem.getValue('_receiptId')).getValue('date'));

      if (receiptDate < startDate || receiptDate >= endDate) {
        return;
      }

      receiptItems.push(receiptItem);
    });

    return receiptItems;
  }

  /**
   * Generates a random colour by creating a
   * hex-string with 6 digits, preceeded by a '#'.
   * @returns A random hex representation of a colour.
   */
  public static randomColourString(): string {
    var hexLength = 6;
    return '#' + Math.floor(Math.random() * Math.pow(16, hexLength)).toString(16);
  }

  /**
   * Calculates the number of full days between two dates.
   * @param startDate Earlier date.
   * @param endDate Later date.
   * @returns The integer number of full days between two dates.
   */
  public static daysBetweenDates(startDate: Date, endDate: Date): number {
    if (endDate < startDate) {
      throw new Error("End Date can't be earlier than Start Date.");
    }

    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Adds a number of days to a date.
   * @param date Date to add days to.
   * @param numDays Number of days to add.
   * @returns Date with the numbers of days added to it.
   */
  public static addDaysToDate(date: Date, numDays: number): Date {
    return new Date(new Date(date).setDate(new Date(date).getDate() + numDays));
  }

  /**
   * Converts the input from the page for the start date
   * from a string to a Date.
   * @returns The start date.
   */
  public getStartDate(): Date {
    return new Date(this.model.startDate);
  }

  /**
   * Converts the input from the page for the end date
   * from a string to a Date.
   * @returns The end date.
   */
  public getEndDate(): Date {
    return new Date(this.model.endDate);
  }

  /**
   * Reloads the charts for a tab.
   * @param tab Tab to reload charts for.
   * @returns Resolves when the charts in the tab have been reloaded.
   */
  public reloadChartsForTab(tab: string): Promise<void> {
    return new Promise((resolve, reject) => {
      switch (tab) {
        case this.TabEnum.BY_TAG:
          this.setLoadingMessage('Analyzing data by tag').then(() => {
            this.byTagChart = this.generateByTagChart();
            return this.clearMessage();
          }).then(() => {
            resolve();
          }).catch((err) => {
            if (this.byTagChart != null) {
              this.byTagChart.destroy();
            };
            reject(err);
            this.setErrorMessage(err);
          });
          break;
        case this.TabEnum.OVER_TIME:
          this.setLoadingMessage('Analyzing data over time').then(() => {
            this.overTimeChart = this.generateOverTimeChart();
            return this.clearMessage();
          }).then(() => {
            resolve();
          }).catch((err) => {
            if (this.overTimeChart != null) {
              this.overTimeChart.destroy();
            }
            reject(err);
            this.setErrorMessage(err);
          });
          break;
      }
    });
  }
}