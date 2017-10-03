import jwt_decode from 'jwt-decode';
import WebStorage from './WebStorage';
import Logger from './Logger';
import IFrameWindow from './IFrameWindow';

export default class LLamasoftOidcClient {

    constructor(
        authOptions,
        webStorage
    ) {
        //TODO validate auth options
        this.authOptions = authOptions;

        this.webStorage = webStorage ? webStorage : new WebStorage();

        this.handleAuthorizeCallback = this.handleAuthorizeCallback.bind(this);
    }

    getAuthOptions() {
        return this.authOptions;
    }

    getWebStorage() {
        return this.webStorage;
    }

    redirectToLogin(returnPath, redirectUriPathOverride) {
        this.debug("Begin redirectToLogin");

        if (!returnPath) {
            returnPath = "/";
        }

        const authorizeUrl = this.buildAuthorizeRequestUrl(returnPath, this.authOptions.redirectPath);

        this.debug(`Constructed authorize URL ${authorizeUrl}`);
        window.location = authorizeUrl;
    }

    buildAuthorizeRequestUrl(returnPath, redirectUrlPath) {
        const state = this.rand();
        const nonce = this.rand();

        //TODO neccessary?
        window.localStorage.removeItem("state");
        window.localStorage.removeItem("nonce");

        this.debug("Setting state to " + state);
        this.debug("Setting nonce to " + nonce);

        //Do not let user override localStorage here
        window.localStorage["state"] = state;
        window.localStorage["nonce"] = nonce;
        window.localStorage["returnPath"] = returnPath;

        const url =
                this.authOptions.authorizeEndpoint + "?" +
                "client_id=" + encodeURI(this.authOptions.clientId) + "&" +
                "redirect_uri=" + encodeURI(window.location.origin + redirectUrlPath) + "&" +
                "response_type=" + encodeURI(this.authOptions.responseType) + "&" +
                "scope=" + encodeURI(this.authOptions.scopes) + "&" +
                "state=" + encodeURI(state) + "&" +
                "nonce=" + encodeURI(nonce);

        return url;
    }

    
    handleAuthorizeCallback(successCallback, errorCallback, onTokenStore) {
        try {
            this.debug("Starting authentication/authorization callback process");
            this.debug(JSON.stringify(this.authOptions));

            const hash = window.location.hash.substr(1);

            if (!hash) {
                throw new Error("Cannot validate url hash. The hash was missing.");
            }

            const result = hash.split('&')
                .reduce((result, item) => {
                    const parts = item.split('=');
                    result[parts[0]] = parts[1];
                    return result;
                }, {});

            if (result.error) {
                throw new Error(`The authentication process failed. Error: ${result.error}`);
            }

            if (result.state !== window.localStorage["state"]) {
                throw new Error("Invalid state.");
            }

            const idToken = result.id_token;

            //If the user attempted to request an id_token but there was not one in the response then throw an error
            if (this.authOptions.responseType.includes("id_token") && !idToken) {
                throw new Error("An id_token was expected, but one was not found.");
            }

            this.jwtToJson(idToken);

            const accessToken = result.access_token;

            this.webStorage.store("idToken", idToken);
            this.webStorage.store("accessToken", accessToken);
            
            //Give the user a hook without having to come up with a custom implementation of WebStorage
            if (onTokenStore && typeof onTokenStore === "function") {
                onTokenStore("idToken", idToken);
                onTokenStore("accessToken", accessToken);
            }

            //Will be valid (includes the leading '/') unless someone manually modified it
            const returnPath = window.localStorage["returnPath"];

            window.localStorage.removeItem("state");
            window.localStorage.removeItem("nonce");
            window.localStorage.removeItem("returnPath");
            // window.localStorage.removeItem("expiresIn");

            const expiresIn = window.parseInt(result.expires_in, 10);
            // window.localStorage["expiresIn"] = expiresIn;
            this.debug("accessToken expires in " + expiresIn);

            if (this.authOptions.useAutomaticSilentTokenRenew) {
                this.debug("using automatic silent token renew feature");
                this.scheduleTokenRenew(expiresIn);
            } else {
                this.warn("Not using automatic silent token renew feature");
            }

            this.debug("Authentication/authorization callback process has successfully completed. Now calling user callback 'successCallback'");

            successCallback(returnPath); //Always make sure we have the leading '/'
        } catch(error) {
            //Handle error
            this.error("Authentication callback process failed. Calling user callbacl 'errorCallback'");
            errorCallback(error);
        }
    }

