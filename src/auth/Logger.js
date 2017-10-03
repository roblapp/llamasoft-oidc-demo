
const NONE = 0;
const ERROR = 1;
const WARN = 2;
const INFO = 3;
const DEBUG = 4;

let level;

export default class Logger {
    static get NONE() {return NONE};
    static get ERROR() {return ERROR};
    static get WARN() {return WARN};
    static get INFO() {return INFO};
    static get DEBUG() {return DEBUG};

    static get level(){
        return level;
    }

    static set level(value){
        if (NONE <= value && value <= DEBUG){
            level = value;
        }
        else {
            throw new Error("Invalid log level");
        }
    }

    static debug(content) {
        if (level >= DEBUG) {
            console.debug(content);
        }
    }

    static warn(content) {
        if (level >= WARN) {
            console.warn(content);
        }
    }

    static error(content) {
        if (level >= ERROR) {
            console.error(content);
        }
    }

    static info(content) {
        if (level >= INFO) {
            console.info(content);
        }
    }
}