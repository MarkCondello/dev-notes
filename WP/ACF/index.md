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

In the ACF UI, we set The location settings to be:
Options Page is equal to Theme General Settings.

The settings saved against this group can be called like so:

```
//Social
$facebook = get_field('facebook', 'options');
$instagram = get_field('instagram', 'options');
$twitter = get_field('twitter', 'options');
$linkedin = get_field('linkedin', 'options');
$newsletter = get_field('news_letter_signup', 'options');
```

Settings like these could also be usefule for adding API keys. The developer Sub menu has options for doing just that.

We just need to register the key with ACF:

```
function my_acf_google_map_api( $api ){
    $api['key'] = get_field('google_maps_api_key', 'options');
    return $api;
}

add_filter('acf/fields/google_map/api', __NAMESPACE__.'\\my_acf_google_map_api');
```


## Register Guttenburg Block areas:

```
function yoke_blocks( $categories ) {
    $category_slugs = wp_list_pluck( $categories, 'slug' );
    return in_array( 'yoke', $category_slugs, true ) ? $categories : array_merge(
        $categories,
        array(
            array(
                'slug'  => 'yoke',
                'title' => __( 'Yoke Blocks', 'yoke' ),
                'icon'  => null,
            ),
        )
    );
}

add_filter( 'block_categories', __NAMESPACE__.'\\yoke_blocks' );
```