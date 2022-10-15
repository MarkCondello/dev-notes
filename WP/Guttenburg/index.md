## Custom Block Setup
In order to build Guttengurb blocks we can use a specific hook to load our custom JS and include the `wp-blocks` as the JS files enqueued script dependency.
The below example is a custom plugin, but it could easily be included in the functions file or include instead by adding the load in footer option as the fifth param:
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
The JS loaded from the enqueued script leverages the `wp` object available from the global scope which is included as a dependency. We can access `wp.blocks.FUNCTIONS` from that globally accessible object. See the working example below:
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
})
```

*Note:* the above example is *not* using JSX, but another function available from the wp global object `element.createElement`. In order to use JSX we must add an extra npm dependency called [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts).

The link above provides an example of the commands we can leverage. In order to use the package, we must add our file to build inside a `src` directory.

After running `npm run start`, a `build` directory will be created with our compiled JS. We need to enqueue this file with the `enqueue_block_editor_assets` function.

With this workflow in place, we can now use JSX. Eg:
```
edit(){
    return <h3>Hello, this is from the admin block editor from JSX.</h3>
}
```

## Adding attributes to edit method and displaying the udpate in the save method
`attributes` are options which can be saved for the block. We set those attributes and access them through the `props` object. See the an example fragment below:
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
As soon save method is changed, WP no longer knows how to generate the content that is being requested. The block becomes unresponsive and WP displays an error: `This block contains unexpected or invalid content.`
To work around this issue, we can use a `deprecated` array to retain the past version of the save method and any associated attributes, so the block can still be rendered.
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
*Note:* this may solve the problem of the WP admin error but it still requires the user to go into everywhere this block is used and save it again to trigger the update.

## Delegate saving block data to PHP
WP has functions named `register_block_type` which allow us define a custom `render_callback` where we can choose how to display block changes and retrieve the updated `attributes` using the functions param.
For this to work, we want to return null from the blocks save method and change the initial setup under the heading `Custom Block Setup` to the below:
```
 public function __construct()
  {
    add_action('init', [$this, 'adminAssets']);
  }
  public function adminAssets()
  {
  ...
  register_block_type('mrc-plugin/are-you-paying-attention', [
      'editor_script' => 'areyoupayginattentionscript',
      'render_callback' => [$this, 'theHTML'], // this is where we delegate saving the block to PHP
    ]);
  }
  public function theHTML($attrs)
  {
    ob_start(); // anything thing that comes after this function is added to the buffer?>
    <h3>Today the sky is completely <?= $attrs["skyColor"] ?> and the grass is <?= $attrs["grassColor"] ?>...</h3>
    <?php
    return ob_get_clean();
  }
