export class Loadable {
    private message: string;
    private StateEnum = {
        LOADING: 0,
        ERRORED: 1,
        SUCCEEDED: 2,
        WARNED: 3
    };
    private state: number;

    constructor() {
        this.message = '';
        this.state = this.StateEnum.LOADING;
    }

    /**
     * Returns whether or not there is a loading message.
     * @returns True if there is a loading message, otherwise false.
     */
    public isLoading(): boolean {
        return this.hasMessage(this.StateEnum.LOADING);
    }

    /**
     * Returns whether or not there is an error message.
     * @returns True if there is an error message, otherwise false.
     */
    public hasErrored(): boolean {
        return this.hasMessage(this.StateEnum.ERRORED);
    }

    /**
     * Returns whether or not there is a succeeded message.
     * @returns True if there is a succeeded message, otherwise false.
     */
    public hasSucceeded(): boolean {
        return this.hasMessage(this.StateEnum.SUCCEEDED);
    }

    /**
     * Returns whether or not there is a warning message.
     * @returns True if there is a warning message, otherwise false.
     */
    public hasWarned(): boolean {
        return this.hasMessage(this.StateEnum.WARNED);
    }

    /**
     * Returns whether or not there is a message displayed for the state.
     * @param state State to check if it is active.
     * @returns True if there is a message displayed for the state, otherwise false.
     */
    private hasMessage(state: number): boolean {
        return this.state === state && this.message !== '';
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
     * @returns The message for the state. Empty if there is none.
     */
    private getMessage(state: number): string {
        return (this.state === state ? this.message : '');
    }

    /**
     * Sets the loading message.
     * @param message Loading message. Empty if clearing.
     * @returns The previous loading message.
     */
    public setLoadingMessage(message: string): string {
        return this.setMessage(message, this.StateEnum.LOADING);
    }

    /**
     * Sets the error message.
     * @param message Error message. Empty if clearing.
     * @returns The previous error message.
     */
    public setErrorMessage(message: string): string {
        return this.setMessage(message, this.StateEnum.ERRORED);
    }

    /**
     * Sets the success message.
     * @param message Success message. Empty if clearing.
     * @returns The previous success message.
     */
    public setSuccessMessage(message: string): string {
        return this.setMessage(message, this.StateEnum.SUCCEEDED);
    }

    /**
     * Sets the warning message.
     * @param message Warning message. Empty if clearing.
     * @returns The previous warning message.
     */
    public setWarningMessage(message: string): string {
        return this.setMessage(message, this.StateEnum.WARNED);
    }

    /**
     * Sets the appropriate state's message.
     * @param message Message. Empty if clearing.
     * @param state State to set the message of.
     * @returns The previous value of the state's message.
     */
    private setMessage(message: string, state: number): string {
        if (message == null) {
            message = '';
        }

        let oldMessage;

        if (state == this.state) {
            oldMessage = this.message;
        } else {
            oldMessage = '';
        }

        this.state = state;
        this.message = message;

        return oldMessage;
    }

    /**
     * Clears the active message, and returns its message.
     * @returns The active message.
     */
    public clearMessage(): string {
        return this.setMessage('', this.state);
    }
}