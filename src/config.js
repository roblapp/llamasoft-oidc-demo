
export default {    
    oidc: {
            authority: 'http://localhost:5000',
            client_id: 'implicit',
            redirect_uri: 'http://localhost:3000/Callback',
            response_type: 'id_token token',
            scope: 'openid profile email api scgx-identity',
            post_logout_redirect_uri: 'http://localhost:3000',
            silent_redirect_uri : 'http://localhost:3000/SilentRenew',
            automaticSilentRenew: true,
            silentRequestTimeout: 10*1000,
            accessTokenExpiringNotificationTime: 50
        }
};
