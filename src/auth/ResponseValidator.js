import JwtUtility from './JwtUtility';
import Logger from './Logger';

export default class ResponseValidator {
    constructor(authOptions) {
        this.authOptions = authOptions;
    }

    validateImplicitFlowResponse(responseObject) {
        Logger.debug("Starting validation of implicit flow response");
        
        if (responseObject.error) {
            throw new Error(`The authentication process failed. Error: ${responseObject.error}`);
        }

        if (responseObject.state !== window.localStorage["state"]) {
            throw new Error("Invalid state.");
        }

        const idToken = responseObject.id_token;
        const accessToken = responseObject.access_token;

        //If the user attempted to request an id_token but there was not one in the response then throw an error
        if (!idToken) {
            throw new Error("An id_token was expected, but one was not found.");
        }

        if (!accessToken) {
            throw new Error("An access_token was expected, but one was not found.");
        }

        //Validate the idToken
        Logger.debug("Starting validation of idToken");
        this.validateIdToken(idToken);
        Logger.debug("Successful validation of idToken");

        //Validate the accessToken
        Logger.debug("Starting validation of accessToken");
        this.validateAccessToken(accessToken);
        Logger.debug("Successful validation of accessToken");

        Logger.debug("Implicit flow response has been successfully validated");
    }

    validateIdToken(idToken) {
        const jwtContent = JwtUtility.jwtToJSONObject(idToken);
        
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

    validateAccessToken(accessToken) {
        // const jwtContent = JwtUtility.jwtToJSONObject(accessToken);
        //TODO validate accessToken
    }
}