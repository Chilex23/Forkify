import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = ''
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })

    //document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active')
};

// 'Pasta with tomato and spinach'
// acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
// acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
// acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
// acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length;
        }, 0);

        //return the result
        return `${newTitle.join(' ')}...`
    }
    return title
}

const renderRecipe = recipe => {
    const markup = `
        <li class="preview">
            <a class="preview__link preview__link--active" href="#${recipe.id}">
            <figure class="preview__fig">
                <img src="${recipe.image_url}" alt="Test" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${limitRecipeTitle( recipe.title)}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
                <div class="preview__user-generated">
                <svg>
                    <use href="img/icons.svg#icon-user"></use>
                </svg>
                </div>
            </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//type: 'prev' or 'next'
const createButtons = (page, type) => `
    <button class="btn--inline pagination__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
        <use href="img/icons.svg#icon-arrow-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        //Only Button to go to the next page
        button = createButtons(page, 'next')
    } else if (page < pages) {
        //Both buttons
        button = `
            ${createButtons(page, 'prev')}
            ${createButtons(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        //Only Button to go to the prev page
        button = createButtons(page, 'prev')
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //Render results of curren page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe)

    //Render pagination buttons
    renderButtons(page, recipes.length, resPerPage)
};