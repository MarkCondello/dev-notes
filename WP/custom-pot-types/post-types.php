<?php
function university_post_types(){
    register_post_type('campus', array(
        // this creates capabilities for an event. See below param.
        'capability_type' => 'campus', 
        // In order to use this capability, we need to provide access tp the capability to the predefined roles. See below param.
        'map_meta_cap' => 'true',
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'excerpt'),
        'has_archive' => true,
        'rewrite' => array('slug' => 'campuses'),
        'public' => true,
        'labels' => array(
            'name' => 'Campuses',
            'add_new_item' => 'Add New Campus',
            'edit_item' => 'Edit Campus',
            'all_items' => 'All Campuses',
            'singular_name' => 'Campus',
        ),
        'menu_icon' => 'dashicons-location-alt',
    ));
    register_post_type('event', array(
        // this creates capabilities for an event. See below param.
        'capability_type' => 'event', 
        // In order to use this capability, we need to provide access tp the capability to the predefined roles. See below param.
        'map_meta_cap' => 'true',
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'excerpt', 'author'), // custom-fields do not show
        'has_archive' => true,
        'rewrite' => array('slug' => 'events'),
        'public' => true,
        'labels' => array(
            'name' => 'Events',
            'add_new_item' => 'Add New Event',
            'edit_item' => 'Edit Event',
            'all_items' => 'All Events',
            'singular_name' => 'Event'
        ),
        'menu_icon' => 'dashicons-calendar'
    ));
    
    register_post_meta( 'event', 'date', [
		'show_in_rest' => true,
		'single' => true,
		'type' => 'boolean',
	] );

    register_post_type('program', array(
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'author'),
        'has_archive' => true,
        'rewrite' => array('slug' => 'programs'),
        'public' => true,
        'labels' => array(
            'name' => 'Programs',
            'add_new_item' => 'Add New Program',
            'edit_item' => 'Edit Program',
            'all_items' => 'All Programs',
            'singular_name' => 'Program'
        ),
        'menu_icon' => 'dashicons-lightbulb',
        'show_in_rest' => true
    ));
    register_post_type('professor', array(
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'author' ),
        'public' => true,
        'labels' => array(
            'name' => 'Professors',
            'add_new_item' => 'Add New Professor',
            'edit_item' => 'Edit Professor',
            'all_items' => 'All Professors',
            'singular_name' => 'Professor'
        ),
        'menu_icon' => 'dashicons-welcome-learn-more'
    ));

    register_post_type('note', [
        'capability_type' => 'note',
        'map_meta_cap' => 'true',
        'show_in_rest' => true,
        'supports' => ['title', 'editor', ],
        'public' => false, // not shown in search results
        'show_ui' => true, // shows post type in the admin
        'labels' => [
            'name' => 'Notes',
            'add_new_item' => 'Add New Note',
            'edit_item' => 'Edit Note',
            'all_items' => 'All Notes',
            'singular_name' => 'Note'
        ],
        'menu_icon' => 'dashicons-welcome-write-blog'
    ]);

    register_post_type('like', [
        'supports' => ['title',],
        'public' => false, // not shown in search results
        'show_ui' => true, // shows post type in the admin
        'labels' => [
            'name' => 'Likes',
            'add_new_item' => 'Add New Like',
            'edit_item' => 'Edit Like',
            'all_items' => 'All Likes',
            'singular_name' => 'Like'
        ],
        'menu_icon' => 'dashicons-heart'
    ]);
    register_post_type('rating', [
        'supports' => ['editor', ],
        'public' => false, // not shown in search results
        'show_ui' => true, // shows post type in the admin
        'labels' => [
            'name' => 'Ratings',
            'add_new_item' => 'Add New Rating',
            'edit_item' => 'Edit Rating',
            'all_items' => 'All Ratings',
            'singular_name' => 'Rating'
        ],
        'menu_icon' => 'dashicons-star-empty'
    ]);
} 
add_action('init', 'university_post_types', 1);