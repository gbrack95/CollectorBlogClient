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

        editTitle: "",
        editAuthor: "",
        editCategory: "",
        editImage: "",
        editText: "",
        editId: "",

        secretKey: "",
        serverUrl: "https://gbrack-collectors-blog.herokuapp.com",
        // serverUrl: "http://localhost:8080",
    },
    created: function () {
        this.getPosts();
        window.addEventListener("keyup", this.keyEvents);
    },
    methods: {
        delPost: function (post) {
            fetch(`${this.serverUrl}/posts/${post._id}`, {
                method: "DELETE"
            }).then(function (response) {
                if (response.status == 204) {
                    console.log("It worked!");
                    app.getPosts();
                } else if (response.status == 400) {
                    response.json().then(function (data) {
                        alert(data.msg);
                    });
                }
            });
        },
        keyEvents: function (event) {
            console.log(event.which);
            if (event.which == 68) {
                if (this.secretKey == "") {
                    this.secretKey = "D"
                } else {
                    this.secretKey = "";
                }
            } else if (event.which == 69) {
                if (this.secretKey == "D") {
                    this.secretKey = "DE"
                } else {
                    this.secretKey = "";
                }
            } else if (event.which == 76) {
                if (this.secretKey == "DE") {
                    this.secretKey = "DEL"
                } else {
                    this.secretKey = "";
                }
            } else {
                this.secretKey = "";
            }
        },
        getPostById: function (post) {
            app.editId = post._id;
            fetch(`${this.serverUrl}/posts/${post._id}`).then(function(res) {
                res.json().then(function(data) {
                    console.log(data);
                    app.editTitle = data.post.title;
                    app.editAuthor = data.post.author;
                    app.editCategory = data.post.category;
                    app.editImage = data.post.image;
                    app.editText = data.post.text;
                    app.page = 'edit';
                });
            });
        },
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
                app.newCategory = "";
                app.newImage = "";
                app.newText = "";
                app.page = "home";
                app.getPosts();
            });
        },
        updatePost: function() {
            var editPost = {
                title: this.editTitle,
                author: this.editAuthor,
                category: this.editCategory,
                date: new Date(),
                image: this.editImage,
                text: this.editText
            };
            fetch(`${this.serverUrl}/posts/${this.editId}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(editPost)
            }).then(function () {
                app.editTitle = "";
                app.editAuthor = "";
                app.editCategory = "";
                app.editImage = "";
                app.editText = "";
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
        showDel: function () {
            return this.secretKey == "DEL";
        },
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
