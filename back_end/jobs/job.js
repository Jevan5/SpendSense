module.exports = class Job {
    /**
     * Kicks off the job of updating over intervals of time.
     * Updates immediately.
     * @param {number} milliseconds Number of milliseconds to wait between
     * each update.
     * @returns {Promise} Never resolves, as additional jobs continue to chain.
     */
    static async startJob(milliseconds) {
        console.log(`Running '${this.getName()}'`);
        await this.job();
        console.log(`Finished '${this.getName()}'`);

        await new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, milliseconds);
        });

        console.log(`Waited ${milliseconds} ms`);

        return this.startJob(milliseconds);
    }

    /**
     * The job itself.
     */
    static job() {
        throw 'job() is not implemented.';
    }

    /**
     * Gets the name of the job.
     * @returns {string} Name of the job.
     */
    static getName() {
        throw 'getName() is not implemented.';
    }
}