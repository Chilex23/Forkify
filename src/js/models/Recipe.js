import axios from 'axios';
import { key } from '../config';
//https://forkify-api.herokuapp.com/api/get?rId=47746

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}&key=${key}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error)
        }
    }

    calcTime() {
        //Assuming we need 15 minutes for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(el => {
            //1) Uniform units
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            })

            //2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            //3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.trim().split(' ');
            //console.log(arrIng)
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2) );

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex); //Ex. 4 1/2 cups, arrCount is [4, 1/2], Ex2. 4 cups, arrCount is [4]
                let count;

                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else if (arrCount.length === 0) {
                    count = 1;
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but the first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is no unit and NO number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}