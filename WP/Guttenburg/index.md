## Custom Block Setup
In order to build Guttengurb blocks we need to use a specific hook to load our custom JS and use `wp-blocks` as the JS files enqueued script dependency.
The below example is a custom plugin, but it could easily be included in the functions file or include instead:
```
class AreYouPayingAttention{
  public function __construct()
  {
    add_action('enqueue_block_editor_assets', [$this, 'adminAssets']);
  }
  public function adminAssets()
  {
    wp_enqueue_script('areyoupayginattentionscript', plugin_dir_url(__FILE__) . 'test.js', ['wp-blocks']);
  }
}
$payingAttention = new AreYouPayingAttention();
```
The JS loaded leverages the `wp` object available from the global scope. We can access blocks.FUNCTIONS from that globally accessible object. See the working example below:
```
wp.blocks.registerBlockType('mrc-plugin/are-you-paying-attention', {
  title: 'Are you paying attention?',
  icon: 'smiley',
  category: 'common',
  edit(){
    return wp.element.createElement('h3', null, 'Hello, this is from the admin block editor')
  },
  save(){
    return wp.element.createElement('h3', null, 'Hello, this is from the front end website.')
  },
})```

*Note:* the above example is *not* using JSX, but another function available from the wp global object `element.createElement`. In order to use JSX we must add an extra npm dependency called [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts).

The link above provides an example of the commands we can leverage.
In order to use the package, we must add our file to build inside a `src` directory.

After running `npm run start`, a `build` directory will be created with our compiled JS.
We need to enqueue this file with the `enqueue_block_editor_assets` function.

With this workflow in place, we can now use JSX. Eg:
```
edit(){
    return <h3>Hello, this is from the admin block editor from JSX.</h3>
}
```

## Adding attributes to edit method and displaying the udpate in the save method
`Attributes` are options which can be saved for the block. We set those attributes and access them through props. See the an example fragment below:

```
  attributes: {
    skyColor: {type: "string", },
    grassColor: {type: "string", },
  },
  edit(props){
    const handleSkyColorChange = (ev) => {
      props.setAttributes({skyColor: ev.target.value})
    }
    return (
      <div>
        <input type="text" placeholder="sky colour" value={props.attributes.skyColor} onChange={handleSkyColorChange} />
    ...
```

## Issue with changing source code
As soon save method is changed, WP no longer knows how to generate the content that is being requested. The block becomes unresponsive and WP displays an error.
In order to work around this, we can use a `deprecated` array to retain the pasr version of the save method and any associated attributes, so the block can still be rendered.
```
  save(props){
    return (
      <h3>Today, the sky is <span className="skyColor">{props.attributes.skyColor}</span> and the grass is <span class="grassColor">{props.attributes.grassColor}</span>. Foo</h3>
    )
  },
  deprecated: [{
    attributes: {
      skyColor: {type: "string", },
      grassColor: {type: "string", },
    },
    save(props){
      return (
        <h3>Today, the sky is <span className="skyColor">{props.attributes.skyColor}</span> and the grass is <span class="grassColor">{props.attributes.grassColor}</span>.</h3>
        )
      },
    }
  ]
```
*Note:* this may solve the problem of the WP admin error but it still requires the user to go into every post, custom post type or page  where this block is used and save it again to generate the update.

## Delegate saving block data to PHP




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