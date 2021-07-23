class Environment {
    static modeEnum = {
        PROD: 'prod',
        DEV: 'dev',
        TEST: 'test'
    };

    static dbPrefix = 'spend-sense';

    constructor(l, p, u, m) {
        this.logPath = l;
        this.port = p;
        this.url = u;
        this.mode = m;
        this.db = `${Environment.dbPrefix}-${this.mode}`;
    }

    static instance = null;
}

let instance;
switch (process.argv[2]) {
    case Environment.modeEnum.PROD:
        instance = new Environment('logs/logs.txt', 8031, 'https://joshuaevans.ca', Environment.modeEnum.PROD);
        break;
    case Environment.modeEnum.DEV:
        instance = new Environment('logs/logs.txt', 8033, 'http://localhost', Environment.modeEnum.DEV);
        break;
    case Environment.modeEnum.TEST:
        instance = new Environment('logs/logs.txt', 8035, 'http://localhost', Environment.modeEnum.TEST);
        break;
    default:
        // Not in prod or test mode
        console.log(`${process.argv[2]} is not "${Environment.modeEnum.PROD}", "${Environment.modeEnum.DEV}", or "${Environment.modeEnum.TEST}"`);
        process.exit();
}

Environment.instance = instance;

module.exports = Environment;