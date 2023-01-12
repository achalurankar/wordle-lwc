import { api, LightningElement, track } from 'lwc';
import Data from 'c/data';
import CacheManager from 'c/cacheManager';

export default class Keyboard extends LightningElement {

    @track
    rows

    @track
    boxes

    keyMap = {}
    oldMap = {}

    @api
    renderKeyboard(newBoxes) {
        let data = CacheManager.getData(CacheManager.KEY_KEYBOARD)
        if(!data) 
            data = {}
        else
            data = JSON.parse(data)
        this.oldMap = data 
        this.boxes = newBoxes
        this.rows = [ 
            { key : 'row1', alphabets : [] }, 
            { key : 'row2', alphabets : [] }, 
            { key : 'row3', alphabets : [] }
        ]
        this.populateKeyMap()
        this.populateKeys("QWERTYUIOP", this.rows[0].alphabets);
        this.populateKeys("ASDFGHJKL", this.rows[1].alphabets);
        this.populateKeys("ZXCVBNM", this.rows[2].alphabets); 
        this.rows[2].alphabets.unshift({ className : 'key unused', key : 'Enter', value : 'Enter', onClick : this.handleAlphabetClick })
        this.rows[2].alphabets.push({ className : 'key unused', key : 'Delete', value : 'Delete', onClick : this.handleAlphabetClick })
    }

    populateKeys(letters, row) {
        letters = letters.split("");
        for (let i = 0; i < letters.length; i++) {
            let className = this.keyMap[letters[i]];
            let alphabet = { className : `key ${className}`, key : letters[i], value : letters[i], onClick : this.handleAlphabetClick }
            row.push(alphabet)
        }
    }

    handleAlphabetClick(event) {
        let key = event.target.value
        this.dispatchEvent(new CustomEvent('keyclick', { detail : { key : key } } ))
    }

    //populate map for display current progress of alphabets in keyboard
    populateKeyMap() {
        const alphabets = "QWERTYUIOPASDFGHJKLZXCVBNM".split("")
        const currMap = {}
        for(const row of this.boxes) {
            for(const box of row) {
                if(!box.letter) continue
                if(box.color === Data.WRONG) {
                    currMap[box.letter] = 'wrong'
                }
                if(box.color === Data.PARTIAL) {
                    currMap[box.letter] = 'partial'
                }
                if(box.color === Data.RIGHT) {
                    currMap[box.letter] = 'correct'
                }
            }
        }
        for(const alphabet of alphabets) {
            let className = 'unused'
            if(alphabet in currMap) {
                className = currMap[alphabet]
            }
            if(alphabet in this.oldMap && Data.colorVsCode[this.oldMap[alphabet]] > Data.colorVsCode[className])
                className = this.oldMap[alphabet]
            this.keyMap[alphabet] = className
        }
        this.oldMap = JSON.parse(JSON.stringify(this.keyMap))
        CacheManager.putData(CacheManager.KEY_KEYBOARD, this.oldMap)
    }
}