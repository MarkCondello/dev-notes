
## Capability params in custom post type 
```
register_post_type('campus', array(
    // this creates capabilities for an event. See below param.
    'capability_type' => 'campus', 
    // In order to use this capability, we need to provide access to the capability to the predefined roles. See below param.
    'map_meta_cap' => 'true',
```

## Roles plugin
With the above settings in place and the Members plugin activated from `Memberpress`, we will see the custom post type as a roles option in the associated menu area.
Remember that once the above code change is made, we need to assign the capability to the `administrator` role.
The plugin allows user to combine capabilities to create custom roles.

## Redirect users with specific role and remove WP topbar
```
//redirect to home page instead of admin if users role is subscriber.
function redirect_subs_to_home(){
    $currentUser = wp_get_current_user();
    if(count($currentUser->roles) == 1 && $currentUser->roles[0] == "subscriber"){
        wp_redirect(site_url('/'));
        exit;
    }
}
add_action('admin_init', 'redirect_subs_to_home');
```

//remove to topbar admin if subscriber is logged
function remove_topbar(){
    $currentUser = wp_get_current_user();
    if(count($currentUser->roles) == 1 && $currentUser->roles[0] == "subscriber"){
        show_admin_bar(false);
     }
}
add_action('wp_loaded', 'remove_topbar');