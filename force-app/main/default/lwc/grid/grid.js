import { api, LightningElement } from 'lwc';
import Data from 'c/data';

export default class Grid extends LightningElement {
    
    @api
    boxes = []

    connectedCallback() {
        let tempBoxes = JSON.parse(JSON.stringify(this.boxes)) //to modify read only data
        for(let row of tempBoxes) {
            for(let box of row) {
                let className = this.decideClassName(box)
                box.className = className
                // console.log(className + ' box=' + _stringify(box));
                // console.count('boxes')
            }
        }
        // console.log(JSON.stringify(tempBoxes))
        this.boxes = tempBoxes
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