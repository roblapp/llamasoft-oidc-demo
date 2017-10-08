import JwtUtility from './JwtUtility';
import UrlUtility from './UrlUtility';
import WebStorage from './WebStorage';
import Logger from './Logger';
import IFrameWindow from './IFrameWindow';
import AuthOptionsValidator from './AuthOptionsValidator';
import ResponseValidator from './ResponseValidator';
import RequestCreator from './RequestCreator';
import LLamasoftOidcEventManager from './LLamasoftOidcEventManager';

export default class LLamasoftOidcClient {

    constructor(
        authOptions,
        webStorage
    ) {
        this.authOptions = authOptions;
        this.authOptionsValidator = new AuthOptionsValidator();

        /// Validate the authOptions before going any further
        this.authOptionsValidator.validate(this.authOptions);

        this.webStorage = webStorage ? webStorage : new WebStorage();
        this.requestCreator = new RequestCreator();
        this.responseValidator = new ResponseValidator(this.authOptions);
        this.handleAuthorizeCallback = this.handleAuthorizeCallback.bind(this);

        this.eventManager = new LLamasoftOidcEventManager();

        //Check accessToken for expiration
        const silentRenewUrl = this.authOptions.silentRenewCallbackUri;
        
        //If this logic wasn't here you'd lose the SilentRenew timers if you refreshed the page
        const silentRenewFromSessionStorage = window.sessionStorage.getItem("silentRenew");
        //Don't re-schedule the SilentRenew process when this class is instantiated during the SilentRenewCallback
        if (silentRenewFromSessionStorage && silentRenewFromSessionStorage === "true" && !this.silentRenewInterval && !window.location.includes(silentRenewUrl)) {
            this.debug("Rescheduling the SilentRenew process based on window.sessionStorage");
            alert("Re-scheduling SilentRenew");
            this.scheduleSilentRenewalProcess();
        }
    }

    ///
    ///
    ///
    /// Implicit Flow Functions
    ///
    ///
    ///
    redirectToLogin(returnPath) {
        this.debug("Begin redirectToLogin");

        //Cleanup old stuff
        this.debug("Cleaning up old state, nonce, returnPath, accessToken, idToken values");
        window.localStorage.removeItem("state");
        window.localStorage.removeItem("nonce");
        window.localStorage.removeItem("returnPath");
        this.webStorage.remove("accessToken");
        this.webStorage.remove("idToken");
        window.sessionStorage.removeItem("silentRenew");

        const state = this.rand();
        const nonce = this.rand();

        this.debug("Setting state to " + state);
        this.debug("Setting nonce to " + nonce);

        //These values should always be temporarily stored in localStorage
        window.localStorage["state"] = state;
        window.localStorage["nonce"] = nonce;
        if (returnPath) {
            window.localStorage["returnPath"] = returnPath;
        }

        const authorizeEndpoint = this.authOptions.authorizeEndpoint;
        const clientId = this.authOptions.clientId;
        const redirectUri = this.authOptions.redirectUri; //Can only redirect to a path in same origin
        const responseType = this.authOptions.responseType;
        const scopes = this.authOptions.scopes;
        const authorizeUrl = this.createLoginRequestUrl(authorizeEndpoint, clientId, redirectUri, responseType, scopes, state, nonce);

        this.debug(`Created authorize URL ${authorizeUrl}`);
        this.debug("Completed redirectToLogin process. Now redirecting to authorizeUrl");
        window.location = authorizeUrl;
    }

    createLoginRequestUrl(authorizeEndpoint, clientId, redirectUri, responseType, scopes, state, nonce) {
        return this.requestCreator.createLoginRequestUrl(authorizeEndpoint, clientId, redirectUri, responseType, scopes, state, nonce);
    }