```
*The full example explained above can be found in this directory `are-you-paying-attention.zip`*

A more detailed Block example which leverages React on the front end can be found [here](https://github.com/MarkCondello/amazing_university_wp_theme/tree/master/wp-content/plugins/are-you-paying-attention).


## Importing WP components and editor features
To include the generic WP components we need to include a package from `wp-scripts` in our JS file.
```
import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon, PanelBody, PanelRow, ColorPicker } from '@wordpress/components';
```
A list of components which can be included and their options can be found [here](https://developer.wordpress.org/block-editor/reference-guides/components/).

The same is true for the `block-editor` features. See below:
```
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
```
A list of available options to use from `block-editor` can be found [here](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/).

*Gutenburg storybook*
A playground where we can use each of the features available with Gutenburg can be found [here](https://wordpress.github.io/gutenberg/?path=/story/docs-introduction--page).

## Using `wp.data.subscribe` to check block state values
We can tap into the admin interface features like the update button and prevent saves from occuring until the settings on our block have been added correctly. ` wp.data.subscribe()` takes a callback which we can check the current state with. In the example below we check to see if all blocks by a certain name has a specific setting added before allowing the update button to be active.
```
(function() {
  let locked = false
  wp.data.subscribe(function(){ // This fires every time the editor has changed
    // console.log('Editor Change', wp.data.select("core/block-editor").getBlocks())
    const matchingBlocks = wp.data.select("core/block-editor").getBlocks().filter(block => {
      return block.name == "mrc-plugin/are-you-paying-attention" && block.attributes.correctAnswer == undefined
    })
    if (matchingBlocks.length && locked === false){
      locked = true
      wp.data.dispatch("core/editor").lockPostSaving('noanswer')
    }
    if (!matchingBlocks.length && locked){
      locked = false
      wp.data.dispatch("core/editor").unlockPostSaving('noanswer')
    }
  })
})()
```

## Loading front end CSS / JS assets
By leveraging the `render_callback` (like it was mentioned under the *Delegate saving block data to PHP* title ) we can load our scripts and styles which are specific for the block.
In this example our callback is called `theHTML`, and this is where we load the extra assets:
```
 public function theHTML($attrs)
  {
    if (!is_admin()):
      // Load the assets when the block is rendered on the front end
      wp_enqueue_script('attentionfrontend', plugin_dir_url(__FILE__) . '/build/frontend.js', ['wp-element']); // wp-element is WP's version of React
      wp_enqueue_style('attentionfrontend', plugin_dir_url(__FILE__) . '/build/frontend.css');
    endif;
    ...
```
## Loading props data to front end
Using a function similar to the one above, we can pass the $attrs parameter from the `render_callback` and provide that data to a `<pre>` tag like the example below:
```
    ob_start(); // anything that comes after this function is added to the buffer?>
    <div class="paying-attention-block">
      <pre style="display:none;"><?= wp_json_encode($attrs) ?></pre> <!-- Load props data into pre tag -->
    </div>
  <?php
    return ob_get_clean();
```

We can then retrieve the data in the `<pre>` tag using JS and pass the data to a React component like so:
```
import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './frontend.scss'

const payingAttentionBlocks = document.querySelectorAll('.paying-attention-block')

payingAttentionBlocks.forEach(block => {
  const data = JSON.parse(block.querySelector('pre').innerHTML)
  ReactDOM.render(<Quiz {...data}/>, block)
  block.classList.remove('paying-attention-block')
})
```
*Note:* The npm wp-scripts does not included `React` in the build but instead bundles the scripts we create for react to be used on the front end.

## Using block.json to define a block
Leveraging the `block.json` file, we can defined the properties for a block and the assets for the admin. If we are using the `render_callback` function, assets for the front end will not be loaded and so the method descibed under the header above *Loading front end assets for a custom block* should be used instead.

A code example and more details can be found in the codex [here](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)

## Register a custom Guttenburg Block Category area
We can define our own custom block category in our theme like so:
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

## Loading block markup for the front and back end
Similar to what was done under the title *Loading props data to front end*, we can return markup from PHP for both the front end and back end layouts to keep our code DRY.

Instead of working with React and Javascript like the title *Loading props data to front end*, we can instead use PHP and WP methods to generate the content we want to display to the front end and the back end. An example of what can be achieved using this approach ncan be seen in the *generateProfessorHtml()* function [found here](https://github.com/MarkCondello/amazing_university_wp_theme/blob/master/wp-content/plugins/featured-professor/inc/generateProfessorHTML.php)

While this is easy to use for the front end, for the back end we need to leverage the React `usestate`, `useEffect` and the WP `apiFetch` functions.
We also need to setup a custom endpoint to retrieve the markup based on changes to state in our custom block.
In order to set that up, we can do the following in our plugin file:
```
  function __construct() {
    add_action('init', [$this, 'onInit']);
    add_action('rest_api_init', [$this, 'professorHTML']); // this is a callback to create an endpoint
  }
  function professorHTML()
  {
    register_rest_route('featuredProfessor/v1', 'getHTML', [
      'method' => 'GET',
      'callback' => [$this, 'renderCallback'],
    ]);
  }
```
*Note: * to view the result of this function we can go to a url similar to this one: `/wp-json/featuredProfessor/v1/getHTML?professorId=63`, but changing the professorId value with one that exists in the CMS.

In our block Javascript we need to include the extra JS dependencies mentioned above. See the imports which are used below
```
import {useState, useEffect} from "react"
import apiFetch from "@wordpress/api-fetch"
```

Now in our edit method, we can set up the state values to be used to check if a `Professor` selection is made which will generate a preview exactly like how the front end displays it.

```
  const [thePreview, setThePreview] = useState("")
  useEffect(()=>{
    async function go(){
      const response = await apiFetch({
        path: `/featuredProfessor/v1/getHTML?professorId=${props.attributes.professorId}`,
        method: "GET"
      })
      setThePreview(response)
    }
    go()
  }, [props.attributes.professorId])
```
`useEffect()` takes 2 params. The first being the callback, the second is the piece of state to watch for changes. In the example above, we check for changes to the `props.attributes.professorId` value.

*Note:* because `apiFetch()` it is an asynchronous call, we use async / await to retrieve the markup from the endpoint we specified in the plugin PHP file once it is resolved.

With this setup in place, anytime a `professorId` is changed, `useEffect()` will run the callback function, make a request to the endpoint to retrieve the markup generated by the PHP function `generateProfessorHtml($attribute[professorId])`, and update the state property called `thePreview` using the `setThePreview` useState function.

The last thing left to do is present the update in the WP block. This can only be done using `dangerouslySetInnerHTML` due to React not wanting to render markup generated from another source. An example of the usage can be found below:
```
<div dangerouslySetInnerHTML={{__html: thePreview}}></div>
```
The full code example for this implementation can be found [here](https://github.com/MarkCondello/amazing_university_wp_theme/blob/master/wp-content/plugins/featured-professor/)

## Saving block related meta data against the post/page
WP allows us to register a custom meta for us to store values against called [register_meta()](https://developer.wordpress.org/reference/functions/register_meta/). As the name suggests, we can store post meta and define the meta name and data type.
```
register_meta('post', 'featuredprofessor', [
  'show_in_rest' => true,
  'type' => 'number',
  'single' => false, // do not save all the professor Id's in one row, save them to their own row instead
]);
```

Then in the block JS file, we can leverage useEffect() to check for changes to the professorId and trigger an update for this `featuredprofessor` meta using the `wp.data.dispatch("core/editor")`.

A working example of this integration, with notes about how the update and removal of the meta data is done with `useEffect()` can be found here.

A more inclusive list of the available methods which can be used to store data against a post/page with `wp.data` can be found [here](https://salferrarello.com/gutenberg-js/)