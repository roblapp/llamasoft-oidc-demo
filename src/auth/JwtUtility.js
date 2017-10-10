import { jws, KEYUTIL as KeyUtil, X509, crypto, hextob64u } from 'jsrsasign';
import Logger from './Logger';

///
/// Shamelessly copied from https://github.com/IdentityModel/oidc-client-js/blob/dev/src/JoseUtil.js
///
const AllowedSigningAlgs = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'];

export default class JwtUtility {
    static getJwtPayload(jwt) {
        const jsonObject = JwtUtility.parseJwt(jwt);
        if (jsonObject && jsonObject.payload) {
            return jsonObject.payload;
        }
        return null;
    }

    static parseJwt(jwt) {
        Logger.debug("Validating JWT");
        try {
            var token = jws.JWS.parse(jwt);
            return {
                header: token.headerObj,
                payload: token.payloadObj
            }
        }
        catch (e) {
            Logger.debug("Validation of JWT failed");
            Logger.error(e);
            return null;
        }
    }

    static validateJwt(jwt, key, issuer, audience, clockSkew, now) {
        try {
            if (key.kty === "RSA") {
                if (key.e && key.n) {
                    key = KeyUtil.getKey(key);
                }
                else if (key.x5c && key.x5c.length) {
                    key = KeyUtil.getKey(X509.getPublicKeyFromCertPEM(key.x5c[0]));
                }
                else {
                    Logger.error("RSA key missing key material");
                    throw new Error("RSA key missing key material");
                }
            }
            else if (key.kty === "EC") {
                if (key.crv && key.x && key.y) {
                    key = KeyUtil.getKey(key);
                }
                else {
                    Logger.error("EC key missing key material");
                    throw new Error("EC key missing key material");
                }
            }
            else {
                Logger.error(`Unsupported key type '${key.kty}'`);
                throw new Error(`Unsupported key type '${key.kty}'`);
            }

            return JwtUtility.validateJwtHelper(jwt, key, issuer, audience, clockSkew, now);
        }
        catch (e) {
            Logger.error(e);
            throw e;
        }
    }

    static validateJwtHelper(jwt, key, issuer, audience, clockSkew) {
        if (!clockSkew) {
            clockSkew = 0;
        }

        const now = parseInt(Date.now() / 1000, 10);

        var payload = JwtUtility.parseJwt(jwt).payload;

        if (!payload.iss) {
            Logger.error("issuer was not provided");
            throw new Error("issuer was not provided");
        }
        if (payload.iss !== issuer) {
            Logger.error(`Invalid issuer in token ${payload.iss}`);
            throw new Error("Invalid issuer in token: " + payload.iss);
        }

        if (!payload.aud) {
            Logger.error("aud was not provided");
            throw new Error("aud was not provided");
        }

        var validAudience = payload.aud === audience || (Array.isArray(payload.aud) && payload.aud.indexOf(audience) >= 0); 
        if (!validAudience) {
            Logger.error(`Invalid audience in token '${payload.aud}'`);
            throw new Error(`Invalid audience in token '${payload.aud}'`);
        }

        var lowerNow = now + clockSkew;
        var upperNow = now - clockSkew;

        if (!payload.iat) {
            Logger.error("iat was not provided");
            throw new Error("iat was not provided");
        }

        if (lowerNow < payload.iat) {
            Logger.error(`iat is in the future ${payload.iat}`);
            throw new Error("iat is in the future: " + payload.iat);
        }

        if (payload.nbf && lowerNow < payload.nbf) {
            Logger.error(`nbf is in the future ${payload.nbf}`);
            throw new Error("nbf is in the future: " + payload.nbf);
        }

        if (!payload.exp) {
            Logger.error("exp was not provided");
            throw new Error("exp was not provided");
        }
        
        if (payload.exp < upperNow) {
            Logger.error(`exp is in the past ${payload.exp}`);
            throw new Error("exp is in the past:" + payload.exp);
        }

        if (!jws.JWS.verify(jwt, key, AllowedSigningAlgs)) {
            Logger.error("signature validation failed");
            throw new Error("signature validation failed");
        }
    }

    static isJwtValid(jwt, clockSkew) {
        if (!clockSkew) {
            clockSkew = 0;
        }

        const now = parseInt(Date.now() / 1000, 10);

        var payload = JwtUtility.parseJwt(jwt).payload;

        var lowerNow = now + clockSkew;
        var upperNow = now - clockSkew;

        if (!payload.iat) {
            Logger.error("iat was not provided");
            throw new Error("iat was not provided");
        }

        if (lowerNow < payload.iat) {
            Logger.error(`iat is in the future ${payload.iat}`);
            return false;
        }

        if (payload.nbf && lowerNow < payload.nbf) {
            Logger.error(`nbf is in the future ${payload.nbf}`);
            return false;
        }

        if (!payload.exp) {
            Logger.error("exp was not provided");
            throw new Error("exp was not provided");
        }
        
        if (payload.exp < upperNow) {
            Logger.error(`exp is in the past ${payload.exp}`);
            return false;
        }

        return true;
    }

    static hashString(value, alg) {
        Logger.debug(`JwtParser hashString value = ${value}, alg = ${alg}`);
        try {
            return crypto.Util.hashString(value, alg);
        }
        catch (e) {
            Logger.error(e);
            return null;
        }
    }

    static hexToBase64Url(value) {
        Logger.debug(`JwtParser hexToBase64Url ${value}`);
        try {
            return hextob64u(value);
        }
        catch (e) {
            Logger.error(e);
            return null;
        }
    }
}