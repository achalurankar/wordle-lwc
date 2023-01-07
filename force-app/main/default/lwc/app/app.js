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
        this.boxes = Data.getBlankData();
    }
}