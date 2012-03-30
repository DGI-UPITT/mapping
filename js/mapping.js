Drupal.behaviors.mappingGmap = function(context) {   

  // map init
  initialize_map();
  

}



// initialize google map
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
  var latlng = new google.maps.LatLng(40.4405556,-79.9961111);
  // set options
  var opts = {
    zoom: 13,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  // set map
  map = new google.maps.Map(document.getElementById('map-test'), opts);

  //  // adds to the marker bound
//  var oldmap;
//  var oldmap = new google.maps.GroundOverlay(
//      "http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500.png",
//      imageBounds
//    );
  
  var srcImage = 'http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500.png';
  overlay = new myOverlay(imageBounds, srcImage, map);

  // add image to the map
//  oldmap.setMap(map);
  
  // set opacity
//  oldmap.setOpacity(0.5);
  
  // fit the bounds we created
  map.fitBounds(imageBounds);
  

  // 39v02p01-011_Clip1.tiff


//  var test;
//  var zoomLevel = 1;
//
//  google.maps.event.addListener(map, 'zoom_changed', function(event) {
//    var i, prevZoomLevel;
//
//    if (map.getZoom() === 16) {
//      oldmap.setMap();
//      //oldmap.url = "http://hpitt.pittsburgh:8080/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=http://hpitt.pittsburgh/fedora/repository/hpitt:PCW000203/JP2/&svc_id=info:lanl-repo/svc/getRegion&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000&svc.format=image/png&svc.level=3&svc.rotate=0";
//      oldmap.url = "http://164.67.30.146:8080/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=http://164.67.30.146/drupal/fedora/repository/ucla:4618/JP2/JP2&svc_id=info:lanl-repo/svc/getRegion&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000&svc.format=image/png&svc.level=4&svc.rotate=0";
//      oldmap.setMap(map);
//    }
//    if (map.getZoom() === 17) {
//      // unset image object from the map
//      oldmap.setMap();
//      // change image url
//      oldmap.url = "http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500-2.png";
//      // set image to the map again
//      oldmap.setMap(map);
//    }
//    if (map.getZoom() === 18) {
//      oldmap.setMap();
//      oldmap.url = "http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500-3.png";
//      oldmap.setMap(map);
//    }
//    if (map.getZoom() === 19) {
//      oldmap.setMap();
//      oldmap.url = "http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500-4.png";
//      oldmap.setMap(map);
//    }
//
//
//
//  });

}






function myOverlay(bounds, image, map) {

  // Now initialize all properties.
  this.bounds_ = bounds;
  this.image_ = image;
  this.map_ = map;

  // We define a property to hold the image's
  // div. We'll actually create this div
  // upon receipt of the add() method so we'll
  // leave it null for now.
  this.div_ = null;

  // Explicitly call setMap() on this overlay
  this.setMap(map);


}


// https://developers.google.com/maps/documentation/javascript/reference#OverlayView
myOverlay.prototype = new google.maps.OverlayView();


// onAdd() only gets loaded when the layer is added. Doesn't get triggered after
// zoom.
myOverlay.prototype.onAdd = function() {

  // Note: an overlay's receipt of onAdd() indicates that
  // the map's panes are now available for attaching
  // the overlay to the map via the DOM.

  // Create the DIV and set some basic attributes.
  var div = document.createElement('div');
  div.style.border = "none";
  div.style.borderWidth = "0px";
  div.style.position = "absolute";
  div.style.opacity = 0.95;
  div.style.border = '2px red solid';
  div.id = 'islandora-image-overlay';

  // Create an IMG element and attach it to the DIV.
  var img = document.createElement("img");
//  img.src = this.image_;
  
  img.style.width = "100%";
  img.style.height = "100%";
  //div.appendChild(img);

  this.img_ = img;

  // Set the overlay's div_ property to this DIV
  this.div_ = div;

  // We add an overlay to a map via one of the map's panes.
  // We'll add this overlay to the overlayImage pane.
  // https://developers.google.com/maps/documentation/javascript/reference#MapPanes
  console.log(this.getPanes());
  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);
}



