import { LightningElement, track } from 'lwc';
import Data from 'c/data';
import isWordValid from '@salesforce/apex/WordleController.isWordValid';
import CacheManager from 'c/cacheManager';

export default class App extends LightningElement {
    
    @track
    boxes
    @track
    currIIndex
    @track
    currJIndex
    @track
    isGameFinished
    @track
    correctWord

    connectedCallback() {
        this.init()
    }

    init() {
        let data = CacheManager.getData(CacheManager.KEY_GRID)
        if(!data) {
            data = {}
            data.boxes = Data.getBlankData()
            data.currJIndex = 0
            data.currIIndex = 0
            data.isGameFinished = false
            data.correctWord = null
        } else {
            data = JSON.parse(data)
        }
        if(!data.correctWord)
            Data.generateRandomWord((word) => this.correctWord = word)
        else
            this.correctWord = data.correctWord;
        this.boxes = this.updateClassNames(data.boxes);
        this.currIIndex = data.currIIndex;
        this.currJIndex = data.currJIndex;
        this.isGameFinished = data.isGameFinished;
    }

    renderedCallback() {
        this.template.querySelector('c-keyboard').renderKeyboard(this.boxes)
    }

    handleResetClick() {
        CacheManager.clearData()
        this.init()
    }

    handleKeyClick(event) {
        let key = event.detail.key;
        if(this.isGameFinished) return
        //is alphabet
        if(key.length === 1 /* && key.match(/^[A-Za-z]+$/) */) { //commented pattern match as its not required  layout keyboard is used, key down event was misbehaving at one stage
            this.handleInput(key)
        }
        //else if is enter
        else if(key === 'Enter') {
            this.handleEnter()
        } else if(key === 'Delete') {
            this.handleDelete()
        }
    }

    handleInput(key) {
        key = key.toUpperCase()
        //if all alphabets entered in current row, return
        if(this.boxes[this.currIIndex][this.currJIndex].letter) return
        let newBoxes = JSON.parse(JSON.stringify(this.boxes))
        newBoxes[this.currIIndex][this.currJIndex].letter = key
        let newIndex = (this.currJIndex + 1)
        if(newIndex === Data.NO_OF_LETTERS) //if last alphabet, 
            newIndex = Data.NO_OF_LETTERS - 1 //reset index to previous
        this.boxes = newBoxes
        this.currJIndex = newIndex;
    }

    updateClassNames(boxesToUpdate) {
        let tempBoxes = JSON.parse(JSON.stringify(boxesToUpdate)) //to modify read only data
        for(let row of tempBoxes) {
            for(let box of row) {
                let className = this.decideClassName(box)
                box.className = className
            }
        }
        return tempBoxes
    }

    handleEnter() {
        //make word from letters
        let word = ''
        this.boxes[this.currIIndex].forEach((box, j) => {
        if(box.letter)
            word += box.letter;
        })
        if(word.length < Data.NO_OF_LETTERS) {
            alert('Not enough letters')
            return
        }
        //process the word
        Data.checkWord(word.toLowerCase(), this.correctWord, isWordValid, res => {
            if(res.status === Data.SUCCESS) {
                let newBoxes = JSON.parse(JSON.stringify(this.boxes))
                res.results.forEach((item, i) => {
                    newBoxes[this.currIIndex][i].color = item.color
                })
                newBoxes = this.updateClassNames(newBoxes)
                this.template.querySelector('c-keyboard').renderKeyboard(newBoxes)
                this.boxes = newBoxes
                let newIndex = this.currIIndex + 1
                if(newIndex === Data.NO_OF_ATTEMPTS || (res.message && res.message.includes('Got'))){
                    this.isGameFinished = true
                    if(res.message)
                        alert(res.message)
                    else  
                        alert('Oops, you lost :(\nCorrect Word - ' + this.correctWord)
                }
                this.currIIndex = newIndex
                this.currJIndex = 0
                CacheManager.putData(CacheManager.KEY_GRID, {
                    boxes : newBoxes,
                    isGameFinished : this.isGameFinished,
                    currJIndex : 0,
                    currIIndex : newIndex,
                    correctWord : this.correctWord,
                })
            } else {
                alert(res.message)
            }
        })
    }

    handleDelete() {
        let newIndex = this.currJIndex !== Data.NO_OF_LETTERS - 1 ? (this.currJIndex - 1) : this.currJIndex
        let newBoxes = JSON.parse(JSON.stringify(this.boxes))
        if(newIndex < 0)
            return
        if(newBoxes[this.currIIndex][newIndex].letter === null) //if still pointing to last element
            newIndex--;
        if(newIndex < 0)
            newIndex = 0
        newBoxes[this.currIIndex][newIndex].letter = null
        this.currJIndex = newIndex
        this.boxes = newBoxes
    }

    decideClassName(box) {
        let className = 'grid-item'
        if(box.color === Data.PARTIAL)
          className += ' partial'
        else if(box.color === Data.RIGHT)
          className += ' correct'
        else if(box.color === Data.WRONG) 
          className += ' wrong'
        return className
    }
}