export class MockLoadingController {
    public create(): { present: () => Promise<void>, dismiss: () => Promise<void>, setAttribute: (field: string, value: any) => Promise<void> } {
        return {
            present: () => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            },
            dismiss: () => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            },
            setAttribute: (field: string, value: any) => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            }
        }
    }
}