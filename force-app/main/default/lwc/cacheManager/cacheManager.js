export default class CacheManager {

    static KEY_GRID = 'wordle'
    static KEY_KEYBOARD = 'keyboard'

    static getData(key) {
        return window.localStorage.getItem(key)
    }

    static putData(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data))
    }

    static clearData() {
        window.localStorage.clear()
    }
}