    jwtToJson(jwt, validate = true) {
        this.debug("Starting to verify JWT");
        const jwtContent = jwt_decode(jwt);
        this.debug("Decoded jwt");
        
        if (validate) {
            if (!jwtContent.nonce) {
                throw new Error("'nonce' parameter was not found in token");
            }

            if (window.localStorage["nonce"] !== jwtContent.nonce) {
                throw new Error("'nonce' value was unexpected");
            }

            const issuer = this.authOptions.issuerOverride ? this.authOptions.issuerOverride : this.authOptions.authority;

            if (jwtContent.iss !== issuer) {
                throw new Error("Could not verify token Issuer (iss claim)");
            }

            if (jwtContent.aud !== this.authOptions.clientId) {
                throw new Error("Invalid audience (aud claim). The supplied aud claim did not match the client_id parameter sent to the authorize endpoint");
            }

            const now = parseInt(Date.now() / 1000, 10);

            // accept tokens issues up to 5 mins ago
            const diff = now - jwtContent.iat;

            if (diff > (5 * 60)) {
                throw new Error("Token was issued too long ago");
            }

            if (jwtContent.exp < now) {
                throw new Error("Token is expired");
            }
        }

        return jwtContent;
    }

    getAccessToken() {
        return this.webStorage.get("accessToken")
    }

    getIdToken() {
        return this.webStorage.get("idToken")
    }


    getUserInfoFromIdToken() {
        //Decode JWT
        const idToken = this.getIdToken();
        if (!idToken || idToken === null) {
            return undefined;
        }

        var jwtContent = jwt_decode(idToken);

        return jwtContent;
    }


    redirectToLogout() {
        this.debug("Starting logout process");
        const idToken = this.webStorage.get("idToken");

        this.webStorage.remove("accessToken");
        this.webStorage.remove("idToken");

        let returnUrl = window.location.origin;

        if (this.authOptions.defaultPostLogoutRedirectPath) {
            returnUrl += this.authOptions.defaultPostLogoutRedirectPath;
        }

        const url = this.buildLogoutRequestUrl(returnUrl, idToken);

        if (this.silentRenewTimer) {
            this.debug(`Clearing silentRenewTimer  ${this.silentRenewTimer}`);
            window.clearTimeout(this.silentRenewTimer);
            this.debug(`Done clearing silentRenewTimer  ${this.silentRenewTimer}`);
        }
        
        this.debug(`Completed logout process. Now navigating to logout URL '${url}'`);

        window.location = url;
    }

    //Note that it is id_token here... NOT access_token!!! This is from OIDC spec!!!
    buildLogoutRequestUrl(postLogoutRedirectUri, idToken) {
        const url =
                this.authOptions.endSessionEndpoint + "?" +
                "post_logout_redirect_uri=" + encodeURI(postLogoutRedirectUri) + "&" +
                "id_token_hint=" + encodeURI(idToken);
        return url;
    }

    scheduleTokenRenew(expiresInSeconds) {
       // const tokenTimerInMilliSeconds = expiresInSeconds*1000; //Must switch to MS for window.setTimeout
        const tokenTimerInMilliSeconds = 10*1000; //Must switch to MS for window.setTimeout
        this.silentRenewTimer = window.setTimeout(() => this.renewTokens(), tokenTimerInMilliSeconds);
    }

    renewTokens() {
        this.info("Starting silent renewal process");

        const hiddenIFrame = new IFrameWindow();

        const redirectUrl = this.authOptions.redirectPath;

        const authorizeUrl = this.buildAuthorizeRequestUrl("/", redirectUrl);
        const timeout = this.authOptions.silentRenewIFrameTimeoutSeconds*1000;
        this.debug("Created authorizeUrl " + authorizeUrl);
        this.debug(`Setting timeout to ${timeout} milliseconds`);

        hiddenIFrame.navigate({ authorizeUrl, timeout });
    }


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