import { elements } from "./base";
import { limitRecipeTitle } from "./searchView";

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-bookmark-fill' : 'icon-bookmark';
    document.querySelector('.btn--round use').setAttribute('href', `img/icons.svg#${iconString}`)
    //icon-bookmark-fill
};

export const renderLike = (like, list) => {
    const markup = `
        <li class="preview">
            <a class="preview__link" href="${like.id}">
            <figure class="preview__fig">
                <img src="${like.img}" alt="${like.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__name">
                ${limitRecipeTitle(like.title)}
                </h4>
                <p class="preview__publisher">${like.author}</p>
            </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
  
};

export const removeLike = id => {
    const el = document.querySelector(`.preview__link[href*="${id}"]`).parentElement;
    console.log(el);
    if (el) el.parentElement.removeChild(el);
}

export const clearLikesList = likes => {
    if (likes.length > 0) elements.likesList.innerHTML = '';
}