import jwt_decode from 'jwt-decode';

export default class JwtUtility {
    static jwtToJSONObject(jwtToken) {
        return jwt_decode(jwtToken);
    }
}