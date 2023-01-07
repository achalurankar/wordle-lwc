import { LightningElement, track } from 'lwc';
import Data from 'c/data';

export default class App extends LightningElement {
    
    @track
    boxes = []
    @track
    currIIndex = 0
    @track
    currJIndex = 0
    @track
    isGameFinished = false

    connectedCallback() {
        window._stringify = (input) => JSON.stringify(input)
        this.boxes = this.updateClassNames(Data.getBlankData());
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
        // console.log(JSON.stringify(tempBoxes))
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
        Data.checkWord(word, res => {
            console.log(res)
            if(res.status === Data.SUCCESS) {
                let newBoxes = JSON.parse(JSON.stringify(this.boxes))
                res.results.forEach((item, i) => {
                    newBoxes[this.currIIndex][i].color = item.color
                })
                this.boxes = this.updateClassNames(newBoxes)
                this.template.querySelector('c-keyboard').renderKeyboard(newBoxes)
                let newIndex = this.currIIndex + 1
                if(newIndex === Data.NO_OF_ATTEMPTS || (res.message && res.message.includes('Got'))){
                    this.isGameFinished = true
                    if(res.message)
                        alert(res.message)
                    else  
                        alert('Oops, you lost :(\nCorrect Word - ' + res.correctWord)
                    return
                }
                this.currIIndex = newIndex
                this.currJIndex = 0
            } else {
                alert(res.message)
            }
        })
    }

    handleDelete() {}

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