    handleAuthorizeCallback() {
        try {
            this.debug("Starting handleAuthorizeCallback");
            this.debug(JSON.stringify(this.authOptions));

            const hash = window.location.hash.substr(1);

            if (!hash) {
                throw new Error("Cannot validate url hash. The hash was missing.");
            }

            const responseObject = UrlUtility.urlHashToJSONObject(hash);
            this.debug("Parsed response from OIDC provider:");
            this.debug(JSON.stringify(responseObject));

            this.responseValidator.validateImplicitFlowResponse(responseObject);

            this.webStorage.store("idToken", responseObject.id_token);
            this.webStorage.store("accessToken", responseObject.access_token);
            
            //Give the user a hook without having to come up with a custom implementation of WebStorage
            this.eventManager.raiseIdTokenValidatedEvent(responseObject.id_token);
            this.eventManager.raiseAccessTokenValidatedEvent(responseObject.access_token);

            //Might be undefined... that's OK, the consumer has to handle that case
            const returnPath = window.localStorage["returnPath"];

            //Do cleanup
            window.localStorage.removeItem("state");
            window.localStorage.removeItem("nonce");
            window.localStorage.removeItem("returnPath");

            if (this.authOptions.useAutomaticSilentTokenRenew) {
                this.debug("using SilentRenew feature for renewing accessToken");
                this.scheduleSilentRenewalProcess();
            } else {
                this.warn("Not using SilentRenew feature. accessTokens will expire");
                const offset = this.authOptions.postAccessTokenExpiredEventOffset && Number.isInteger(this.authOptions.postAccessTokenExpiredEventOffset) ? this.authOptions.postAccessTokenExpiredEventOffset : 0;
                const whenToRaiseAccessTokenExpiredEvent = 1000*(parseInt(responseObject.expires_in, 10) + offset);
                this.debug(`Setting ACCESS_TOKEN_EXPIRED_EVENT time to ${whenToRaiseAccessTokenExpiredEvent} milliseconds from now`);
                window.setTimeout(() => {
                    this.eventManager.raiseAccessTokenExpiredEvent();
                }, whenToRaiseAccessTokenExpiredEvent);
            }

            this.debug("Completed handleAuthorizeCallback");
            this.debug("Invoking onSuccess callback");

            this.eventManager.raiseLoginSuccessEvent(returnPath);
        } catch (error) {
            this.error("Authentication callback process failed. Calling user callback 'loginFailureCallback'");
            this.eventManager.raiseLoginErrorEvent(error);
        }
    }

    handleSilentRenewCallback() {
        const url = window.location.href;
        const messageData = {
            url
        };

        IFrameWindow.notifyParent(messageData);
    }

    completeSilentRenewProcess(url) {
        //TODO combine this code with completeLoginProcess since it's nearly duplicated
        try {
            this.debug("Starting completeSilentRenewProcess");
            const responseObject = UrlUtility.urlHashToJSONObject(url);
            this.debug("Parsed response from OIDC provider:");
            this.debug(JSON.stringify(responseObject));
                
            this.responseValidator.validateImplicitFlowResponse(responseObject);

            //Remove existing tokens
            this.webStorage.remove("accessToken");
            this.webStorage.remove("idToken");

            this.webStorage.store("idToken", responseObject.id_token);
            this.webStorage.store("accessToken", responseObject.access_token);
            
            //Give the user a hook without having to come up with a custom implementation of WebStorage
            this.eventManager.raiseIdTokenValidatedEvent(responseObject.id_token);
            this.eventManager.raiseAccessTokenValidatedEvent(responseObject.access_token);

            //Do cleanup
            window.localStorage.removeItem("state");
            window.localStorage.removeItem("nonce");

            this.debug("using SilentRenew feature for renewing accessToken");
            this.scheduleSilentRenewalProcess();

            this.eventManager.raiseSilentRenewSuccessEvent();
        } catch(error) {
            //Handle error
            this.error("Authentication callback process failed. Calling user callback 'errorCallback'");
            this.error(error);
            this.eventManager.raiseSilentRenewErrorEvent(error);
        }
    }

