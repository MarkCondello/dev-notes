## WP Nonces 

Nonces enable us to verify the origin and intent of any submitted form request. This is a security measure used if we want to ensure that users are not accessing the site remotely and are in fact logged in or registered as admins.

The first function displays a form that collects the user's favorite music. To improve the security of this form, we add a nonce field here using the wp_nonce_field function.  
```
// display form
function myplugin_form_favorite_music() {
	?>
	<form method="post">
		<p><label for="music">What is your favorite music?</label></p>
		<p><input id="music" type="text" name="myplugin-favorite-music"></p>
		<p><input type="submit" value="Submit Form"></p>
		<?php wp_nonce_field('myplugin_form_action', 'myplugin_nonce_field', false ); ?>
	</form>
<?php
}
```

To see the hidden nonce field, we can inspect the source code. We can see the hidden nonce field included right here.

The name of this field is `myplugin_nonce_field`, and the value is the nonce itself. So when the form is submitted, this nonce will be included, enabling us to verify the data. 
Looking closer at the `wp_nonce_field` function, we specify the name of the nonce action, and also specify the name of the nonce field. We want to be as specific as possible when naming these parameters. When the form is submitted, we use this function to handle the request. 

```
// process submitted form
function myplugin_process_favorite_music() {

	// get tte nonce
	if ( isset( $_POST['myplugin_nonce_field'] ) ) {
		$nonce = $_POST['myplugin_nonce_field'];
	} else {
		$nonce = false;
	}

	// process form
	if ( isset( $_POST['myplugin-favorite-music'] ) ) {
		// verify nonce
		if ( ! wp_verify_nonce( $nonce, 'myplugin_form_action' ) ) {
			wp_die( 'Incorrect nonce!' );
		} else {
			$fav_music = sanitize_text_field( $_POST[ 'myplugin-favorite-music' ] );
			if ( ! empty( $fav_music ) ) {
				echo '<p>Your favorite music is '. $fav_music .'.</p>';
			} else {
				echo '<p>Please enter your favorite music!</p>';
			}
		}
	}
}
```

First we get the value of the submitted nonce, and then we verify it here using the wp_verify_nonce function. So if the nonce is not valid, the script is terminated via the wp_die function. Otherwise, if the nonce is valid, then we continue processing the form as usual. 

So if someone tries to submit the form from another location, the nonce will fail and the form will not be processed. 