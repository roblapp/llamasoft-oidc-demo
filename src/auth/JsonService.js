import Logger from './Logger';

export default class JsonService {
    getJson(url, token) {
        Logger.debug(`Starting JsonService getJson with url ${url}`);
        
        if (!url || url === ''){
            Logger.error("Invalid url passed to JsonService");
            throw new Error("Invalid url passed to JsonService");
        }
        
        return new Promise((resolve, reject) => {
            
            var request = new XMLHttpRequest();
            request.open('GET', url);

            request.onload = function() {
                Logger.debug("HTTP response received, status", request.status);
                
                if (request.status === 200) {
                    try {
                        resolve(JSON.parse(request.responseText));
                    }
                    catch (e) {
                        Logger.error("Error parsing JSON response", e.message);
                        reject(e);
                    }
                }
                else {
                    reject(Error(request.statusText + " (" + request.status + ")"));
                }
            };

            request.onerror = function() {
                Logger.error("network error");
                reject(Error("Network Error"));
            };
            
            if (token) {
                Logger.debug("accessToken passed, setting Authorization header");
                request.setRequestHeader("Authorization", "Bearer " + token);
            }

            request.send();
        });
    }
}