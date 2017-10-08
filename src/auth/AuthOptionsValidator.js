import Logger from './Logger';

class AuthOptionsValidator {
    validate(authOptions) {
        Logger.debug("Started validating authOptions");

        if (!authOptions) {
            throw new Error("Parameter authOptions is undefined");
        }

        if (authOptions === null) {
            throw new Error("Parameter authOptions is null");
        }

        if (typeof authOptions !== 'object') {
            throw new Error("Parameter authOptions must be an object");
        }

        Logger.debug("Validating the following authOptions object");
        Logger.debug(JSON.stringify(authOptions));

        //Check for required parameters
        if (!authOptions.authority || authOptions.authority === null || typeof authOptions.authority !== 'string') {
            throw new Error("Parameter authOptions must contain a non-null string property called 'authority'");
        }

        if (!authOptions.authorizeEndpoint || authOptions.authorizeEndpoint === null || typeof authOptions.authorizeEndpoint !== 'string') {
            throw new Error("Parameter authOptions must contain a non-null string property called 'authorizeEndpoint'");
        }

        if (!authOptions.endSessionEndpoint || authOptions.endSessionEndpoint === null || typeof authOptions.endSessionEndpoint !== 'string') {
            throw new Error("Parameter authOptions must contain a non-null string property called 'endSessionEndpoint'");
        }

        if (!authOptions.redirectUri || authOptions.redirectUri === null || typeof authOptions.redirectUri !== 'string') {
            throw new Error("Parameter authOptions must contain a non-null string property called 'redirectUri'");
        }

        if (authOptions.silentRenewCallbackUri && (authOptions.silentRenewCallbackUri === null || typeof authOptions.endSessionEndpoint !== 'string')) {
            throw new Error("Parameter authOptions must contain a non-null string property called 'silentRenewCallbackUri'");
        }

        if (!this.validateStringProperty(authOptions.clientId)) {
            throw new Error("Parameter authOptions must contain a valid clientId parameter");
        }

        if (!this.validateStringProperty(authOptions.responseType)) {
            throw new Error("Parameter authOptions must contain a valid responseType parameter. The parameter must be a space delimtied string that contains the response types to be requested from the OIDC provider");
        }

        if (!this.validateStringProperty(authOptions.scopes)) {
            throw new Error("Parameter authOptions must contain a valid scopes parameter. The paameter must be a space delimited string that contains the scopes to be requested from the OIDC provider");
        }

        if (authOptions.issuerOverride && typeof authOptions.issuerOverride !== 'string') {
            throw new Error("Parameter authOptions contains an invalid issuerOverride parameter. If specified, the parameter must be a string");
        }

         if (authOptions.accessTokenExpiringEventOffset && (!Number.isInteger(authOptions.accessTokenExpiringEventOffset) || authOptions.accessTokenExpiringEventOffset <= 0)) {
            throw new Error("Parameter authOptions contains an invalid accessTokenExpiringEventOffset parameter. If specified, the parameter must be a positive integer");
        }

        if (authOptions.postAccessTokenExpiredEventOffset && !Number.isInteger(authOptions.postAccessTokenExpiredEventOffset) && authOptions.postAccessTokenExpiredEventOffset < 0) {
            throw new Error("Parameter authOptions contains an invalid accessTokenExpiringEventOffset parameter. If specified, the parameter must be a positive integer");
        }

        if (authOptions.useAutomaticSilentTokenRenew) {
            if (typeof authOptions.useAutomaticSilentTokenRenew !== 'boolean') {
                throw new Error("Parameter authOptions contains an invalid useAutomaticSilentTokenRenew parameter. If specified, the parameter must be a boolean");
            }

            //Now check other parameters for silent renew
            if (!authOptions.silentRenewIntervalInSeconds || !Number.isInteger(authOptions.silentRenewIntervalInSeconds)
                || authOptions.silentRenesilentRenewIntervalInSecondswInterval <= 0 || authOptions.silentRenesilentRenewIntervalInSecondswInterval > 100) {
                throw new Error("Parameter authOptions contains an invalid silentRenewIntervalInSeconds parameter. If specified, the parameter must be a positive integer between 1 and 100");
            }

            if (!authOptions.silentRenewIFrameTimeoutSeconds || !Number.isInteger(authOptions.silentRenewIFrameTimeoutSeconds)) {
                throw new Error("Parameter authOptions contains an invalid silentRenewIFrameTimeoutSeconds parameter. If specified, the parameter must be a positive integer");
            }

            if (!authOptions.silentRenewTokenRequestOffsetSeconds || !Number.isInteger(authOptions.silentRenewTokenRequestOffsetSeconds)) {
                throw new Error("Parameter authOptions contains an invalid silentRenewTokenRequestOffsetSeconds parameter. If specified, the parameter must be a positive integer");
            }
        }

        Logger.debug("Finished validating authOptions");
    }

    validateBoolProperty(prop) {
        return prop && typeof prop === 'boolean';
    }

    validateNumberProperty(prop) {
        return prop && typeof prop === 'number';
    }

    validateStringProperty(str) {
        if (!str || str === null || typeof str !== 'string') {
            return false;
        }

        return true;
    }
}

export default AuthOptionsValidator;