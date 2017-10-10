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
