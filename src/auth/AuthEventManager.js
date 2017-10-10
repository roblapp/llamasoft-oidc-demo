import AuthEvent from './AuthEvent';

class AuthEventManager {
    constructor() {
        this.onTokenValidatedEvent = new AuthEvent("TOKEN_VALIDATED");

        this.onLoginSuccessEvent = new AuthEvent("LOGIN_SUCCESS");
        this.onLoginErrorEvent = new AuthEvent("LOGIN_ERROR");

        this.onLogoutErrorEvent = new AuthEvent("LOGOUT_ERROR");

        this.onSilentRenewSuccessEvent = new AuthEvent("SILENT_RENEW_SUCCESS");
        this.onSilentRenewErrorEvent = new AuthEvent("SILENT_RENEW_ERROR");

        this.onSilentRenewTriggeredEvent = new AuthEvent("SILENT_RENEW_TRIGGERED");

        this.onAccessTokenExpiredEvent = new AuthEvent("ACCESS_TOKEN_EXPIRED");
    }

    ///////////////////////////////////////////////////////////////
    /// Add/Remove Handlers
    ///////////////////////////////////////////////////////////////
    addOnTokenValidatedEventHandler(callbackFunction) {
        this.onTokenValidatedEvent.addHandler(callbackFunction);
    }

    removeOnTokenValidatedEventHandler(callbackFunction) {
        this.onTokenValidatedEvent.removeHandler(callbackFunction);
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

    addOnLogoutErrorEventHandler(callbackFunction) {
        this.onLogoutErrorEvent.addHandler(callbackFunction);
    }

    removeOnLogoutErrorEventHandler(callbackFunction) {
        this.onLogoutErrorEvent.removeHandler(callbackFunction);
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

    raiseLogoutErrorEvent(error) {
        this.onLogoutErrorEvent.raiseEvent(error);
    }

    raiseTokenValidatedEvent(tokenType, tokenValue) {
        this.onTokenValidatedEvent.raiseEvent(tokenType, tokenValue);
    }

    raiseSilentRenewTriggeredEvent() {
        this.onSilentRenewTriggeredEvent.raiseEvent();
    }

    raiseAccessTokenExpiredEvent() {
        this.onAccessTokenExpiredEvent.raiseEvent();
    }
}

export default AuthEventManager;