## Register the plugin
In order to have a plugin registered with the WP system is to add the following required comments:

```
/*
  Plugin Name: Footer content for blog posts
  Description: A plugin for adding content to the bottom of blog posts.
  Version: 1.0
  Author: MarkCond
  Author URI: https://markcondello.com.au
*/
```

## Adding the admin menu
It is best practice to use a class to avoid naming collisions with other plugins and WP's internal functions.
There are 2 main WP functions used to set up an admin menu page.
 - [admin_menu](https://developer.wordpress.org/reference/hooks/admin_menu/)
 - [add_options_page](https://developer.wordpress.org/reference/functions/add_options_page/)

In the demo below we use a unique class name and instantiate it. 
The constructor calls the admin_menu action which runs the callback to set up the menu page using the add_options_page helper function. See the documentation for add_options_page() for the options it provides.

See the below demo code which sets the admin menu page to the settings menu:

```
class WordCountAndTimePlugin {
  public function __construct() {
    add_action('admin_menu', [$this, 'adminPage']);
  }
  public function adminPage() {
    add_options_page('Word count settings', 'Word Count', 'manage_options', 'word-count-settings', [$this, 'settingsMarkup']);
  }
  public function settingsMarkup() {
    ?>
    <div class="wrap">
      <h1>WordCount settings.</h1>
      <p>This is the settings page for WORD COUNT...</p>
    </div>
  <?php
  }
}

$wordCountAndTimePlugin = new WordCountAndTimePlugin();
```

## Saving Settings
All plugin settings are stored in the wp_options table.

```
 public function __construct() {
   ...
    add_action('admin_init', [$this, 'settings']);
  }
  public function settings() {

   add_settings_section('wcp_first_section', 'A place where the meta information will be displayed.', null, 'word-count-settings');
   
   add_settings_field('wcp_location', 'Display Location', [$this, 'LocationHTML'], 'word-count-settings', 'wcp_first_section');

    register_setting('word_count_plugin', 'wcp_location', 
    [
      'sanitize_callback' => 'sanitize_text_field', // WP's santize function
      'default' => '0'
    ]);
  }
  public function locationHTML() { ?>
  <select name="wcp_location"><!-- The name provided for the field is the same that was used in the WP add_settings_field() helper function -->
    <option value="0">Top</option>
    <option value="1">Bottom</option>
  </select>
<?php
  }
  ...
   public function settingsMarkup() {
    ?>
    <div class="wrap">
      <h1>WordCount settings.</h1>
      <form action="options.php" method="POST"> // WP will use options.php to post all the field settings created.
        <?php
          settings_fields('word_count_plugin'); // this handles the nonce settings and the fields validation
          do_settings_sections('word-count-settings'); // WP looks for sections set by the add_settings_section() WP function to the word-count-settings url and display those sections here
          submit_button(); // default WP button
        ?>
      </form>
     </div>
  <?php
  }
  ```

With the single section in place with the options input added to the form, we can save values to the wp_options table. 
Currently those settings are not recorded in the form.