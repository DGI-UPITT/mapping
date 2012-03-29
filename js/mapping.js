Drupal.behaviors.mappingGmap = function(context) {   

  // map init
  initialize_map();
  

}




function initialize_map() {
 
  // set variables
  var map;
  var bounds = new google.maps.LatLngBounds();
  
  //<westbc Sync="TRUE">-79.950359</westbc>
  //<eastbc Sync="TRUE">-79.938335</eastbc>
  //<northbc Sync="TRUE">40.455552</northbc>
  //<southbc Sync="TRUE">40.447410</southbc>
  
  // imagebounds
  var imageBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(40.447410,-79.950359),
    new google.maps.LatLng(40.455552,-79.938335)
  );

  
  // lonlat Pittsburgh: 40.4405556,-79.9961111
  // set latlng 
  var latlng = new google.maps.LatLng(40.765641,-74.139235);
  // set options
  var opts = {
    zoom: 13,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  // set map
  map = new google.maps.Map(document.getElementById('map-test'), opts);

  //  // adds to the marker bound
  var oldmap;
  var oldmap = new google.maps.GroundOverlay(
      "http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500.png",
      imageBounds);
  
  // add image to the map
  oldmap.setMap(map);
  
  // set opacity
  oldmap.setOpacity(0.5);
  
  // fit the bounds we created
  map.fitBounds(imageBounds);
  

  // 39v02p01-011_Clip1.tiff


  var test;
  var zoomLevel = 1;

  google.maps.event.addListener(map, 'zoom_changed', function(event) {
    var i, prevZoomLevel;

    if (map.getZoom() === 16) {
      oldmap.setMap();
      oldmap.url = "http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500.png";
      oldmap.setMap(map);
    }
    if (map.getZoom() === 17) {
      // unset image object from the map
      oldmap.setMap();
      // change image url
      oldmap.url = "http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500-2.png";
      // set image to the map again
      oldmap.setMap(map);
    }
    if (map.getZoom() === 18) {
      oldmap.setMap();
      oldmap.url = "http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500-3.png";
      oldmap.setMap(map);
    }
    if (map.getZoom() === 19) {
      oldmap.setMap();
      oldmap.url = "http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500-4.png";
      oldmap.setMap(map);
    }



  });

}