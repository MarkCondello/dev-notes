# Pros & Cons of Custom SQL tables

While it is quick and easy to setup Custom Fields; all the data which is stored for those fields get stored in the *wp_postmeta* table.
With a small data set, this is acceptable; but once there are thousands of entries, this can become a problem. SQL needs to check through the *wp_post* table and then link to the *wp_postmeta* for every row a query is made for. This can slow down performance with large data sets and also makes managing the data in these tables difficult.

There are also issues when querying the database by specific fields. There is no way for SQL to index the search field to retrieve the data. Many cross references need to be performed for all the rows in the *wp_postmeta* table.

WP provides many conveniences using their internal *wp_post* table such as an admin menu area, query helper functions, the REST api and more.
A custom database table should only be used when we need to search by a specific meta field and there are thousands of rows in the data set.

## Creating a Table
In order to create a custom table, we first need to use an action hook which runs when our custom plugin is activated. We can check that this occurs with the *activate_plugin* action hook. 

Once the plugin is activated, it will run the callback which will create the table. More details about how to create custom tables in WP is [here](https://codex.wordpress.org/Creating_Tables_with_Plugins).

The following WP functions were used in the code example below:

- [do_action( "activate_{$plugin}", 'cb')](https://developer.wordpress.org/reference/hooks/activate_plugin/)
- [do_action("admin_head", 'cb')](https://developer.wordpress.org/reference/hooks/admin_head/)

As the docs about creating WP custom tables state, we need to include the upgrade.php file in order to use the *dbDelta()* WP function.

This *dbDelta()* function checks for changes in the table generated and updates the table structure if it has been modified.

We can leverage the global variable [$wpdb](https://developer.wordpress.org/reference/classes/wpdb/) to interact with the SQL database. This has been included in the contructor function.

See the code demo below:

```
class PetAdoptionTablePlugin {
  function __construct() {
    global $wpdb; // global allows use to access the global context within a class or function body, we can also use the $_GLOBALS['variable'] syntax
    $this->charset = $wpdb->get_charset_collate();
    $this->tableName = $wpdb->prefix . "pets";
    // add_action('activate_PetAdoptionTableMarkCond/new-database-table.php', [$this, 'onActivate']); // only runs when plugin is activated
    add_action('activate_plugin', [$this, 'onActivate']); 
  ...
  }
  function onActivate() {
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta("CREATE TABLE $this->tableName (
      id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
      birthyear smallint(5) NOT NULL DEFAULT 0,
      petweight smallint(5) NOT NULL DEFAULT 0,
      favcolor varchar(60) NOT NULL DEFAULT '',
      favfood varchar(60) NOT NULL DEFAULT '',
      favhobby varchar(60) NOT NULL DEFAULT '',
      petname varchar(60) NOT NULL DEFAULT '',
      species varchar(60) NOT NULL DEFAULT '',
      PRIMARY KEY  (id)
    ) $this->charset;");
  }
```

*We can check that this 'pets' table gets created by activating the plugin.*
___

In our constructor we have included the *admin_head* action hook. This will fire off its callback called *onAdminRefresh()* whenever the admin is reloaded.

The onAdminRefresh() callback inserts data into the *pets* table using the $wpdb global object.

```
public function __construct()
{
  ...
  add_action('admin_head', [$this, 'onAdminRefresh']);
}
...
function onAdminRefresh() {
  global $wpdb;
  $wpdb->insert(
    $this->tableName,
    [
      'birthyear' => rand(2006, 2021),
      'petweight' => rand(1, 100),
      'favcolor' => 'Poo',
      'favfood' => 'Poo',
      'favhobby' => 'Poo',
      'petname' => 'Haggis',
      'species' => 'retard shitsu'
    ]
  );
}
```

## Loading a custom template from the plugin

In order to load a template from our plugin we can use the ['template_include' filter](https://developer.wordpress.org/reference/hooks/template_include/). In this example we use this hooks callback function *loadTemplate* to load a specific template based on a specific page url.

```
public function __construct()
{
  ...
  add_filter('template_include', [$this, 'loadTemplate'], 99);
  ...
}
...
public function loadTemplate()
{
  if (is_page('custom-sql-table-example')) {
    return plugin_dir_path(__FILE__) . 'inc/template-pets.php';
  }
  return $template;
}
```

## Querying the custom table

In the template loaded for the predetermined page url (details above), we can use the *global $wpdb* object to make queries to SQL.

```
<?php 
  global $wpdb;
  $tableName = $wpdb->prefix . 'pets';
  $petsQuery = $wpdb->prepare("SELECT * FROM $tableName WHERE `species` = %s AND `birthyear` > %d ORDER BY `birthyear` ASC LIMIT 10;", 
  [
    'dog',
    2018
  ]);
  $pets = $wpdb->get_results($petsQuery);
  // echo "<pre>";
  // var_dump($pets);
  // echo "</pre>";
?>
```

Using the prepare statement allows us to add placeholders which will be sanitized if user inputs are being provided to modify the query.

The prepare query allows for prepared statements and placeholders for string or integer values.`%s for strings, %d for digits / integers`
The array second parameter is used to fill in the placeholder values.

## Posting to custom tables on Front End

In order for us to process form POST requests from the front end, we need to use a dynamically named action hook called *admin_post_{ACTION_INPUT_VALUE}*.

The other requirement to send POST request is to include the admin-post.php in the action value eg `action="<?= esc_url(admin_url('admin-post.php')) ?>"`.

A hidden input named "action" creates a hook for us to reference by the value eg add_pet.

The admin-post.php script will recognise the action value and provide a hook for us to leverage when the form is submitted.

```
<!-- Front End Template -->
  <?php 
    if (current_user_can('administrator')) { ?>
    <form action="<?= esc_url(admin_url('admin-post.php')) ?>" class="create-pet-form" method="POST">
      <label for="pet_name">Enter just the name for a pet. Its species, weight and other details will be generated.</label>
      <div>
        <input type="hidden" name="action" value="add_pet">
        <input type="text" name="pet_name" placeholder="Joe Bloggs">
        <button type="submit" value="" class="">Add pet</button>
      </div>
    </form>
<?php
```
By sending the action input in the payload, we can use that inputs value to use the *admin_post_{INPUT_VALUE}* and catch the values in the post request with the $_POST superglobal and persist the values in our plugin file.

The following WP functions were used in the code example below:

- [current_user_can()](https://developer.wordpress.org/reference/functions/current_user_can/)
- [wp_redirect()](https://developer.wordpress.org/reference/functions/wp_redirect/)
- [site_url()](https://developer.wordpress.org/reference/functions/site_url/)

```
<!-- Plugin -->
 function __construct() {
   ...
  add_action('admin_post_add_pet', [$this, 'handlePost']);
  add_action('admin_post_nopriv_add_pet', [$this, 'handlePost']); // no privledges
  }
  ...
    public function handlePost()
  {
    if (current_user_can('administrator')) {
      $pet = generatePet();
      $pet['petname']= sanitize_text_field($_POST['pet_name']);
      global $wpdb;
      $wpdb->insert($this->tableName, $pet);
      wp_redirect(site_url('/custom-sql-table-example'));
    } else {
      wp_redirect(site_url());
    }
  }
```

## Deleting a row from the Front End

Deleting rows from the front end is similar to the previous 2 steps.
We create the form with the hidden action field that includes a custom value and add *admin-post.php* to the form action.
We catch that POST request with the hook provided and delegate the handling of that request to a method or function.

The main difference is with the SQL statement which deletes the specific row:
```
  function __construct() {
    ...
    add_action('admin_post_delete_pet', [$this, 'handleDelete']);
    add_action('admin_post_nopriv_delete_pet', [$this, 'handleDelete']); // no privledges
  }
  public function handleDelete()
  {
    if (current_user_can('administrator')) {
      global $wpdb;
      $wpdb->delete($this->tableName, [ 'id' => sanitize_text_field($_POST['pet_id']) ]);
      $this->message = "The pet {$_POST['pet_name']} has been deleted.";
      wp_redirect(site_url("/custom-sql-table-example?message=$this->message"));
    } else {
      wp_redirect(site_url());
    }
  }
```

## Setting up Edit route
```
  function __construct() {
    ...
    // Edit route updates
    add_action('init', function() {
      add_rewrite_rule('edit-pet/([0-9]+)[/]?$', 'index.php?pet=$matches[1]', 'top');
    });
    // tell WP that the pet is an acceptable query var
    add_filter('query_vars', function($query_vars){
      $query_vars[] = 'pet';
      return $query_vars;
    });
    add_action('template_include', function($template){
      $this->petId = null;
      if (get_query_var('pet') == false || get_query_var('pet') == '' ) {
        return $template;
      }
      $this->petId = get_query_var('pet');
      var_dump($this->petId); // DOES NOT PROVIDE THE PET ID PASSED IN
      return plugin_dir_path(__FILE__) .'/inc/template-edit-pet.php'; // the template has a form which sends a POST request 
    });

    add_action('admin_post_edit_pet', [$this, 'handleEdit']);
    add_action('admin_post_nopriv_edit_pet', [$this, 'handleEdit']); // no privledges
  }
  ...
  public function handleEdit()
  {
    if (current_user_can('administrator') && isset($_POST['petid'])) {
      $pet['petname']= sanitize_text_field($_POST['petname']);
      global $wpdb;
      $petUpdate = $wpdb->prepare("UPDATE $this->tableName
        SET petname = %s
        WHERE id = %d;", sanitize_text_field($_POST['petname']), $_POST['petid']
      );
      $wpdb->query($petUpdate);
      wp_redirect(site_url('/custom-sql-table-example?message=The pet '. $_POST["petname"]. ' has been updated...'));
    } else {
      wp_redirect(site_url());
    }
  }
```

https://www.youtube.com/watch?v=Wb5yEs5kV5k&t=729s