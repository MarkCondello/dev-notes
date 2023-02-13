# Setup custom API endpoint

There are 2 WP function which allow for the creation of new routes in WP. Those are:
 - `rest_api_init` action
 -  [`register_rest_route('namespace', endpoint, params)`](https://developer.wordpress.org/reference/functions/register_rest_route/)

The params used on `register_rest_route` usually includes `method` & `callback`.


## Callback function for endpoint
A `$request` object is available in the callback which is used to retrieve query params from the endpoint eg `$request['term']` would correspond to `?term="SOME_TERM"`.

Within the callback function, we can use WP_Query or any WP functions to process the `$request` how we want.

A working example created in the [Udemy course](https://www.udemy.com/course/become-a-wordpress-developer-php-javascript/learn/lecture/7837916) is below:

```
function universityRegisterSearch() {
  register_rest_route('university/v1', 'search', [
    'method' => 'GET', // WP_REST_SERVER::READABLE
    'callback' => 'universitySearchResults',
  ]);
}
add_action('rest_api_init', 'universityRegisterSearch');

function universitySearchResults ($request) {
  // arrays get converted to valid JSON
  $query = new WP_Query([
    'post_type' => ['post', 'page', 'professor', 'program', 'campus', 'event'],
    's' => filter_var($request['term'], FILTER_SANITIZE_URL), // sanitize the param 'term'
  ]);
  $results = [
    'generalInfo' => [],
    'professors' => [],
    'programs' => [],
    'events' => [],
    'campuses' => [],
  ];
  while($query->have_posts()):
    $query->the_post();
    ...
```

## Register multiple routes with different Request types
Similar to the example above, we can add multiple route endpoints for the various request types we want to make:
```
function registerLikeRoutes() {
  register_rest_route('university/v1', 'add-like', [
    'methods' => 'POST',
    'callback' => 'addLike',
  ]);
  register_rest_route('university/v1', 'delete-like', [
    'methods' => 'DELETE',
    'callback' => 'deleteLike',
  ]);
}
add_action('rest_api_init', 'registerLikeRoutes');

function addLike () {
  return 'Thanks for trying to create a like';
}
function deleteLike () {
  return 'Thanks for trying to delete a like';
}
```