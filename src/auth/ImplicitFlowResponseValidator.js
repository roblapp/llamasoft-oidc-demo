import Logger from './Logger';
import JwtUtility from './JwtUtility';

export default class ImplicitFlowResponseValidator {
    validateImplicitFlowResponse(responseObject, oidcMetadata, jsonWebKeyObject, clientId, clockSkew) {
        Logger.debug("Starting validation of implicit flow response");
        
        if (responseObject.error) {
            throw new Error(`The authentication process failed. Error: ${responseObject.error}`);
        }

        if (responseObject.state !== window.localStorage["state"]) {
            throw new Error("Invalid state.");
        }

        if (!oidcMetadata) {
            throw new Error("Invalid OIDC metadata");
        }

        if (!jsonWebKeyObject) {
            throw new Error("Invalid JSON Web Key metadata");
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
        JwtUtility.validateJwt(responseObject.id_token, jsonWebKeyObject, oidcMetadata.issuer, clientId, clockSkew);
        Logger.debug("Successful validation of idToken");

        Logger.debug("Implicit flow response has been successfully validated");
    }
}