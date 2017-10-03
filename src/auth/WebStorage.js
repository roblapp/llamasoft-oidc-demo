

export default class WebStorage {
    store(key, value) {
        window.localStorage[key] = value;
    }

    get(key) {
        return window.localStorage[key];
    }

    remove(key) {
        window.localStorage.removeItem(key);
    }
}

//Example of how to write your own custom storage
// class CookieStorage {
//     store(key, value) {
        
//     }

//     get(key) {
        
//     }

//     remove(key) {
        
//     }
// }