    scheduleSilentRenewalProcess() {
        this.debug("scheduling SilentRenew process");

        //Remove the existing interval and create a new one
        if (this.silentRenewInterval) {
            this.debug(`Clearing existing SilentRenew interval with identifier ${this.silentRenewInterval}`);
            window.clearInterval(this.silentRenewInterval);
        }

        this.debug(`Setting SilentRenew interval for every ${this.authOptions.silentRenewIntervalInSeconds} seconds`);

        const expireTime = this.getAccessTokenExpiration();

        //Do this with setInterval - not setTimeout
        this.silentRenewInterval = window.setInterval(() => {
            this.debug("Starting SilentRenew interval");
            const now = parseInt(Date.now() / 1000, 10); //get current time since UNIX epoch in seconds (not milliseconds which is why we divide by 1000)
            //If we are before or at the expireTime
            if (now <= expireTime) {
                const diff = expireTime - now;
                if (diff <= this.authOptions.silentRenewTokenRequestOffsetSeconds) {
                    this.debug(`The accessToken is soon to be expried. There are ${diff} second(s) before it expires`);
                    this.debug("Triggering the SilentRenew process");
                    this.triggerSilentRenewProcess();
                } else {
                    this.debug(`The accessToken is not yet expried. There are still ${diff} seconds before it expires`);
                }
            } else {
                //The time is after the expireTime - the token is expired
                this.warn("SilentRenew - accessToken expired before it could be renewed");
            }

            this.debug("Finished SilentRenew interval");
        }, this.authOptions.silentRenewIntervalInSeconds*1000);

        window.sessionStorage.setItem("silentRenew", "true");

        this.debug(`SilentRenewInterval created with identifier '${this.silentRenewInterval}'`);
        this.debug("Done scheduling SilentRenew process");
    }

    triggerSilentRenewProcess() {
        this.debug("Starting silent renewal process");

        this.eventManager.raiseSilentRenewTriggeredEvent();

        //Cleanup old stuff
        this.debug("Cleaning up old state, nonce, returnPath, accessToken, idToken values");
        window.localStorage.removeItem("state");
        window.localStorage.removeItem("nonce");

        const state = this.rand();
        const nonce = this.rand();

        this.debug("Setting state to " + state);
        this.debug("Setting nonce to " + nonce);

        //Do not let user override localStorage here
        window.localStorage["state"] = state;
        window.localStorage["nonce"] = nonce;

        const authorizeEndpoint = this.authOptions.authorizeEndpoint;
        const clientId = this.authOptions.clientId;
        const redirectUri = this.authOptions.silentRenewCallbackUri;
        const responseType = this.authOptions.responseType;
        const scopes = this.authOptions.scopes;
        const authorizeUrl = this.createLoginRequestUrl(authorizeEndpoint, clientId, redirectUri, responseType, scopes, state, nonce);

        this.debug(`Created authorize URL ${authorizeUrl}`);

        const hiddenIFrame = new IFrameWindow(this);
        const timeout = this.authOptions.silentRenewIFrameTimeoutSeconds*1000;

        this.debug(`Create url for silent renew '${authorizeUrl}'`);
        this.debug(`Setting timeout to ${timeout} milliseconds`);

        hiddenIFrame.navigate({ authorizeUrl, timeout });
    }

    redirectToLogout(returnPath) {
        this.debug("Starting logout process");
        const idToken = this.getIdToken();

        this.debug("idToken = " + idToken);

        this.webStorage.remove("accessToken");
        this.webStorage.remove("idToken");
        window.sessionStorage.removeItem("silentRenew");

        let returnUrl = window.location.origin;

        //Don't include trailing '/'
        if (returnPath && returnPath.startsWith("/") && !returnPath.endsWith("/")) {
            returnUrl += returnPath;
        }

        const url = this.createLogoutRequestUrl(this.authOptions.endSessionEndpoint, returnUrl, idToken);
        this.debug(`Constructed logout URL '${url}'`);

        if (this.silentRenewInterval) {
            this.debug(`Clearing silentRenewInterval with identifier ${this.silentRenewInterval}`);
            window.clearInterval(this.silentRenewInterval);
        } else {
            this.debug("No existing silentRenewInterval to be cleared");
        }
        
        this.debug(`Completed logout process. Now navigating to logout URL '${url}'`);

        window.location = url;
    }

