## the_content()
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