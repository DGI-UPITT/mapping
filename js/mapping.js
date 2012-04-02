Drupal.behaviors.mappingGmap = function(context) {   

  // map init
  initialize_map();
  


}

// set djatoka base url
var djatokaBaseUrl = "http://164.67.30.146:8080";  // ucla
//var djatokaBaseUrl = "http://192.168.3.12:8080";  // upitt

// set djatoka default mime-type
var mimeType = "image/png";


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

  // set original image
//  var srcImage = 'http://hpitt.pittsburgh/fedora/repository/hpitt%3Ahopkins_39v02p01_georefclip/JP2/39v02p01-011%20Clip1.jp2';
//  var srcImage = 'http://dl.dropbox.com/u/12905785/DGI/upitt/39v02p01-011_Clip1.tif';
//  var srcImage = 'http://dl.dropbox.com/u/12905785/DGI/upitt/39v02p01-011_Clip1.png';
//  var srcImage = 'http://upload.wikimedia.org/wikipedia/commons/d/dc/Cats_Petunia_and_Mimosa_2004.jpg';
//  var srcImage = 'http://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg';
//  var srcImage = 'http://a0.twimg.com/profile_images/111669684/druplicon.large_normal.png';
//  var srcImage = 'http://d6theming.local/sites/all/modules/custom/mapping/images/upitt-map2500.png';
  var srcImage = 'http://164.67.30.146/drupal/fedora/repository/ucla:4618/JP2/JP2';
  overlay = new myOverlay(imageBounds, srcImage, map);
  
  // fit the bounds we created
  map.fitBounds(imageBounds);
  
  
  


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
//  var img = document.createElement("img");
//  img.src = this.image_;
  
//  img.style.width = "100%";
//  img.style.height = "100%";
  //div.appendChild(img);

//  this.img_ = img;

  // Set the overlay's div_ property to this DIV
  this.div_ = div;

  // We add an overlay to a map via one of the map's panes.
  // We'll add this overlay to the overlayImage pane.
  // https://developers.google.com/maps/documentation/javascript/reference#MapPanes
  
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
  // https://developers.google.com/maps/documentation/javascript/reference#Projection
  var overlayProjection = this.getProjection();

  // Retrieve the southwest and northeast coordinates of this overlay
  // in latlngs and convert them to pixels coordinates.
  // We'll use these coordinates to resize the DIV.
  // https://developers.google.com/maps/documentation/javascript/reference#MapCanvasProjection
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Resize the image's wrapper DIV to fit the indicated dimensions.
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';

  // image width
  var imgWidth = Math.round(ne.x - sw.x);
  // image height
  var imgHeight = Math.round(sw.y - ne.y);
  
  // set tile size
  var tileSize = 256;
  
  // amount of full horizontal tiles
  var xAmount = (imgWidth / tileSize);
  // leftover pixels for right tiles
  var xRemain = (imgWidth % tileSize);
  
  // amount of full vertical tiles
  var yAmount = (imgHeight / tileSize);
  // leftover pixels for bottom tiles
  var yRemain = (imgHeight % tileSize);
  
  // get viewport bounds
  var viewPortBounds = this.map_.getBounds(); 
  var vpNE = overlayProjection.fromLatLngToDivPixel(viewPortBounds.getNorthEast());
  var vpSW = overlayProjection.fromLatLngToDivPixel(viewPortBounds.getSouthWest());
  
  // get image
  var image = this.image_;
  
