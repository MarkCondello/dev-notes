## Custom Search Wordpress

The JSON data for all the pages and posts can be seen using the following URLs:
SITEDOMAIN/wp-json/wp/v2/pages OR
SITEDOMAIN/wp-json/wp/v2/posts
We can add extra query strings at the end to refine a search query

?per_page=“string” OR
?search=award

Using jQuery we can create a query using the getJSON method

$.getJSON(url, callback)

A working example can be found below:
 $.getJSON('http://localhost:3000/amazing_university/wp-json/wp/v2/posts?search=' + this.searchField.val()
, function(posts){
            alert(posts[0].title.rendered);
});

A more completed version which uses conditional logic for queries with no results is below. This version uses a relative url using wp_localize_script values (uniData.root_url) added in functions.php
//more details on localise script can be found here: https://developer.wordpress.org/reference/functions/wp_localize_script/ This function create a javascript variable in the DOM to retrieve key value pairs from.

        $.getJSON(uniData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val(), (posts) => {
//bind function to the class using es6 arrow function
            console.log(posts.length, posts);
            this.searchResults.html(`
            <h2 class="search-overlay__section-title">General Information</h2>

            ${posts.length ? '<ul class="link-list min-list">' : '<p>no results found</p>'}
            ${posts.map(item => `<li><a href="${item.link}"> ${item.title.rendered } </a></li>`).join('')}
            ${posts.length ? ' </ul>' : "" }
        
            `);

A synchronous version which checks for pages and posts but not custom posts can be found here:
 getResults(){
        this.isSpinnerVisible = false;
  
        //relative url using wp_localize_script values added in functions.php
        $.getJSON(uniData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val(), (posts) => {//bind function to the class using es6 arrow function
           // console.log(posts.length, posts);
           $.getJSON(uniData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val(), pages =>{
            var combinedResults = posts.concat(pages);

            this.searchResults.html(`
            <h2 class="search-overlay__section-title">General Information</h2>

            ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>no results found</p>'}
            ${combinedResults.map(item => `<li><a href="${item.link}"> ${item.title.rendered } </a></li>`).join('')}
            ${combinedResults.length ? ' </ul>' : "" }
        
            `);
            this.isSpinnerVisible = false;
           });
        });
    }

Asynchronous version
Jquery’s .when() method allows for multiple requests to be made within its parenthesis.
Query’s .then() method waits till all the requests are completed so we can process the data received from the .when method. See below for the basic structure:
        $.when(a, b).then((one, two)=>{
        });
The a request will return data to the one parameter in the then() method, while the b request will return data to the two parameter.
The real code example can be found below:
    getResults(){
        $.when(
            $.getJSON(uniData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val()), 
            $.getJSON(uniData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val())
            )
            .then((posts, pages)=>{
            var combinedResults = posts[0].concat(pages[0]);

            this.searchResults.html(`
            <h2 class="search-overlay__section-title">General Information</h2>

            ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>no results found</p>'}
            ${combinedResults.map(item => `<li><a href="${item.link}"> ${item.title.rendered } </a></li>`).join('')}
            ${combinedResults.length ? ' </ul>' : "" }
        
            `);
            this.isSpinnerVisible = false;
        });
    }

The then() method provides additional data about the request. We can target just the specific data we need by targeting the first value in both the posts and the pages arrays with the [0] index.

The then() method also allows for a second parameter if there is a failed request. This allows us to provide user feedback if an error occurs.
            .then((posts, pages)=>{
            var combinedResults = posts[0].concat(pages[0]);
		…
            this.isSpinnerVisible = false;
            }, ()=> {
                this.searchResults.html('<p>Unexpected error; please try again.</p>');
            }
        );

 



