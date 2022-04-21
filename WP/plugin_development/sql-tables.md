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