//  console.log(sw);
//  console.log(vpSW);
  
  // clear wrapper div
  $('#islandora-image-overlay').html('');
  
  // render tiles
  // y loop
  var yAmountCeil = Math.ceil(yAmount);
  for (var y = 0; y < yAmountCeil; y++) {
    
    // x loop
    var xAmountCeil = Math.ceil(xAmount);
    for (var x = 0; x < xAmountCeil; x++) {
  
      // calculate tile top position
      var tileTop = tileSize * y;
      // calculate tile left position
      var tileLeft = tileSize * x;
      // calculate top position of the tile's bottom side
      var tileBottom = tileTop + tileSize;
      // calculate left position of the tile's right side
      var tileRight = tileLeft + tileSize;
      // calculate tile width
      var tileWidth = tileSize;
      // last tile in line gets resized
      if ((xAmountCeil - 1) == x) {
        tileWidth = xRemain;
      }
      // calculate tile height
      var tileHeight = tileSize;
      // last tile in line gets resized
      if ((yAmountCeil - 1) == y) {
        tileHeight = yRemain;
      }
      
      // global variables are tile borders relative to
      // global left px
      var globalLeft = sw.x + tileLeft;
      // global top px
      var globalTop = ne.y + tileTop;
      // global right px
      var globalRight = globalLeft + tileSize;
      // global bottom px
      var globalBottom = globalTop + tileSize;
     
      
      // create new image and assign style and attributes.
      var img = document.createElement("img");
      // get djatoka url
      img.title = djatokaRegion(image, imgWidth, 0, tileTop, tileLeft, tileSize, tileSize);
      
      img.className = 'img-not-loaded';
      img.style.background = 'green';
      if ((globalLeft > vpSW.x || globalRight > vpSW.x) && // don't include left
          (globalLeft < vpNE.x || globalRight < vpNE.x) && // don't include right
          (globalTop < vpSW.y || globalBottom < vpSW.y) && // don't include bottom
          (globalTop > vpNE.y || globalBottom > vpNE.y) // don't include top
         ) {
        //img.style.background = 'blue';
        img.src = djatokaRegion(image, imgWidth, 0, tileTop, tileLeft, tileSize, tileSize);
        img.className = 'img-loaded';
      }
      
      
      img.style.width = tileWidth + 'px';
      img.style.height = tileHeight + 'px';
      img.style.position = 'absolute';
      img.style.top = tileTop + 'px';
      img.style.left = tileLeft + 'px';
      //img.id = 'tile-' + x + '-' + y;
      
      
      
      this.div_.appendChild(img);
    }
  }
  
  // drag event listener
  google.maps.event.addListener(this.map_, 'drag', function() {
    


    $('#islandora-image-overlay .img-not-loaded').each(function() {
    // still something mayorly wrong with this.
      var offset = $(this).offset();
      var imgWidth = $(this).width();
      var imgHeight = $(this).height();
      
      // global variables are tile borders relative to
      // global left px
      var globalLeft = sw.x + offset.left;
      // global top px
      var globalTop = ne.y + offset.top;
      // global right px
      var globalRight = globalLeft + tileSize;
      // global bottom px
      var globalBottom = globalTop + tileSize;
      
      //console.log(imgHeight);
      //console.log(offset.left);
      if ((globalLeft > vpSW.x || globalRight > vpSW.x) && // don't include left
          (globalLeft < vpNE.x || globalRight < vpNE.x) && // don't include right
          (globalTop < vpSW.y || globalBottom < vpSW.y) && // don't include bottom
          (globalTop > vpNE.y || globalBottom > vpNE.y) // don't include top
         ) {
        // get title
        var imgTitle = $(this).attr('title');
        // set img src
        $(this).attr({src: imgTitle});
        
      }

      
    });
  });

  
  
}




function djatokaRegion(image, scaleWidth, scaleHeight, top, left, height, width) {

  // set url
  var url;

  // get scaled down version of original image
  var scaledOriginal = djatokaScale(image, scaleWidth, scaleHeight);
  
  // encode scaled down image URL so we can re-use it
  var scaledOriginal = encodeURIComponent(scaledOriginal);

  // construct url for region
  url = djatokaBaseUrl +
    "/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=" + scaledOriginal + 
    "&svc_id=info:lanl-repo/svc/getRegion" +
    "&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000"+
    "&svc.format=" + mimeType + 
    "&svc.region=" + top + "," + left + "," + height + "," + width;
  
  return url;
}




function djatokaScale(image, scaleWidth, scaleHeight) {
  // set scaledUrl variable
  var scaledUrl;
  
  // construct url for scale
  scaledUrl = djatokaBaseUrl +
    "/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=" + image +
    "&svc_id=info:lanl-repo/svc/getRegion" +
    "&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000" +
    "&svc.format=" + mimeType +
    "&svc.scale=" + scaleWidth + "," + scaleHeight;
  
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