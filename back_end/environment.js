let prod = {
    logPath: 'logs/logs.txt',
    port: 8080,
    ip: 'TODO',
    db: 'prod'
};

let dev = {
    logPath: 'logs/devLogs.txt',
    port: 8081,
    ip: '127.0.0.1',
    db: 'dev'
};

let test = {
    logPath: 'logs/testLogs.txt',
    port: 8082,
    ip: '127.0.0.1',
    db: 'test'
};

let mode;
switch (process.argv[2]) {
    case 'prod':
        mode = prod;
        break;
    case 'dev':
        mode = dev;
        break;
    case 'test':
        mode = test;
        break;
    default:
        // Not in prod or test mode
        console.log(process.argv[2] + ' is not "prod", "dev", or "test"');
        process.exit();
}

module.exports = {
    /**
     * Path to log to.
     */
    logPath: mode.logPath,
    /**
     * Port to serve off.
     */
    port: mode.port,
    /**
     * IP to serve off.
     */
    ip: mode.ip,
    /**
     * Name of the database.
     */
    db: mode.db
};