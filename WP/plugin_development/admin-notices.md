## WP Plugin settings messages

BY default, admin messages for plugins are included for any items included under the settings menu area in the Wordpress admin.

If a plugin is created as a top level menu item these notices will not be enabled.

 So to enable admin notices, in this case, we need to add a function named settings_errors. There are two ways to add the settings_errors function. To see the first way, let's open up the settings-page.php file.
```
<div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <?php settings_errors(); ?>
        <form action="options.php" method="post">
```

The other way to add notifications is to use the admin_notices hook instead of including the settings_errors() in the plugin page like above. 
```
function show_error_notifications(){
    settings_errors();
}
add_action( 'admin_notices', 'show_error_notifications');
```

Custom messages can be created by adding a custom function:
```
function myplugin_admin_notices() {
    // get the current screen
    $screen = get_current_screen();

    // return if not myplugin settings page
    if ( $screen->id !== 'toplevel_page_myplugin' ) return;

    // check if settings updated
    if ( isset( $_GET[ 'settings-updated' ] ) ) {
        
        // if settings updated successfully
        if ( 'true' === $_GET[ 'settings-updated' ] ) : 
        ?>
            
            <div class="notice notice-success is-dismissible">
                <p><strong><?php _e( 'Congratulations, you are awesome!', 'myplugin' ); ?></strong></p>
            </div>
        <?php 
        
        // if there is an error
        else : 
        
        ?>
            
            <div class="notice notice-error is-dismissible">
                <p><strong><?php _e( 'Houston, we have a problem.', 'myplugin' ); ?></strong></p>
            </div>
            
        <?php 
           endif;
        }
}
add_action( 'admin_notices', 'myplugin_admin_notices' );
```