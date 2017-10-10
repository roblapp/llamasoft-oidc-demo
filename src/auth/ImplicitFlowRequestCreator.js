import UrlUtility from './UrlUtility';

export default class ImplicitFlowRequestCreator {
    createAuthorizeRequestUrl(authorizeEndpoint, clientId, redirectUri, responseType, scopes, state, nonce) {
        let url = authorizeEndpoint;
        url = UrlUtility.addQueryParam(url, "client_id", clientId);
        url = UrlUtility.addQueryParam(url, "redirect_uri", redirectUri);
        url = UrlUtility.addQueryParam(url, "response_type", responseType);
        url = UrlUtility.addQueryParam(url, "scope", scopes);
        url = UrlUtility.addQueryParam(url, "state", state);
        url = UrlUtility.addQueryParam(url, "nonce", nonce);
        return url;
    }

    createEndSessionRequestUrl(endSessionEndpoint, postLogoutRedirectUri, idToken) {
        let url = endSessionEndpoint;
        url = UrlUtility.addQueryParam(url, "post_logout_redirect_uri", postLogoutRedirectUri);
        url = UrlUtility.addQueryParam(url, "id_token_hint", idToken);
        return url;
    }
}