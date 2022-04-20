## Register the plugin
In order to have a plugin registered with the WP system, the following comments with the relevant details are required:

```
/*
  Plugin Name: Word / Character Count & Read-time
  Description: Word and character count with read time for content on blog posts
  Version: 1.0
  Author: MarkCond
  Author URI: https://markcondello.com.au
*/
```

## Adding the admin menu
It is best practice to use a class to avoid naming collisions with other plugins and WP's internal functions.
There are 2 main WP functions used to set up an admin menu page.
 - [admin_menu()](https://developer.wordpress.org/reference/hooks/admin_menu/)
 - [add_options_page()](https://developer.wordpress.org/reference/functions/add_options_page/)

In the demo below we use a unique class name and instantiate it. 
The constructor calls the admin_menu action which runs the callback to set up the menu page using the add_options_page helper function. See the documentation for add_options_page() for the options it provides.

See the below demo code which sets the admin menu page to the settings menu:

```
class WordCountAndReadTime {
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

$wordCountAndReadTime = new WordCountAndReadTime();
```

***The code `[$this, 'CLASS_METHOD']` in the hook functions eg(`add_HOOK_NAME('HOOK_FUNCTION', [$this, 'CLASS_METHOD'])`) is how we can provide a reference to the *this* instance to the WP function so WP knows where to find the class method. ***

## Saving Settings
All plugin settings are stored in the wp_options table.

These WP functions listed are used in the update to the plugin below and are used to add settings, include settings to the options.php form  and validate inputs:
  - [add_settings_section()](https://developer.wordpress.org/reference/functions/add_settings_section/)
  - [add_settings_field()](https://developer.wordpress.org/reference/functions/add_settings_field/)
  - [register_settings()](https://developer.wordpress.org/reference/functions/register_setting/)
  - [register_settings()](https://developer.wordpress.org/reference/functions/register_setting/)
  - [settings_fields()](https://developer.wordpress.org/reference/functions/settings_fields/)
  - [settings_fields()](https://developer.wordpress.org/reference/functions/settings_fields/)
  - [do_settings_sections()](https://developer.wordpress.org/reference/functions/do_settings_sections/)

In the code example below, we've added another action to the construct() method which includes the settings on the *word-count-settings* page created earlier.

Comments for various sections have been included in the code example below:
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

With the single settings section in place which holds the select options input added to the form, we can save values to the wp_options table.
Currently those settings are not recorded in the form when we reload the page.

## Retrieving saved settings and adding extra fields

We can retrieve the saved values using WP's helper function get_option() and add that value to the inputs we create.

The list of WP functions added with the update below are listed:
- [get_option()](https://developer.wordpress.org/reference/functions/get_option/)
- [selected()](https://developer.wordpress.org/reference/functions/selected/)
- [checked()](https://developer.wordpress.org/reference/functions/checked/)

The update to retrieve the values stored for the wcp_location field is below:
```
public function locationHTML() { ?>
  <select name="wcp_location">
    <option value="0" <?php selected(get_option('wcp_location'), '0') ?>>Top</option>
    <option value="1" <?php selected(get_option('wcp_location'), '1') ?>>Bottom</option>
  </select>
<?php
  }
```

We can now roll out additional fields using a similar structure to what was already created by copying the add_settings_field() and the register_setting() functions.

See the update for a input text field below:

```
 public function settings() {
    ...
    add_settings_field('wcp_headline', 'Headline Text', [$this, 'headlineHTML'], 'word-count-settings', 'wcp_first_section');
    register_setting('word_count_plugin', 'wcp_headline', 
    [
      'sanitize_callback' => 'sanitize_text_field', // WP's santize function
      'default' => 'Post Statistics'
    ]);
  }
  ...
    public function headlineHTML() { ?>
  <input type="text" name="wcp_headline" value="<?= esc_attr(get_option('wcp_headline')) ?>" placeholder="The headline for the meta info.">
  <?php
  }
```

Very similar to the selected() WP function, we can use the checked() WP function for checkboxes and radio buttons. This function sets the value to *on* if checked and null if not.

```
  public function wordCountHTML() { ?>
    <input type="checkbox" name="wcp_word_count" <?php checked(get_option('wcp_word_count'), 'on') ?>>
    <?php
  }
```

## Custom field sanitization

Instead of using the *sanitize_text_field* provided by WP, we can specify a method to check the value entered is valid.

In this example we check if the *wcp_location* input has a value of either '0' or '1'

```
public function settings () 
{
  ...
   register_setting('word_count_plugin', 'wcp_location', 
    [
      'sanitize_callback' => [$this, 'sanitizeLocation'], // custom santize method
      'default' => '0'
    ]);
  ...
}
...
public function sanitizeLocation($input) {
  if($input !== '0' && $input !== '1') {
    add_settings_error('wcp_location', 'wcp_location_error', 'Display location must be Top or Bottom.');
    return get_option('wcp_location');
  }
  return $input;
}
```

This custom method retrieves the input value as a paramter and we can check the value is what is expected. If it is not, we return with the original value, if it is, we persist it in the database.

# Displaying changes on the Front End

In order to apply the settings changes to the front end, we can use a [filter called *the_content*](https://developer.wordpress.org/reference/hooks/the_content/). In the example below, we check if the current page is a post show page and if it is running the main WP_Query() before presenting the plugin  content selected from the admin.

```
 public function __construct() 
  {
    ...
    add_filter('the_content', [$this, 'ifWrap']);
  }
   public function ifWrap($content)
  {
    if(is_single() && is_main_query() &&
        (
          get_option('wcp_word_count', '1') ||
          get_option('wcp_character_count', 'on') ||
          get_option('wcp_read_time', 'on')
        )
      ) {
      return $this->frontEndHTML($content);
    }
    return $content;
  }
  public function frontEndHTML($content)
  {
    $html = '<h3>' . esc_html(get_option('wcp_headline', 'Post Meta')) .'</h3>';
    if (get_option('wcp_word_count', 'on') == 'on' || get_option('wcp_read_time', 'on') == 'on') {
      $wordCount = str_word_count(strip_tags($content));
    }
    if (get_option('wcp_word_count', 'on') == 'on') {
      $html .= '<p>This post has ' . $wordCount . ' words.</p>';
    }
    if (get_option('wcp_character_count', 'on') == 'on') {
      $html .= '<p>This post has ' . strlen(strip_tags($content)) . ' characters.</p>';
    }
    if (get_option('wcp_read_time', 'on') == 'on') {
      $timeToRead = round(($wordCount/225), 2);
      $html .= '<p>This post takes approx '.$timeToRead .' minute(s) to read.</p>';
    }
    if (get_option('wcp_location', '0') === '0') {
      return $html . $content;
    }
    return $content . $html;
  }
  ...
```

** Note:** we are using esc_html() in case meliscious code is added to the headline content.

The complete working example is below:
```
<?php

/*
  Plugin Name: Word / Character Count & Read-time
  Description: Word and character count with read time for content on blog posts
  Version: 1.0
  Author: MarkCond
  Author URI: https://markcondello.com.au
*/

class WordCountAndReadTime {
  public function __construct() 
  {
    add_action('admin_menu', [$this, 'adminPage']);
    add_action('admin_init', [$this, 'settings']);
    add_filter('the_content', [$this, 'ifWrap']);
  }
  public function ifWrap($content)
  {
    if(is_single() && is_main_query() &&
        (
          get_option('wcp_word_count', '1') ||
          get_option('wcp_character_count', 'on') ||
          get_option('wcp_read_time', 'on')
        )
      ) {
      return $this->frontEndHTML($content);
    }
    return $content;
  }
  public function frontEndHTML($content)
  {
    $html = '<h3>' . esc_html(get_option('wcp_headline', 'Post Meta')) .'</h3>';
    if (get_option('wcp_word_count', 'on') == 'on' || get_option('wcp_read_time', 'on') == 'on') {
      $wordCount = str_word_count(strip_tags($content));
    }
    if (get_option('wcp_word_count', 'on') == 'on') {
      $html .= '<p>This post has ' . $wordCount . ' words.</p>';
    }
    if (get_option('wcp_character_count', 'on') == 'on') {
      $html .= '<p>This post has ' . strlen(strip_tags($content)) . ' characters.</p>';
    }
    if (get_option('wcp_read_time', 'on') == 'on') {
      $timeToRead = round(($wordCount/225), 2);
      $html .= '<p>This post takes approx '.$timeToRead .' minute(s) to read.</p>';
    }
    if (get_option('wcp_location', '0') === '0') {
      return $html . $content;
    }
    return $content . $html;
  }

  public function settings() 
  {
    add_settings_section('wcp_first_section', 'A place where the meta information will be displayed.', null, 'word-count-settings');

    add_settings_field('wcp_location', 'Display Location', [$this, 'LocationHTML'], 'word-count-settings', 'wcp_first_section');
    register_setting('word_count_plugin', 'wcp_location', 
    [
      'sanitize_callback' => [$this, 'sanitizeLocation'], // custom santize method
      'default' => '0'
    ]);

    add_settings_field('wcp_headline', 'Headline Text', [$this, 'headlineHTML'], 'word-count-settings', 'wcp_first_section');
    register_setting('word_count_plugin', 'wcp_headline', 
    [
      'sanitize_callback' => 'sanitize_text_field', // WP's santize function
      'default' => 'Post Statistics'
    ]);

    add_settings_field('wcp_word_count', 'Word Count', [$this, 'wordCountHTML'], 'word-count-settings', 'wcp_first_section');
    register_setting('word_count_plugin', 'wcp_word_count', 
    [
      'sanitize_callback' => 'sanitize_text_field', // WP's santize function
      'default' => 'on'
    ]);

    add_settings_field('wcp_character_count', 'Character count', [$this, 'characterCountHTML'], 'word-count-settings', 'wcp_first_section');
    register_setting('word_count_plugin', 'wcp_character_count', 
    [
      'sanitize_callback' => 'sanitize_text_field', // WP's santize function
      'default' => 'on'
    ]);

    add_settings_field('wcp_read_time', 'Read time', [$this, 'readTimeHTML'], 'word-count-settings', 'wcp_first_section');
    register_setting('word_count_plugin', 'wcp_read_time', 
    [
      'sanitize_callback' => 'sanitize_text_field', // WP's santize function
      'default' => 'on'
    ]);
  }
  public function locationHTML() 
  { ?>
  <select name="wcp_location">
    <option value="0" <?php selected(get_option('wcp_location'), '0') ?>>Top</option>
    <option value="1" <?php selected(get_option('wcp_location'), '1') ?>>Bottom</option>
    <option value="test" <?php selected(get_option('wcp_location'), 'test') ?>>Some value</option>
  </select>
<?php
  }
  public function headlineHTML() 
  { ?>
  <input type="text" name="wcp_headline" value="<?= esc_attr(get_option('wcp_headline')) ?>" placeholder="The headline for the meta info.">
  <?php
  }
  public function wordCountHTML() 
  { ?>
    <input type="checkbox" name="wcp_word_count" <?php checked(get_option('wcp_word_count'), 'on') ?>>
    <?php
  }
  public function characterCountHTML() 
  { ?>
    <input type="checkbox" name="wcp_character_count" <?php checked(get_option('wcp_character_count'), 'on') ?>>
    <?php
  }
  public function readTimeHTML() 
  { ?>
    <input type="checkbox" name="wcp_read_time" <?php checked(get_option('wcp_read_time'), 'on') ?>>
    <?php
  }
  public function adminPage() 
  {
    add_options_page('Word count settings', 'Word Count', 'manage_options', 'word-count-settings', [$this, 'settingsMarkup']);
  }
  public function sanitizeLocation($input) 
  {
    if($input !== '0' && $input !== '1') {
      add_settings_error('wcp_location', 'wcp_location_error', 'Display location must be Top or Bottom.');
      return get_option('wcp_location');
    }
    return $input;
  }
  public function settingsMarkup() 
  {
    ?>
    <div class="wrap">
      <h1>WordCount settings.</h1>
      <form action="options.php" method="POST">
        <?php
          settings_fields('word_count_plugin'); // this handles the nonce settings and the fields validation
          do_settings_sections('word-count-settings');
          submit_button();
        ?>
      </form>
     </div>
  <?php
  }
}

$wordCountAndReadTime = new WordCountAndReadTime();
```
----

## Adding a Plugin with a custom menu

We can control where the Plugin menu item is placed and its label and icon.
Instead of using the *add_options_page()* WP function to add a plugin's menu item within the Settings menu, we can instead use the *add_menu_page()* WP function.
In addition to that, we can add sub-menu items using the *add_submenu_page()* WP function.

The 2 WP functions mentioned can be found in the list below:
 - [add_menu_page()](https://developer.wordpress.org/reference/functions/add_menu_page/)
 - [add_submenu_page()](https://developer.wordpress.org/reference/functions/add_submenu_page/)

The working example code is below:
```
<?php

/*
  Plugin Name: Replace Words Filter
  Description: A plugin for replacing keywords with prefined words.
  Version: 1.1
  Author: MarkCond
  Author URI: https://markcondello.com.au
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) exit;

class ReplaceWordsFilter {
  public function __construct()
  {
    add_action('admin_menu', [$this, 'menuPage']);
  }
  public function menuPage()
  {
    add_menu_page('Words to Filter', 'Replace Words Filter', 'manage_options', 'replace-word-filter', [$this, 'replaceWordFilterPage'], 'dashicons-format-quote', 12);
    add_submenu_page('replace-word-filter', 'Words To Filter', 'Words list', 'manage_options', 'replace-word-filter', [$this, 'replaceWordFilterPage']); // Customize the label for the first level default menu created by WP
    add_submenu_page('replace-word-filter', 'Replace Words Filter Options', 'Replace Options', 'manage_options', 'replace-word-filter-options', [$this, 'replaceWordFilterOptionsPage']);
  }
  public function replaceWordFilterPage()
  { ?>
    <div class="wrap"><h1>This is the replace word filter page.</h1></div>
    <?php
  }
  public function replaceWordFilterOptionsPage()
  { ?>
    <div class="wrap"><h1>This is the replace word filter options page.</h1></div>
    <?php
  }
}

$replaceWordsFilter = new ReplaceWordsFilter();
```