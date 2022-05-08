import axios from 'axios';
import { key } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {    
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${this.query}&key=${key}`);
            this.result = res.data.data.recipes;
            //console.log(this.result)
        } catch (error) {
            alert(error)
        }
    }
}