// Implement this method to draw or update the overlay. This method is called 
// after onAdd() and when the position from projection.fromLatLngToPixel() would
// return a new value for a given LatLng. This can happen on change of zoom,
// center, or map type. It is not necessarily called on drag or resize.
myOverlay.prototype.draw = function() {

  // Size and position the overlay. We use a southwest and northeast
  // position of the overlay to peg it to the correct position and size.
  // We need to retrieve the projection from this overlay to do this.
  // https://developers.google.com/maps/documentation/javascript/reference#MapCanvasProjection
  var overlayProjection = this.getProjection();

  // Retrieve the southwest and northeast coordinates of this overlay
  // in latlngs and convert them to pixels coordinates.
  // We'll use these coordinates to resize the DIV.
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Resize the image's DIV to fit the indicated dimensions.
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';

  // image width
  var imgWidth = Math.round(ne.x - sw.x);
  // image height
  var imgHeight = Math.round(sw.y - ne.y);
  
  // tile size
  var tileSize = 256;
  
  
  var xAmount = (imgWidth / tileSize);
  var xRemain = (imgWidth % tileSize);
  
  var yAmount = (imgHeight / tileSize);
  var yRemain = (imgHeight % tileSize);
  
  
  console.log(xAmount);
  console.log(xRemain);
  console.log(yAmount);
  console.log(yRemain);





  
  this.img_.src = djatokaRegion(imgWidth, 0, 0, 0, 256, 256);
  this.img_.style.width = '256px';
  this.img_.style.height = '256px';
  this.div_.appendChild(this.img_);
  
  
  
  
  
  console.log(Math.round(ne.x - sw.x));

  console.log(ne.x);
  console.log(sw.x);

  
}




function djatokaRegion(scaleWidth, scaleHeight, top, left, height, width) {
  // set url
  var url;
  // set original image
  var original = 'http://164.67.30.146/drupal/fedora/repository/ucla:4618/JP2/JP2';

  // get scaled down version of original image
  var scaledOriginal = djatokaScale(original, scaleWidth);

  // encode scaled down image URL so we can re-use it
  var scaledOriginal = encodeURIComponent(scaledOriginal);

  // construct url for region
  url = "http://164.67.30.146:8080/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=" + 
    scaledOriginal + 
    "&svc_id=info:lanl-repo/svc/getRegion&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000&svc.format=image/png" + 
    "&svc.region=" + top + "," + left + "," + height + "," + width;
          
  console.log(url);
  console.log(scaledOriginal);
  
  return url;
}




function djatokaScale(original, scaleWidth) {
  // set scaledUrl variable
  var scaledUrl;
  
  // construct url for scale
  scaledUrl = "http://164.67.30.146:8080/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=" + 
    original + 
    "&svc_id=info:lanl-repo/svc/getRegion&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000&svc.format=image/png" + 
    "&svc.scale=" + scaleWidth;
  
  return scaledUrl;
  
}




//iiv.Viewer.ImageLayer = OpenLayers.Class(OpenLayers.Layer.OpenURL, {
//  djatokaUrl: null,
//  uid: null,
//
//  /**
//* this implementation is the same as the superclass, except that we use a
//* fedora service as the url base, not djatoka itself
//*/
//  getURL: function(bounds) {
//    bounds = this.adjustBounds(bounds);
//    this.calculatePositionAndSize(bounds);
//    var z = this.map.getZoom() + this.zoomOffset;
//    
//    // uid and djatokaUrl set in createImageLayer
//    var path = this.djatokaUrl + '/getRegion?uid=' + this.uid + '&level=' + z
//      + '&region=' + this.tilePos.lat + "," + this.tilePos.lon + "," + this.imageSize.h + "," + this.imageSize.w;
//    
//    var url = this.url;
//    if (url instanceof Array) {
//        url = this.selectUrl(path, url);
//    }
//    return url + path;
//  }
//});







  // Create the DIV and set some basic attributes.
//  var divInner = document.createElement('div');
//  divInner.style.border = "none";
//  divInner.style.borderWidth = "0px";
//  divInner.style.border = "2px solid green";
//  divInner.style.position = "absolute";
//  divInner.style.top = "256px";
//  divInner.style.left = "256px";
//  divInner.style.width = '256px';
//  divInner.style.height = '256px';
//  divInner.id = 'islandora-image-overlay-inner';
//  div.appendChild(divInner);