import WebStorage from './/WebStorage';
import Logger from './Logger';
import AuthEventManager from './AuthEventManager';
import JsonService from './JsonService';
import ImplicitFlowRequestCreator from './ImplicitFlowRequestCreator';
import ImplicitFlowResponseValidator from './ImplicitFlowResponseValidator';
import JwtUtility from './JwtUtility';
// import UrlUtility from './UrlUtility';

export default class AuthManager {
    constructor(authOptions) {
        this.authOptions = authOptions;
        this.webStorage = new WebStorage();
        this.eventManager = new AuthEventManager();
        this.jsonService = new JsonService();
        this.implicitFlowRequestCreator = new ImplicitFlowRequestCreator();
        this.implicitFlowResponseValidator = new ImplicitFlowResponseValidator();
    }

    getEventManager() {
        return this.eventManager;
    }

    loadOIDCDiscoveryJson() {
        return this.jsonService.getJson(`${this.authOptions.oidcProviderDomain}/.well-known/openid-configuration`);
    }

    redirectToLogin(returnPath) {
        Logger.debug("Begin redirectToLogin");
        const authManager = this; //Grrrr... so annoying

        return this.loadOIDCDiscoveryJson()
            .then(oidcMetadata => {
                Logger.debug(JSON.stringify(oidcMetadata));

                //Cleanup old stuff
                Logger.debug("Cleaning up old state, nonce, returnPath, accessToken, idToken values");
                window.localStorage.removeItem("state");
                window.localStorage.removeItem("nonce");
                window.localStorage.removeItem("returnPath");
                window.localStorage.removeItem("expires_in");
                this.webStorage.remove("accessToken");
                this.webStorage.remove("idToken");
                window.sessionStorage.removeItem("silentRenew");

                const state = this.rand();
                const nonce = this.rand();

                Logger.debug("Setting state to " + state);
                Logger.debug("Setting nonce to " + nonce);

                //These values should always be temporarily stored in localStorage
                window.localStorage["state"] = state;
                window.localStorage["nonce"] = nonce;
                if (returnPath) {
                    window.localStorage["returnPath"] = returnPath;
                }

                const authorizeEndpoint = oidcMetadata.authorization_endpoint;
                const clientId = this.authOptions.clientId;
                const redirectUri = this.authOptions.redirectUri; //Can only redirect to a path in same origin
                const responseType = this.authOptions.responseType;
                const scopes = this.authOptions.scopes;
                const authorizeUrl = this.implicitFlowRequestCreator.createAuthorizeRequestUrl(authorizeEndpoint, clientId, redirectUri, responseType, scopes, state, nonce);

                Logger.debug(`Created authorize URL ${authorizeUrl}`);
                Logger.debug("Completed redirectToLogin process. Now redirecting to authorizeUrl");
                window.location = authorizeUrl;

                return Promise.resolve();
            }, error => {
                Logger.error(error);
                authManager.eventManager.raiseLoginErrorEvent(error);
                return Promise.reject(error);
            });
    }

    handleAuthorizeCallback() {
        Logger.debug("Starting handleAuthorizeCallback");

        const authManager = this; //Grrrr... so annoying

        return this.loadOIDCDiscoveryJson()
            .then(oidcMetadata => {
                // alert(JSON.stringify(oidcMetadata));
                // return Promise.resolve(JSON.stringify(oidcMetadata));
                if (!oidcMetadata) {
                    // return Promise.reject(new Error("Cannot obtain OIDC metadata from discovery endpoint"));
                    throw new Error("Cannot obtain OIDC metadata from discovery endpoint");
                }

                const returnPath = window.localStorage["returnPath"];
                // alert(JSON.stringify(authManager));
                authManager.eventManager.raiseLoginSuccessEvent(returnPath);

                Logger.debug("Finished Authorization process successfully. (Resolving Promise)");

                // return Promise.resolve(returnPath);
                return returnPath;
            }).catch(error => {
                Logger.error("handleAuthorizeCallback failed");
                throw error;
            });
    }

    ///Whether or not the user is authenticated is based on the expiration time of the access token
    isAuthenticated() {
        const item = window.localStorage.getItem("expires_in");
        if (!item) {
            return false;
        }

        const expiresAt = JSON.parse(item);
        return new Date().getTime() < expiresAt;
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

        return JwtUtility.getJwtPayload(idToken);
    }

    removeAccessToken() {
        this.webStorage.remove("accessToken");
    }

    removeIdToken() {
        this.webStorage.remove("idToken");
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
    
    rand() {
        return (Date.now() + "" + Math.random()).replace(".", "");
    }
}
