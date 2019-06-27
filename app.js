var app = new Vue({
    el: "#app",
    data: {
        page: "home",
        drawer: false,
        categories: [
            "all",
            "clothing",
            "hunting",
            "books",
            "cards",
            "coins",
            "keychains",
            "comic books",
            "misc"
        ],
        selectedCategory: "all",
        posts: [],
        newTitle: "",
        newAuthor: "",
        newCategory: "",
        newImage: "",
        newText: "",
        serverUrl: "https://gbrack-collectors-blog.herokuapp.com",
    },
    created: function () {
        this.getPosts();
    },
    methods: {
        getPosts: function () {
            fetch(this.serverUrl + "/posts").then(function(res) {
                res.json().then(function(data) {
                    console.log(data);
                    app.posts = data.posts;
                });
            });
        },
        addPost: function () {
            var newPost = {
                title: this.newTitle,
                author: this.newAuthor,
                category: this.newCategory,
                date: new Date(),
                image: this.newImage,
                text: this.newText
            };
            fetch(this.serverUrl + "/posts", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(newPost)
            }).then(function () {
                app.newTitle = "";
                app.newAuthor = "";
                app.newAuthor = "";
                app.newImage = "";
                app.newText = "";
                app.page = "home";
                app.getPosts();
            });
        },
        formatDate: function(post) {
            var date = new Date(post.date);
            return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        },
        selectCategory: function(category) {
            this.selected_category = category;
            this.drawer = false;
        }
    },
    computed: {
        sortedPosts: function () {
            if (this.selectedCategory == "all") {
                return this.posts;
            } else {
                var sortedPosts = this.posts.filter(function (post) {
                    return post.category == app.selectedCategory;
                });
                return sortedPosts;
            }
        }
    }
})
