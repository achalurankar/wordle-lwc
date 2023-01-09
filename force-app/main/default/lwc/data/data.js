export default class Data {

    static UNANSWERED = 1 
    static WRONG = 2
    static RIGHT = 3
    static PARTIAL = 4

    static ERROR = 404
    static SUCCESS = 200

    static NO_OF_LETTERS = 5
    static NO_OF_ATTEMPTS = 6

    static getBlankData() {
        let data = Array.from(Array(Data.NO_OF_ATTEMPTS), () => new Array(Data.NO_OF_LETTERS));
        for(let i = 0; i < Data.NO_OF_ATTEMPTS; i++){
            for(let j = 0; j < Data.NO_OF_LETTERS; j++){
                data[i][j] = {
                    id : `${i}_${j}`,
                    letter : null,
                    color : Data.UNANSWERED
                };
            }
        }
        return data
    }

    static previouslySelectedWords = []

    static generateRandomWord(callback) {
        fetch('https://random-word-api.herokuapp.com/word?lang=en&number=1&length=' + Data.NO_OF_LETTERS)
            .then(res=> res.json())
            .then(data => {
                callback && callback(data[0].toUpperCase())
            })
    }

    static async checkWord(word, correctWord, isWordValid, callback) {
        const isValid = await isWordValid({ word : word })
        let response = {}
        response.results =  []
        if(!isValid){
            response.status = this.ERROR
            response.message = 'Not in the word list'
            callback(response)
        }
        else {
            response.status = this.SUCCESS
            if(correctWord === word) {
                response.message = 'You Got it!'
                for(let i = 0; i < word.length; i++){
                    response.results.push({
                        letter : word[i],
                        color : Data.RIGHT
                    })
                }
            } else {
                for(let i = 0; i < word.length; i++) {
                    let index = correctWord.indexOf(word[i])
                    let color;
                    if(index === -1) {
                        color = this.WRONG
                    } else {
                        if(word[index] === correctWord[index]) {
                            color = this.RIGHT
                        } else {
                            color = this.PARTIAL
                        }
                    }
                    response.results.push({
                        letter : word[i],
                        color : color
                    })
                }
            }
            callback(response)
        }
    }
}