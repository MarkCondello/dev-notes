## Adding a settings admin menu item

We can add an options page using Advanced Custom Field's `acf_add_options_page()` function.
With this setting enabled, we can add fields to this global settings area which should apply changes to the entire site.

```
if( function_exists('acf_add_options_page') ) {
    
    acf_add_options_page(array(
        'page_title'    => 'Theme General Settings',
        'menu_title'    => 'Theme Settings',
        'menu_slug'     => 'theme-general-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));

    acf_add_options_sub_page(array(
        'page_title'    => 'Developer',
        'menu_title'    => 'Developer',
        'parent_slug'   => 'theme-general-settings',
    ));
}
```

*The code above was used to add Site Logos, Social and Sign up links and global CTA's.*