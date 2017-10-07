
class AuthOptionsValidator {
    validate(authOptions) {
        if (!authOptions) {
            throw new Error("Parameter authOptions is undefined");
        }

        if (authOptions === null) {
            throw new Error("Parameter authOptions is null");
        }

        if (typeof authOptions !== 'object') {
            throw new Error("Parameter authOptions must be an object");
        }

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

        if (!authOptions.redirectPath || authOptions.redirectPath === null || typeof authOptions.redirectPath !== 'string'
            || !authOptions.redirectPath.startsWith("/")) {
            throw new Error("Parameter authOptions must contain a non-null string property called 'redirectPath'. This parameter must be a relative path and begin with a leading "/"");
        }

        if (!validateLocalPath(authOptions.redirectPath)) {
            throw new Error("Parameter authOptions must contain a non-null string property called 'redirectPath'. This parameter must be a relative path and begin with a leading "/"");
        }

        if (!validateLocalPath(authOptions.defaultPostAuthorizePath)) {
            throw new Error("Parameter authOptions must contain a non-null string property called 'defaultPostAuthorizePath'. This parameter must be a relative path and begin with a leading "/"");
        }

        if (!validateLocalPath(authOptions.defaultPostLogoutRedirectPath)) {
            throw new Error("Parameter authOptions must contain a non-null string property called 'defaultPostLogoutRedirectPath'. This parameter must be a relative path and begin with a leading "/"");
        }

        //If there is a silentRenewCallbackPath BUT it's invalid then throw an Error
        if (authOptions.silentRenewCallbackPath && !validateLocalPath(authOptions.silentRenewCallbackPath)) {
            throw new Error("Parameter authOptions contains an invalid optional property called 'silentRenewCallbackPath'. If specified, the parameter must be a relative path and begin with a leading "/"");
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

        if (authOptions.useAutomaticSilentTokenRenew) {
            if (typeof authOptions.useAutomaticSilentTokenRenew !== 'boolean') {
                throw new Error("Parameter authOptions contains an invalid useAutomaticSilentTokenRenew parameter. If specified, the parameter must be a boolean");
            }
            
            //Now check other parameters for silent renew
            if (!authOptions.silentRenewIFrameTimeoutSeconds || !Number.isInteger(authOptions.silentRenewIFrameTimeoutSeconds)) {
                throw new Error("Parameter authOptions contains an invalid silentRenewIFrameTimeoutSeconds parameter. If specified, the parameter must be a number");
            }

            if (!authOptions.silentRenewTokenRequestOffsetSeconds || !Number.isInteger(authOptions.silentRenewTokenRequestOffsetSeconds)) {
                throw new Error("Parameter authOptions contains an invalid silentRenewTokenRequestOffsetSeconds parameter. If specified, the parameter must be a number");
            }
        }
    }

    validateBoolProperty(prop) {
        return prop && typeof prop === 'boolean';
    }

    validateNumberProperty(prop) {
        return prop && typeof prop === 'number';
    }

    validateStringProperty(str) {
        if (!path || path === null || typeof path !== 'string') {
            return false;
        }

        return true;
    }

    validateLocalPath(path) {
        if (!validateStringProperty(path) || !path.startsWith("/")) {
            return false;
        }

        return true;
    }
}

export default AuthOptionsValidator;

// //Required
// const authOptions = {
//     authority,
//     authorizeEndpoint: `${authority}/connect/authorize`,
//     endSessionEndpoint: `${authority}/connect/endsession`,

//     //Paths MUST begin with leading '/'. They are all relative paths! They cannot be in a different origin.

//     redirectPath: '/Callback',                    //OAuth 2.0 client_redirect_uri (must be known to OIDC provider)
//     defaultPostAuthorizePath: '/Landing',         //Where the user should end up after the auth process (after the /Callback page)
//     defaultPostLogoutRedirectPath: undefined,     //Example: '/LogoutLandingPath'
//     silentRenewCallbackPath: '/SilentRenew',      //Must be registered as a client redirect_uri with the OIDC provider

//     clientId: 'implicit',                         //The OAuth 2.0 client_id
//     responseType: 'id_token token',               //The response type from the OIDC provider
//     scopes: 'openid profile email api scgx-identity',           //The requested scopes (as per OIDC spec)
    
//     useAutomaticSilentTokenRenew: true,          //For automatic token renewal
//     silentRenewIFrameTimeoutSeconds: 10,          //The timeout for the IFrame that silently refreshes tokens
//     silentRenewTokenRequestOffsetSeconds: 100,    //Will obtain a new token 100 seconds before the current token expires for a seamless transition
//     issuerOverride: undefined                    //Will rarely need this. Override this to a value that will be compared with the iss claim in a JWT
// };