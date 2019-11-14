import { Component, OnInit, Directive } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-loadable',
  templateUrl: './loadable.component.html',
  styleUrls: ['./loadable.component.scss'],
})
export class LoadableComponent implements OnInit {
  private message: string;
  private StateEnum = {
    NONE: 0,
    LOADING: 1,
    ERRORED: 2,
    SUCCEEDED: 3,
    WARNED: 4
  };
  private state: number;
  private loader: HTMLIonLoadingElement;
  private toast: HTMLIonToastElement;

  constructor(public loadingController: LoadingController, public toastController: ToastController) {
    this.message = '';
    this.state = this.StateEnum.NONE;
    this.loader = null;
    this.toast = null;
  }

  ngOnInit() {}

  /**
   * Returns whether or not there is a loading message.
   * @returns True if there is a loading message, otherwise false.
   */
  public isLoading(): boolean {
    return this.isState(this.StateEnum.LOADING);
  }

  /**
   * Returns whether or not there is an error message.
   * @returns True if there is an error message, otherwise false.
   */
  public hasErrored(): boolean {
    return this.isState(this.StateEnum.ERRORED);
  }

  /**
   * Returns whether or not there is a succeeded message.
   * @returns True if there is a succeeded message, otherwise false.
   */
  public hasSucceeded(): boolean {
    return this.isState(this.StateEnum.SUCCEEDED);
  }

  /**
   * Returns whether or not there is a warning message.
   * @returns True if there is a warning message, otherwise false.
   */
  public hasWarned(): boolean {
    return this.isState(this.StateEnum.WARNED);
  }

  /**
   * Returns whether or not there is a message displayed for the state.
   * @param state State to check if it is active.
   * @returns True if the state is active. Otherwise,false.
   */
  private isState(state: number): boolean {
    return this.state === state;
  }

  /**
   * Gets the loading message.
   * @returns The loading message. Empty if there is none.
   */
  public getLoadingMessage(): string {
    return this.getMessage(this.StateEnum.LOADING);
  }

  /**
   * Gets the error message.
   * @returns The error message. Empty if there is none.
   */
  public getErrorMessage(): string {
    return this.getMessage(this.StateEnum.ERRORED);
  }

  /**
   * Gets the success message.
   * @returns The success message. Empty if there is none.
   */
  public getSuccessMessage(): string {
    return this.getMessage(this.StateEnum.SUCCEEDED);
  }

  /**
   * Gets the warning message.
   * @returns The warning message. Empty if there is none.
   */
  public getWarningMessage(): string {
    return this.getMessage(this.StateEnum.WARNED);
  }

  /**
   * Gets the appropriate state's message.
   * @param state State to get then message of.
   * @returns The message for the state. Null if there is none.
   */
  private getMessage(state: number): string {
    return (this.state === state ? this.message : null);
  }

  /**
   * Sets the loading message. Ensures the loading spinner is presented
   * before setting the loading message.
   * @param message Loading message.
   * @returns Resolves when the loading message has been changed.
   */
  public setLoadingMessage(message: string): Promise<void> {
    return this.setMessage(message, this.StateEnum.LOADING);
  }

  /**
   * Sets the error message. Ensures the loading spinner is dismissed
   * before setting the error message. Also logs the message to console.
   * @param message Error message.
   * @returns Resolves when the error message has been changed.
   */
  public setErrorMessage(message: string): Promise<void> {
    return this.setMessage(message, this.StateEnum.ERRORED);
  }

  /**
   * Sets the success message. Ensures the loading spinner is dismissed
   * before presenting the toast, then presents the toast, then sets
   * the success message.
   * @param message Success message.
   * @returns Resolves when the success message has been changed.
   */
  public setSuccessMessage(message: string): Promise<void> {
    return this.setMessage(message, this.StateEnum.SUCCEEDED);
  }

  /**
   * Sets the warning message. Ensures the loading spinner is dismissed
   * before setting the warning message.
   * @param message Warning message.
   * @returns Resolves when the warning message has been changed.
   */
  public setWarningMessage(message: string): Promise<void> {
    return this.setMessage(message, this.StateEnum.WARNED);
  }

  /**
   * Sets the appropriate state's message. If error, logs
   * the error to console.
   * @param message Message.
   * @param state State to set the message of.
   * @returns The previous value of the state's message.
   */
  private async setMessage(message: string, state: number): Promise<void> {
    this.state = state;
    this.message = message;

    if (state == this.StateEnum.LOADING) {
      if (this.loader != null) {
        await this.loader.setAttribute('message', message);
      } else {
        this.loader = await this.loadingController.create({
          message: message
        });
  
        await this.loader.present();
      }
    } else {
      if (this.loader != null) {
        await this.loader.dismiss();
        this.loader = null;
      }

      if ([this.StateEnum.SUCCEEDED, this.StateEnum.WARNED, this.StateEnum.ERRORED].indexOf(state) >= 0) {
        var color;
        var duration = 3000;

        switch(state) {
          case this.StateEnum.SUCCEEDED:
            color = 'success';
            break;
          case this.StateEnum.WARNED:
            color = 'warning';
            break;
          case this.StateEnum.ERRORED:
            color = 'danger';
            duration = 6000;
            console.log(message);
            break;
        }

        this.toast = await this.toastController.create({
          message: message,
          duration: duration,
          color: color,
          showCloseButton: true
        });

        await this.toast.present();
      }
    }
  }

  /**
   * Clears the active message.
   * @returns Resolves when the message has been cleared.
   */
  public clearMessage(): Promise<void> {
    return this.setMessage('', this.StateEnum.NONE);
  }
}