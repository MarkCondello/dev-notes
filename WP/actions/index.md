## [ShortCodes](https://www.smashingmagazine.com/2012/05/wordpress-shortcodes-complete-guide/)

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
        if ($latestPosts->have_posts()){
             $html = "<ul style='border: 1px solid ". $border_color ."; padding: 1rem;'>";
            while ($latestPosts->have_posts()){
                $latestPosts->the_post();
                $html .= "<li><a href=". get_permalink() .">". get_the_title() ."</a></li>";
            }
            if($content) {
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