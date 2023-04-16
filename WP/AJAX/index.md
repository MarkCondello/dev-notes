# [Sending AJAX request in WP](https://wpmudev.com/blog/using-ajax-with-wordpress/)

Sending an Ajax request in WP requires the following requirements:
  - the `admin-ajax.php` file in the request
  - adding a nonce with the `wp_create_nonce()` function and
  - including an `action` name so we can use the action hook `add_action("wp_ajax_NAME_OF_THE_ACTION")`

## PHP implementation
We can use a form or an anchor tag with the required items above to send off a request to `admin-ajax.php`

*php form*
```
@php($nonce = wp_create_nonce("user_vote_nonce"))
<form method="POST" action="{{ admin_url('admin-ajax.php') }}">
  <input type="hidden" name="action" value="user_vote">
  <input type="hidden" name="nonce" value="{{ $nonce }}"> 
  <input type="hidden" name="post_id" value="{{ the_ID() }}"> 
  <button type="submit"
    data-nonce="{{ $nonce }}"
    data-post_id="{{ the_ID() }}"
    class="user_vote"
  >Vote for this post</button>
</form>
```
*php anchor*
```
@php($link = admin_url("admin-ajax.php?action=user_vote&post_id=".get_the_ID()."&nonce=$nonce") )
<a href="{{ $link }}" data-nonce="{{ $nonce }}" data-post_id="{{ the_ID() }}" class="user_vote">Vote for this post</a>
```

Then in our plugin or function, we catch the custom action name *user_vote*, then delegate to a callback, verify the nonce passed in and then process the request.

*The plugin which handles the ajax request*
```
class VoteForPost {
  public function __construct()
  { 
    add_action("wp_ajax_user_vote", [$this, "userVote"]);
    add_action("wp_ajax_nopriv_user_vote", [$this, "goLogin"]);
  }
  public function userVote()
  {
    if(!wp_verify_nonce($_REQUEST["nonce"], 'user_vote_nonce')) {
      exit("No vote for you...");
    }
    $post_id = $_REQUEST["post_id"];
    $vote_count = get_field("vote", $post_id) ?: 0;
    $new_vote_count = $vote_count + 1;
    $vote = update_field('vote', $new_vote_count, $post_id);
    if($vote === false) {
      $result['type'] = 'error';
      $result['votes_count'] = $vote_count;
    } else {
      $result['type'] = 'success';
      $result['votes_count'] = $new_vote_count;
    }
    if($_REQUEST["is_ajax"]) {
        $result = json_encode($result);
        echo $result;
    } else {
      header("Location: ".$_SERVER['HTTP_REFERER']);
    }
    die();
  }
  public function goLogin()
  {
    echo "You mist login to vote.";
    die();
  }
}
$VoteForPost = new VoteForPost();
```

## JS implementation
For the js implementation, its almost the same but we handle setting the path to the `wp-admin-ajax.php` using a wordpress function called localize script. Its here where we can add the path in the site markup:
`localize('site_script', ['ajaxurl' => admin_url( 'admin-ajax.php' ),]`

Here is the markup used in this demo:
```
  <button data-nonce="{{ $nonce }}" data-post-id="{{ the_ID() }}" id="user_vote">Vote for this post.</button>
```

Then in the JS, we grab the data attributes and append those values to a FormData object. We also need to pass in the custom *action* name so when the request reaches *wp-admin-ajax.php* we catch that request with the `wp_ajax_user_vote` action in our plugin:
```
  const userVoteBtn = document.getElementById('user_vote'),
  voteCounter = document.getElementById('vote_counter')

  if (userVoteBtn && voteCounter) {
    userVoteBtn.addEventListener('click', function(ev) {
      ev.preventDefault()

      const ajaxUrl = site_script.ajaxurl,
      post_id = this.dataset.postId,
      nonce = this.dataset.nonce

      let form_data = new FormData
      form_data.append('action', 'user_vote')
      form_data.append('post_id', post_id)
      form_data.append('nonce', nonce)
      form_data.append('is_ajax', true)

      axios.post(ajaxUrl, form_data)
        .then(resp => {
          console.log({data: resp.data})
          voteCounter.innerHTML = resp.data.votes_count
        })
        .catch(err => {
          console.error();
        })
    })
  }
```


## ANOTHER EXAMPLE OF AJAX in WP

Here we have the Ajax Admin plug-in demo from the exercise files. This demo includes three essential functions. The first function includes the JavaScript file. The second function processes or handles the Ajax request. And the third function displays the mark-up for the Ajax form and response data. Additionally, this plug-in requires a JavaScript file. All Ajax requires some sort of JavaScript to send the client request to the server.

We can create an admin page which loads a AJAX request using a plugin with a few functions.
The first enqueue the javascript required for the Ajax request to run using the admin_enqueue_scripts action. Within this function a nonce is also created to prevent against external injection.

