
const authority = 'http://localhost:5000'; //'https://demo.identityserver.io';
const currentDomain = window.location.origin;

//Required
const authOptions = {
    authority,
    authorizeEndpoint: `${authority}/connect/authorize`,
    endSessionEndpoint: `${authority}/connect/endsession`,

    redirectUri: `${currentDomain}/Callback`,                           //OAuth 2.0 client_redirect_uri (must be known to OIDC provider)
    silentRenewCallbackUri: `${currentDomain}/SilentRenew`,             //Must be registered as a client redirect_uri with the OIDC provider

    postAccessTokenExpiredEventOffset: 0,                              //The number of seconds before an accessToken expires to trigger the accessTokenExpiring event

    clientId: 'implicit',                                               //The OAuth 2.0 client_id
    responseType: 'id_token token',                                     //The response type from the OIDC provider
    scopes: 'openid profile email api scgx-identity',                   //The requested scopes (as per OIDC spec)
    
    useAutomaticSilentTokenRenew: false,                                //For automatic token renewal
    silentRenewIFrameTimeoutSeconds: 10,                                //The timeout for the IFrame that silently refreshes tokens
    silentRenewTokenRequestOffsetSeconds: 10,                           //Will obtain a new token 5 minutes before the current token expires for a seamless transition
    silentRenewIntervalInSeconds: 10,                                   //The frequency at which to check the accessToken and idToken to be renewed
    includeIdTokenInSilentRenew: true,                                  //Whether or not to request a new idToken when silent renew takes place

    revokeAccessTokenOnSignout: true,
    issuerOverride: undefined                                           //Will rarely need this. Override this to a value that will be compared with the iss claim in a JWT
};

export default authOptions;
