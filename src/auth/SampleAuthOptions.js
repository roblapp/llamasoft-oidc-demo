
const authority = 'http://localhost:5000'; //'https://demo.identityserver.io';

//Required
const authOptions = {
    authority,
    authorizeEndpoint: `${authority}/connect/authorize`,
    endSessionEndpoint: `${authority}/connect/endsession`,

    //Paths MUST begin with leading '/'. They are all relative paths! They cannot be in a different origin.

    redirectPath: '/Callback',                    //OAuth 2.0 client_redirect_uri (must be known to OIDC provider)
    defaultPostAuthorizePath: '/Landing',         //Where the user should end up after the auth process (after the /Callback page)
    defaultPostLogoutRedirectPath: undefined,     //Example: '/LogoutLandingPath'
    silentRenewCallbackPath: '/SilentRenew',      //Must be registered as a client redirect_uri with the OIDC provider

    clientId: 'implicit',                         //The OAuth 2.0 client_id
    responseType: 'id_token token',               //The response type from the OIDC provider
    scopes: 'openid profile email api scgx-identity',           //The requested scopes (as per OIDC spec)
    
    useAutomaticSilentTokenRenew: true,          //For automatic token renewal
    silentRenewIFrameTimeoutSeconds: 10,          //The timeout for the IFrame that silently refreshes tokens
    silentRenewTokenRequestOffsetSeconds: 100,    //Will obtain a new token 100 seconds before the current token expires for a seamless transition
    issuerOverride: undefined                    //Will rarely need this. Override this to a value that will be compared with the iss claim in a JWT
};

export default authOptions;
