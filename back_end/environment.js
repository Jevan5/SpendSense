let prod = {
    logPath: 'logs/logs.txt',
    port: 8080
};

let test = {
    logPath: 'logs/logsTest.txt',
    port: 8081
};

let mode;
switch (process.argv[2]) {
    case 'prod':
        mode = prod;
        break;
    case 'test':
        mode = test;
        break;
    default:
        // Not in prod or test mode
        console.log(process.argv[2] + ' is not "prod" or "test"');
        process.exit();
}

module.exports = {
    logPath: mode.logPath,
    port: mode.port
};