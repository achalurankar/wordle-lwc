import Data from "c/data"

export default class CacheManager {

    static CACHE_KEY = 'wordle'
    static getData() {
        let data = window.localStorage.getItem(this.CACHE_KEY)
        if(!data) {
            data = {}
            data.boxes = Data.getBlankData()
            data.currJIndex = 0
            data.currIIndex = 0
            data.isGameFinished = false
            data.correctWord = null
            return data
        } else
            return JSON.parse(data)
    }

    static putData(data) {
        window.localStorage.setItem(this.CACHE_KEY, JSON.stringify(data))
    }

    static clearData() {
        window.localStorage.removeItem(this.CACHE_KEY)
    }
}