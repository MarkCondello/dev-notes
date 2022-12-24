## Actions
A full list of all the actions available in WP can be found in the codex [here](https://codex.wordpress.org/Plugin_API/Action_Reference).

WP has many hooks to hook into. Most pass a postId as a return value like `save_post`. See an example of save post which logs a message each time a post / page is saved:
```
add_action('save_post', 'log_when_saved');
function log_when_saved($post_id){
  if(!(wp_is_post_revision($post_id)) || wp_is_post_autosave($post_id)){
    return;
  }
  $post_log = get_stylesheet_directory() . '/post_log.txt';
  $message = get_the_title($post_id) . ' was just saved!';
  if(file_exists($post_log)) {
    $file = fopen($post_log, 'a');
    fwrite($file, $message."\n");
  } else {
    $file = fopen($post_log, 'w');
    fwrite($file, $message."\n");
  }
  fclose($file);
}
```

## do_action()
Actions also allow us to add our own actions using `do_action()`. This function allows us to pass values as a second paramater when that action is called.

```
add_action('template_redirect', function(){
  if(is_page('super-secret') && ! is_user_logged_in()) {
    do_action('user_redirected', date("F j, Y, g:i a")); // do_action() makes an action available when this event occurs
    wp_redirect('home');
    die();
  }
});

add_action('user_redirected', function($date){
  $post_log = get_stylesheet_directory() . '/access_log.txt';
  $message = 'Someone just tried to access our super secret page on ' . $date;
  if(file_exists($post_log)) {
    $file = fopen($post_log, 'a');
    fwrite($file, $message."\n");
  } else {
    $file = fopen($post_log, 'w');
    fwrite($file, $message."\n");
  }
  fclose($file);
});
```

The example above redirects users if access a specific page and are not logged in. We opened a `do_action()` hook named 'user_redirected' which passes the date/ time and is then run with the add_action 'user_redirected'. This function logs a message to a log file. The tutorial explaining this code can be found (here)[https://www.youtube.com/watch?v=9GuJi8dYuAs].


## [ShortCode action](https://www.smashingmagazine.com/2012/05/wordpress-shortcodes-complete-guide/)

Shortcodes are snipppets which can be applied in the WP content edit areas.

We register a shortcode using the add_shortcode() helper function.
We can pass predefined properties to the shortcode using underscore seperator syntax for the properties.

This shortcode `[recent-posts posts="3" border_color="red"]` has 2 properties available with fallbacks included with the shortcode_atts(ARRAY) function.

The below is the implementation of the recent-posts shortcode:
```
add_action('init', function(){
    add_shortcode('recent-posts', function($attrs, $content = null){
        extract(shortcode_atts([
            'posts' => 4,
            'border_color' => 'gray',
        ], $attrs));
        $latestPosts = new WP_Query([
            'post_type' => 'post',
            'posts_per_page' => $posts,
            'orderby' => 'date',
            'order' => 'DESC'
        ]);
        $html = '<p>There are no latest posts...</p>';
        if ($latestPosts->have_posts()) {
            $html = "<ul style='border: 1px solid ". $border_color ."; padding: 1rem;'>";
            while ($latestPosts->have_posts()) {
                $latestPosts->the_post();
                $html .= "<li><a href=". get_permalink() .">". get_the_title() ."</a></li>";
            }
            if ($content) {
                $html .= "<li>". $content ."</li>";
            }
            $html .= "</ul>";
        }
        wp_reset_query();
        return $html;
    });
});
```

We can pass in slot content for the shortcode like this `[recent-posts posts="3" border_color="red"]This is the slot content...[/recent-posts]`