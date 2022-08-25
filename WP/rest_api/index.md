# WP's REST API

Accessing the REST API can be done by visiting this URL:
`localhost:3000/wp-json/wp/v2/posts`

This is also true of the JavaScript code we write. When we include a URL in our JS code, you can actually remove the base part of your domain entirely, and just begin the URL with a slash character, like this:
`$.getJSON("/wp-json/wp/v2/posts?search…`

## Global Parameters
The WP REST API has various options available which can be [found here](https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/).

## Endpoints
A list of all the endpoints available can be found [here](https://developer.wordpress.org/rest-api/reference/#rest-api-developer-endpoint-reference)

## CRUD operations
While making GET requests is simple with the REST API, the other CRUD operations require authentication.

<!-- We can install the [Basic Auth plugin](https://github.com/WP-API/Basic-Auth) to allow us to pass username and password details for local or SSL secured websites.

We can [hardcode the authentication](https://www.youtube.com/watch?v=LuoZL4UnV34) by passing the username and password values with the Authorization request headers:

`echo "Basic.base64_encode('user:password')";` -->

<!-- ***These settings work with Postman requests, but when adding the same header to AXIOS, it does not..*** -->

<!-- This plugin may be helpful for making async requests: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/ -->

### Read

Making a GET request for a specific page or post title with predefined fields in the payload can be done without authentication:
```
axios.get('/wp-json/wp/v2/pages?search=SOME_PAGE_TITLE&_fields=id,title.link')
  .then(resp => console.log({resp}))
```

### Delete
To create a delete request, we must authenticate the request by using a `nonce` or *Number Used Once* header. To set this up, we can use the `wp_localize_script()` function and use the `wp_create_nonce(**NAME OF NONCE**)` and reuse that value. See the details below:

```
    wp_localize_script('university_main_scripts', 'siteData', [
            'root_url' => get_site_url(),
            'nonce' => wp_create_nonce('wp_rest'), // Number used once
        ]
    );
```

Then over in our Javascript, we can retieve the `nonce` by referencing `SiteData.nonce` as our value for the header parameter called 'X-WP-Nonce'. See the [documentation here](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/) and view code example below:
```
 deleteNote() {
    const noteId = $(this).data('noteId')
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', siteData.nonce) //Number used once
      },
      url: `${uniData.root_url}/wp-json/wp/v2/note/${noteId}`,
      type: 'DELETE',
      success: (response) => {
        console.log('Successful: ', response)
      },
      error: (response) => {
        console.log('Unsuccessful: ', response)
      },
    })
  }
```
An example of sending headers with [Axios](https://stackoverflow.com/questions/45578844/how-to-set-header-and-options-in-axios).

### Update