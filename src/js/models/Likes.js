export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, author, title, img) {
        const like = {id, author, title, img};
        this.likes.push(like);

        //Persist the like in localStorage
        this.persistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        //Persist the like in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        //Restoring the likes from the localStorage
        if (storage) this.likes = storage;
    }
}