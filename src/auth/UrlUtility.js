
export default class UrlUtility {
    static addQueryParam(url, name, value) {
        if (url.indexOf('?') < 0) {
            url += "?";
        }

        if (url[url.length - 1] !== "?") {
            url += "&";
        }

        url += encodeURIComponent(name);
        url += "=";
        url += encodeURIComponent(value);

        return url;
    }

    static urlHashToJSONObject(url, delimiter = "#") {
        var idx = url.lastIndexOf(delimiter);
        if (idx >= 0) {
            url = url.substr(idx + 1);
        }
        
        let counter = 0;
        const params = url.split('&').reduce((result, item) => {
            var parts = item.split('=');
            result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);

            if (counter++ > 50) {
                throw new Error("response URL exceeded expected number of parameters",);
            }

            return result;
        }, {});

        for (var prop in params) {
            return params;
        }
        
        return {};
    }
}