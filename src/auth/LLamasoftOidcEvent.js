import Logger from './Logger';

export default class LLamasoftOidcEvent {
    constructor(eventName) {
        this.eventName = eventName;
        this.callbacks = [];
    }

    addHandler(callbackFunction) {
        this.callbacks.push(callbackFunction);
    }

    removeHandler(callbackFunction) {
        const index = this.callbacks.findIndex(func => func === callbackFunction);
        if (index >= 0) {
            this.callbacks.splice(index, 1);
        }
    }

    raiseEvent(...params) {
        Logger.debug(`Raising event: ${this.eventName}`);
        for (let callbackFunction of this.callbacks) {
            callbackFunction(...params);
        }
    }
}