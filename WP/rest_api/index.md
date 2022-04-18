# WP's REST API

Accessing the REST API can be done by visiting this URL:
`localhost:3000/wp-json/wp/v2/posts`

This is also true of the JavaScript code we write. When we include a URL in our JS code you can actually remove the base part of your domain entirely, and just begin the URL with a slash character, like this:
`$.getJSON("/wp-json/wp/v2/posts?search…`

## Global Parameters
The WP REST API has various options available which can be [found here](https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/).
Making a GET request for a specific page or post title with predefined fields in the payload can be done with AXIOS:
```
axios.get('/wp-json/wp/v2/pages?search=SOME_PAGE_TITLE&_fields=id,title.link')
  .then(resp => console.log({resp}))
```

## Endpoints
A list of all the endpoints available can be found [here](https://developer.wordpress.org/rest-api/reference/#rest-api-developer-endpoint-reference)

##CRUD operations
While making GET requests is simple with the REST API, the other CRUD operations require authentication.

We can install the [Basic Auth plugin](https://github.com/WP-API/Basic-Auth) to allow us to pass username and password details for local or SSL secured websites.

We can [hardcode the authentication](https://www.youtube.com/watch?v=LuoZL4UnV34) by passing the username and password values with the Authorization request headers:

`echo "Basic.base64_encode('user:password')";`

***These settings work with Postman requests, but when adding the same header to AXIOS, it does not..***

<!-- This plugin may be helpful for making async requests: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/ -->