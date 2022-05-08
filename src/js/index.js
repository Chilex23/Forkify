//6df9a046-53a3-4af4-8a45-0f2039b166dd
//https://forkify-api.herokuapp.com/api/v2/recipes
import Search  from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from "./views/base";

/*GLOBAL STATE OF THE APP
* - SEARCH OBJECT
* - RECIPE OBJECT
* - SHOPPING LIST OBJECT
* - LIKED RECIPES
*/
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    //1. Get the query from the view
    const query = searchView.getInput(); //TODO
    console.log(query);

    if (query) {
        //2. New search object and add it to state
        state.search = new Search(query);

        //3. Prepare the UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try {
            //4. Search for recipes
            await state.search.getResults();

            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result)
        } catch (err) {
            alert('Something went wrong with the search...');
            clearLoader();
        }   
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn--inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage)
    }
})


/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    //GET the ID from the URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected list item
        //if (state.search) searchView.highlightSelected(id);

        //Create a new recipe object
        state.recipe = new Recipe('2ec050');

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked('2ec050')
                );
            console.log(state.recipe);
        } catch (error) {
            alert('Error processing recipe!')
        }   
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIKE/BOOKMARK CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
   
    //User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.publisher,
            state.recipe.title,
            state.recipe.img
        )
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Clear empty message if there is a liked recipe
        likesView.clearLikesList(state.likes.likes);

        // Add like to the UI list
        likesView.renderLike(newLike);
        state.likes.persistData();

    //User has liked current recipe
    } else {
        // Remove from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from the UI list
        likesView.removeLike(currentID);
        state.likes.persistData();
    }
    console.log(state.likes);
};
console.log(state);

// Restore liked recipes on page load
window.addEventListener('load', () => {
    //TESTING
    state.likes = new Likes();
    state.likes.readStorage();

    // Clear empty message if there is a liked recipe
    likesView.clearLikesList(state.likes.likes);

    //Render existing likes
    if (state.likes.likes) {
        //likesView.clearLikesList(state.likes.likes);
        state.likes.likes.forEach(like => likesView.renderLike(like))
    };
})

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn--decrease-servings, .btn--decrease-servings *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn--increase-servings, .btn--increase-servings *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.btn--round, .btn--round *')) {
        //Like Controller
        controlLike();
    }
  
})

window.l = new List();

