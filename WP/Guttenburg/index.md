
## Register Guttenburg Block Category area:
```
function sgy_blocks( $categories ) {
    $category_slugs = wp_list_pluck( $categories, 'slug' );
    return in_array( 'sgy', $category_slugs, true ) ? $categories : array_merge(
        $categories,
        array(
            array(
                'slug'  => 'sgy',
                'title' => __( 'SGY Blocks', 'sgy' ),
                'icon'  => null,
            ),
        )
    );
}

add_filter( 'block_categories', __NAMESPACE__.'\\sgy_blocks' );
```