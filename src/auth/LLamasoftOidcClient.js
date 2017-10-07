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

        //TODO add code that checks for existing silent renew timer (page refreshes screw it up)
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

        //If no return path is specified just set a default
        if (!this.authOptionsValidator.validateLocalPath(returnPath)) {
            //If the propert specified on the authOptions is valid then use that
            if (this.authOptionsValidator.validateLocalPath(this.authOptions.defaultPostAuthorizePath)) {
                returnPath = this.authOptions.defaultPostAuthorizePath;
            } else {
                Logger.warn("Missing defaultPostAuthorizePath property on authOptions. Using a default value of '/'")
                returnPath = "/";
            }
            this.debug(`Set returnPath to the defaultPostAuthorizePath '${returnPath}'`);
        }

        //Cleanup old stuff
        this.debug("Cleaning up old state, nonce, returnPath, accessToken, idToken values");
        window.localStorage.removeItem("state");
        window.localStorage.removeItem("nonce");
        window.localStorage.removeItem("returnPath");
        this.webStorage.remove("accessToken");
        this.webStorage.remove("idToken");

        const state = this.rand();
        const nonce = this.rand();

        this.debug("Setting state to " + state);
        this.debug("Setting nonce to " + nonce);

        //Do not let user override localStorage here
        window.localStorage["state"] = state;
        window.localStorage["nonce"] = nonce;
        window.localStorage["returnPath"] = returnPath;

        const authorizeEndpoint = this.authOptions.authorizeEndpoint;
        const clientId = this.authOptions.clientId;
        const redirectUri = window.location.origin + this.authOptions.redirectPath; //Can only redirect to a path in same origin
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

            //Will be valid (includes the leading '/') unless someone manually modified it
            const returnPath = window.localStorage["returnPath"];

            //Do cleanup
            window.localStorage.removeItem("state");
            window.localStorage.removeItem("nonce");
            window.localStorage.removeItem("returnPath");

            if (this.authOptions.useAutomaticSilentTokenRenew) {
                const expiresIn = window.parseInt(responseObject.expires_in, 10);
                this.debug("accessToken expires in " + expiresIn);
                this.debug("using automatic silent token renew feature");
                this.scheduleSilentRenewalProcess(expiresIn);
            } else {
                this.warn("Not using automatic silent token renew feature");
                //Automatically remove the token?
            }

            this.debug("Completed handleAuthorizeCallback");
            this.debug("Invoking onSuccess callback");

            this.eventManager.raiseLoginSuccessEvent(returnPath); //Always make sure we have the leading '/'
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

            //Trigger the silent renew process a subsequent time
            if (this.authOptions.useAutomaticSilentTokenRenew) {
                const expiresIn = window.parseInt(responseObject.expires_in, 10);
                this.debug("accessToken expires in " + expiresIn);
                this.debug("using automatic silent token renew feature");
                this.scheduleSilentRenewalProcess(expiresIn); //Schedule the next silent renew
            } else {
                this.warn("Not using automatic silent token renew feature");
                //Automatically remove the token?
            }

        //    this.debug("Completed completeSilentRenewProcess. Invoking ");

            this.eventManager.raiseSilentRenewSuccessEvent();
        } catch(error) {
            //Handle error
            this.error("Authentication callback process failed. Calling user callback 'errorCallback'");
            this.error(error);
            this.eventManager.raiseSilentRenewErrorEvent(error);
        }
    }

    scheduleSilentRenewalProcess(expiresInSeconds) {
        this.debug("scheduling SilentRenew process");
        if (this.silentRenewTimer) {
            this.debug(`Clearing existing SilentRenew with identifier ${this.silentRenewTimer}`);
            window.clearTimeout(this.silentRenewTimer);
        }
       // const tokenTimerInMilliSeconds = expiresInSeconds*1000; //Must switch to milliseconds for window.setTimeout
        const tokenTimerInMilliSeconds = 10*1000; //Must switch to milliseconds for window.setTimeout
        this.silentRenewTimer = window.setTimeout(() => this.triggerSilentRenewProcess(tokenTimerInMilliSeconds), tokenTimerInMilliSeconds);
        this.debug(`SilentRenewTimer created with identifier '${this.silentRenewTimer}'`);
        this.debug("Done scheduling SilentRenew process");
    }

    triggerSilentRenewProcess(tokenTimerInMilliSeconds) {
        this.debug("Starting silent renewal process");

        this.eventManager.raiseSilentRenewTriggeredEvent(tokenTimerInMilliSeconds);

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
        const redirectUri = window.location.origin + this.authOptions.silentRenewCallbackPath; //Can only redirect to a path in same origin
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

    redirectToLogout() {
        this.debug("Starting logout process");
        const idToken = this.getIdToken();

        this.webStorage.remove("accessToken");
        this.webStorage.remove("idToken");

        let returnUrl = window.location.origin;

        if (this.authOptions.defaultPostLogoutRedirectPath) {
            returnUrl += this.authOptions.defaultPostLogoutRedirectPath;
        }

        const url = this.createLogoutRequestUrl(this.authOptions.endSessionEndpoint, returnUrl, idToken);
        this.debug(`Constructed logout URL '${url}'`);

        if (this.silentRenewTimer) {
            this.debug(`Clearing silentRenewTimer with identifier ${this.silentRenewTimer}`);
            window.clearTimeout(this.silentRenewTimer);
        } else {
            this.debug("No existing silentRenewTimer to be cleared");
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
        const userInfo = this.getUserInfoFromIdToken();
        
        if (!userInfo || userInfo === null) {
            this.debug("Cannot find userinfo in storage");
            return false;
        }

        const now = parseInt(Date.now() / 1000, 10);

        if (userInfo.exp < now) {
            this.debug("The user's session has expired");
            return false;
        }

        this.debug("user is valid and session is active");
        return true;
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

    getUserInfoFromIdToken() {
        //Decode JWT
        const idToken = this.getIdToken();
        if (!idToken || idToken === null) {
            return undefined;
        }

        var jwtContent = JwtUtility.jwtToJSONObject(idToken);

        return jwtContent;
    }

    userHasApiClaim(claimType) {

    }

    userHasIdentityClaim(claimType) {

    }

    userHasScope(scopeName) {

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