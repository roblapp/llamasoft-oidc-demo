import LLamasoftOidcEvent from './LLamasoftOidcEvent';

export default class LLamasoftOidcEventManager {
    constructor() {
        this.onIdTokenValidatedEvent = new LLamasoftOidcEvent("ID_TOKEN_VALIDATED");
        this.onAccessTokenValidatedEvent = new LLamasoftOidcEvent("ACCESS_TOKEN_VALIDATED");

        this.onLoginSuccessEvent = new LLamasoftOidcEvent("LOGIN_SUCCESS");
        this.onLoginErrorEvent = new LLamasoftOidcEvent("LOGIN_ERROR");

        this.onSilentRenewSuccessEvent = new LLamasoftOidcEvent("SILENT_RENEW_SUCCESS");
        this.onSilentRenewErrorEvent = new LLamasoftOidcEvent("SILENT_RENEW_ERROR");

        this.onSilentRenewTriggeredEvent = new LLamasoftOidcEvent("SILENT_RENEW_TRIGGERED");
        
        this.onAccessTokenExpiredEvent = new LLamasoftOidcEvent("ACCESS_TOKEN_EXPIRED");
    }

    ///////////////////////////////////////////////////////////////
    /// Add/Remove Handlers
    ///////////////////////////////////////////////////////////////
    addOnIdTokenValidatedEventHandler(callbackFunction) {
        this.onIdTokenValidatedEvent.addHandler(callbackFunction);
    }

    removeOnIdTokenValidatedEventHandler(callbackFunction) {
        this.onIdTokenValidatedEvent.removeHandler(callbackFunction);
    }

    addOnAccessTokenValidatedEventHandler(callbackFunction) {
        this.onAccessTokenValidatedEvent.addHandler(callbackFunction);
    }

    removeOnAccessTokenValidatedEventHandler(callbackFunction) {
        this.onAccessTokenValidatedEvent.removeHandler(callbackFunction);
    }

    addOnLoginSuccessEventHandler(callbackFunction) {
        this.onLoginSuccessEvent.addHandler(callbackFunction);
    }

    removeOnLoginSuccessEventHandler(callbackFunction) {
        this.onLoginSuccessEvent.removeHandler(callbackFunction);
    }

    addOnLoginErrorEventHandler(callbackFunction) {
        this.onLoginErrorEvent.addHandler(callbackFunction);
    }

    removeOnLoginErrorEventHandler(callbackFunction) {
        this.onLoginErrorEvent.removeHandler(callbackFunction);
    }

    addOnSilentRenewSuccessEventHandler(callbackFunction) {
        this.onSilentRenewSuccessEvent.addHandler(callbackFunction);
    }

    removeOnSilentRenewSuccessEventHandler(callbackFunction) {
        this.onSilentRenewSuccessEvent.removeHandler(callbackFunction);
    }

    addOnSilentRenewErrorEventHandler(callbackFunction) {
        this.onSilentRenewErrorEvent.addHandler(callbackFunction);
    }

    removeOnSilentRenewErrorEventHandler(callbackFunction) {
        this.onSilentRenewErrorEvent.removeHandler(callbackFunction);
    }

    addOnSilentRenewTriggeredEventHandler(callbackFunction) {
        this.onSilentRenewTriggeredEvent.addHandler(callbackFunction);
    }

    removeOnSilentRenewTriggeredEventHandler(callbackFunction) {
        this.onSilentRenewTriggeredEvent.removeHandler(callbackFunction);
    }

    addOnAccessTokenExpiredEventHandler(callbackFunction) {
        this.onAccessTokenExpiredEvent.addHandler(callbackFunction);
    }

    removeOnAccessTokenExpiredEventHandler(callbackFunction) {
        this.onAccessTokenExpiredEvent.removeHandler(callbackFunction);
    }

    ///////////////////////////////////////////////////////////////
    /// Raise Events
    ///////////////////////////////////////////////////////////////
    raiseLoginSuccessEvent(returnPath) {
        this.onLoginSuccessEvent.raiseEvent(returnPath);
    }

    raiseLoginErrorEvent(error) {
        this.onLoginErrorEvent.raiseEvent(error);
    }

    raiseSilentRenewSuccessEvent() {
        this.onSilentRenewSuccessEvent.raiseEvent();
    }

    raiseSilentRenewErrorEvent(error) {
        this.onSilentRenewErrorEvent.raiseEvent(error);
    }

    raiseIdTokenValidatedEvent(idToken) {
        this.onIdTokenValidatedEvent.raiseEvent(idToken);
    }

    raiseAccessTokenValidatedEvent(accessToken) {
        this.onAccessTokenValidatedEvent.raiseEvent(accessToken);
    }

    raiseSilentRenewTriggeredEvent() {
        this.onSilentRenewTriggeredEvent.raiseEvent();
    }

    raiseAccessTokenExpiredEvent() {
        this.onAccessTokenExpiredEvent.raiseEvent();
    }
}