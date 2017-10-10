import Logger from '../auth/Logger';

export default class AuthEvent {
    constructor(eventName) {
        this.eventName = eventName;
        this.callbacks = [];
    }

    addHandler(callbackFunction) {
        Logger.debug(`Adding event handler for event '${this.eventName}'`);
        this.callbacks.push(callbackFunction);
    }

    removeHandler(callbackFunction) {
        Logger.debug(`Attempting to remove event handler for event '${this.eventName}'`);
        const index = this.callbacks.findIndex(func => func === callbackFunction);
        if (index >= 0) {
            this.callbacks.splice(index, 1);
            Logger.debug(`Successfully removed event handler for event '${this.eventName}'`);
        } else {
            Logger.error(`Failed to remove event handler for event '${this.eventName}'`);
        }
    }

    raiseEvent(...params) {
        Logger.debug(`Raising event: ${this.eventName}`);
        for (let callbackFunction of this.callbacks) {
            callbackFunction(...params);
        }
    }
}