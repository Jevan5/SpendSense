export class MockToastController {
    public create(): { present: () => Promise<void> } {
        return {
            present: () => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            }
        }
    }
}