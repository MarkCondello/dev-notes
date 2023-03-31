## Filters
A full list of all the filters available in WP can be found in the codex [here](https://codex.wordpress.org/Plugin_API/Filter_Reference).



## the_content
Using the_content() filter allows us to modify the content for posts or pages.
The below implementation adds content to the end of blog posts show pages if it is in the main query.
```
add_filter('the_content', 'blogFooterContent');
function blogFooterContent($content) {
  if(is_single() && is_main_query()) {
    return $content . '<p>Foo Barr Bazzz</p>';
  }
}
```

## (wp_insert_post_data)[https://developer.wordpress.org/reference/hooks/wp_insert_post_data/]
This filter allows us to modify data before it gets saved to the database.
```
//force note posts to be private and strip special characters from being saved to notes content
function makeNotePrivate($data){
    if ($data['post_type'] == 'note') {
        $data['post_content'] = sanitize_textarea_field($data['post_content']);
    }
    if ($data['post_type'] == 'note' && $data['post_status'] != 'trash'){
        $data['post_status'] = 'private';
    }
    return $data;
}
add_filter('wp_insert_post_data', 'makeNotePrivate');
```