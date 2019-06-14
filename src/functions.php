<?php

function divinesolutions_scripts() { 
  wp_enqueue_style('divinesolutions-stylesheet', get_template_directory_uri() . '/site.css', array(), '0.1.0', 'all');
  wp_enqueue_script( 'divinesolutions-scripts', get_template_directory_uri() . '/js/site.js', array(), '0.1.0', true );
}
add_action('wp_enqueue_scripts', 'divinesolutions_scripts');