
export default class LLamasoftOidcEventManager {
    constructor() {
        this.onIdTokenValidatedEvent = new LLamasoftOidcEvent("ID_TOKEN_VALIDATED");
        this.onAccessTokenValidatedEvent = new LLamasoftOidcEvent("ACCESS_TOKEN_VALIDATED");

        this.onLoginSuccessEvent = new LLamasoftOidcEvent("LOGIN_SUCCESS");
        this.onLoginErrorEvent = new LLamasoftOidcEvent("LOGIN_ERROR");

        this.onSilentRenewSuccessEvent = new LLamasoftOidcEvent("SILENT_RENEW_SUCCESS");
        this.onSilentRenewErrorEvent = new LLamasoftOidcEvent("SILENT_RENEW_ERROR");
        
    }

    addOnIdTokenValidatedEventHandler(callbackFunction) {
        this.onIdTokenValidatedEvent.addHandler(callbackFunction);
    }

    addOnAccessTokenValidatedEventHandler(callbackFunction) {
        this.onAccessTokenValidatedEvent.addHandler(callbackFunction);
    }

    addOnLoginSuccessEventHandler(callbackFunction) {
        this.onLoginSuccessEvent.addHandler(callbackFunction);
    }

    addOnLoginErrorEventHandler(callbackFunction) {
        this.onLoginErrorEvent.addHandler(callbackFunction);
    }

    addOnSilentRenewSuccessEventHandler(callbackFunction) {
        this.onSilentRenewSuccessEvent.addHandler(callbackFunction);
    }

    addOnSilentRenewErrorEventHandler(callbackFunction) {
        this.onSilentRenewErrorEvent.addHandler(callbackFunction);
    }

    raiseOnIdTokenValidatedEvent(data) {
        this.onIdTokenValidatedEvent.raiseEvent(data);
    }

    idTokenValidated(idToken) {
        this.onIdTokenValidatedEvent.raiseEvent(idToken);
    }

    accessTokenValidated(accessToken) {
        this.onAccessTokenValidatedEvent.raiseEvent(accessToken);
    }
}