    createLogoutRequestUrl(endSessionEndpoint, postLogoutRedirectUri, idToken) {
        return this.requestCreator.createLogoutRequestUrl(endSessionEndpoint, postLogoutRedirectUri, idToken);
    }

    ///
    ///
    ///
    /// HELPER FUNCTIONS
    ///
    ///
    ///
    ///
    isAuthenticated() {
        return !this.isAccessTokenExpired();
    }

    isAccessTokenExpired() {
        //Go off of the accessToken's expiration, not the idToken
        const accessToken = this.getAccessTokenContent();

        if (!accessToken || accessToken === null) {
            return true;
        }

        const now = parseInt(Date.now() / 1000, 10);

        if (accessToken.exp < now) {
            this.debug("The accessToken has expired");
            return true;
        }

        return false;
    }

    getEventManager() {
        return this.eventManager;
    }

    getAuthOptions() {
        return this.authOptions;
    }

    getWebStorage() {
        return this.webStorage;
    }

    getAccessToken() {
        return this.webStorage.get("accessToken");
    }

    getIdToken() {
        return this.webStorage.get("idToken");
    }

    getIdTokenContent() {
        //Decode JWT
        const idToken = this.getIdToken();
        if (!idToken || idToken === null) {
            return undefined;
        }

        var jwtContent = JwtUtility.jwtToJSONObject(idToken);

        return jwtContent;
    }

    getAccessTokenContent() {
        //Decode JWT
        const accessToken = this.getAccessToken();
        if (!accessToken || accessToken === null) {
            return undefined;
        }

        var jwtContent = JwtUtility.jwtToJSONObject(accessToken);

        return jwtContent;
    }

    getAccessTokenExpiration() {
        const accessToken = this.getAccessTokenContent();
        if (!accessToken) {
            throw new Error("Cannot verify accessToken expiration => Could not find the accessToken in the current web storage mechanism");
        }

        if (!accessToken.exp) {
            throw new Error("Cannot verify accessToken expiration => Could not find the accessToken.exp claim");
        }

        return accessToken.exp;
    }

    removeAccessToken() {
        this.webStorage.remove("accessToken");
    }

    removeIdToken() {
        this.webStorage.remove("idToken");
    }

    userHasApiClaim(claimType) {
        if (!claimType || claimType === '') {
            throw new Error(`Cannot verify api claim ${claimType}`);
        }

        const accessToken = this.getAccessTokenContent();
        if (!accessToken) {
            throw new Error("Cannot verify api claim => Could not find the accessToken in the current web storage mechanism");
        }

        return accessToken.hasOwnProperty(claimType);
    }

    userHasIdentityClaim(claimType) {
        if (!claimType || claimType === '') {
            throw new Error(`Cannot verify invalid identity claim ${claimType}`);
        }

        const idToken = this.getIdTokenContent();
        if (!idToken) {
            throw new Error(`Cannot verify identity claim ${claimType} => Could not find the idToken in the current web storage mechanism`);
        }

        return idToken.hasOwnProperty(claimType);
    }

    userHasScope(scopeName) {
        const accessToken = this.getAccessTokenContent();
        if (!accessToken) {
            throw new Error("Cannot verify accessToken expiration => Could not find the accessToken in the current web storage mechanism");
        }

        return accessToken.scope && accessToken.scope.findIndex(scopeName) >= 0;
    }
    
    rand() {
        return (Date.now() + "" + Math.random()).replace(".", "");
    }

    debug(content) {
        Logger.debug(content);
    }

    info(content) {
        Logger.info(content);
    }

    warn(content) {
        Logger.warn(content);
    }

    error(content) {
        Logger.error(content);
    }
}