// enqueue scripts
function ajax_admin_enqueue_scripts( $hook ) {

	// check if our page
	if ( 'toplevel_page_ajax-admin-example' !== $hook ) return;

	// define script url
	$script_url = plugins_url( '/ajax-admin.js', __FILE__ );

	// enqueue script
	wp_enqueue_script( 'ajax-admin', $script_url, array( 'jquery' ) );

	// create nonce
	$nonce = wp_create_nonce( 'ajax_admin' );

	// define script
	$script = array( 'nonce' => $nonce );

	// localize script
	wp_localize_script( 'ajax-admin', 'ajax_admin', $script );

}
add_action( 'admin_enqueue_scripts', 'ajax_admin_enqueue_scripts' );

The other main function which allows an AJAX requests within the admin area is triggered by the wp_ajax_admin_hook hook.
When a $_POST request is made when submitting the form for an endpoint, the javascript file mentioned above is run. 

// process ajax request
function ajax_admin_handler() {

	// check nonce
	check_ajax_referer( 'ajax_admin', 'nonce' );

	// check user
	if ( ! current_user_can( 'manage_options' ) ) return;

	// define the url
	$url = isset( $_POST['url'] ) ? esc_url_raw( $_POST['url'] ) : false;
    
    // make get request
    $responseGet = wp_safe_remote_get( $url, array( 'method' => 'GET' ) );

    //get_body response
    $body = wp_remote_retrieve_body($responseGet);
    
    echo '<pre>';
    
    if ( ! empty( $body ) ) {
        echo 'Response body for: '. $url . "\n\n";
        print_r( $body);
        
    } else {
        echo 'No results. Please check the URL and try again.';
     }
    
    echo '</pre>';

	// end processing
	wp_die();

}
// ajax hook for logged-in users: wp_ajax_{action}
add_action( 'wp_ajax_admin_hook', 'ajax_admin_handler' );

The following function calls another functions to generate the markup used for the plugin page settings including the form mentioned before:// add top-level administrative menu
function ajax_admin_add_toplevel_menu() {

	add_menu_page(
		'Ajax Example: Admin Area',
		'Ajax Example',
		'manage_options',
		'ajax-admin-example',
		'ajax_admin_display_settings_page', // function to display the settings markup
		'dashicons-admin-generic',
		null
	);

}
add_action( 'admin_menu', 'ajax_admin_add_toplevel_menu' );

Because we are targeting public facing pages, we must define the Ajax URL. For admin facing implementations the Ajax URL was added automatically by WordPress on all pages in the admin area. But for public facing pages, we need to define this value ourselves. 
We do this with the two highlighted lines.
 First, we define the admin URL and then we add it to the inline script here. 


// enqueue scripts
function ajax_public_enqueue_scripts( $hook ) {

	// define script url
	$script_url = plugins_url( '/ajax-public.js', __FILE__ );

	// enqueue script
	wp_enqueue_script( 'ajax-public', $script_url, array( 'jquery' ) );

	// create nonce
	$nonce = wp_create_nonce( 'ajax_public' );

	// define ajax url
	$ajax_url = admin_url( 'admin-ajax.php' ); // this is a WP core file for running AJAX pithing wp_admin directory

	// define script
	$script = array( 'nonce' => $nonce, 'ajaxurl' => $ajax_url );

	// localize script
	wp_localize_script( 'ajax-public', 'ajax_public', $script );

}
add_action( 'wp_enqueue_scripts', 'ajax_public_enqueue_scripts' );

The next important change is the action hook that is used for the Ajax handler function. The first hook we use is for logged in users. It is prefixed by wp_ajax_. For public facing Ajax, we add another hook for users who are not logged in. 

// process ajax request
function ajax_public_handler() {

	// check nonce
	check_ajax_referer( 'ajax_public', 'nonce' );

	// define author id
	$author_id = isset( $_POST['author_id'] ) ? $_POST['author_id'] : false;

	// define user description
	$description = get_user_meta( $author_id, 'description', true );

	// output results
	echo esc_html( $description );

	// end processing
	wp_die();

}
// ajax hook for logged-in users: wp_ajax_{action}
add_action( 'wp_ajax_public_hook', 'ajax_public_handler' );

// ajax hook for non-logged-in users: wp_ajax_nopriv_{action}
add_action( 'wp_ajax_nopriv_public_hook', 'ajax_public_handler' );

So we need both of these hooks to do Ajax on public-facing pages. With both of these hooks we ensure that all users can use the public facing Ajax functionality.  Again we are checking the $_POST global object for values and performing an AJAX request using those values.

Add one more thing to note, our third function in this plug-in displays the markup required to display a learn more link for each post. 

// display markup
function ajax_public_display_markup( $content ) {

	if ( ! is_single() ) return $content;
	$id = get_the_author_meta( 'ID' );
	$url = get_author_posts_url( $id );
	$markup  = '<p class="ajax-learn-more">';
	$markup .= '<a href="'. $url .'" data-id="'. $id .'">';
	$markup .= 'Learn more about the author</a></p>';
	$markup .= '<div class="ajax-response"></div>';
	return $content . $markup;
}
add_action( 'the_content', 'ajax_public_display_markup' );



Find out how to display posts written by a single author with AJAX