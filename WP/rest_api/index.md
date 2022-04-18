# WP's REST API

Accessing the REST API can be done by visiting this URL:
`localhost:3000/wp-json/wp/v2/posts`

This is also true of the JavaScript code we write. When we include a URL in our JS code you can actually remove the base part of your domain entirely, and just begin the URL with a slash character, like this:
`$.getJSON("/wp-json/wp/v2/posts?search…`

