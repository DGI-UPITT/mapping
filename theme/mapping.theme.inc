<?php

/*
 * @file Bundle theme related functions
 */


  /**
   * Theme function for displaying the map
   *
   * @param $results
   * The search results
   *
   * @return variables to be used in the template file.
   */

function mapping_preprocess_mapping(&$variables) {
  // base url
  global $base_url;
  $variables['base_url'] = $base_url;
  
  // Connect to google maps API
  drupal_set_html_head('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false" ></script>');
  
  drupal_add_css(drupal_get_path('module', 'mapping') . '/css/mapping.css');
  
  drupal_add_js(drupal_get_path('module', 'mapping') . '/js/mapping.js');

}






