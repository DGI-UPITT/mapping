Drupal.behaviors.mappingGmap = function(context) {   

  // map init
  initialize_map();
  


}

// set djatoka base url
//var djatokaBaseUrl = "http://164.67.30.146:8080";  // ucla
//var djatokaBaseUrl = "http://192.168.3.12:8080";  // upitt
//var djatokaBaseUrl = "http://192.168.56.195:8080";  // islandora VM sandbox
var djatokaBaseUrl = "http://137.149.200.60:8080";  // sandbox.islandora.ca

// set djatoka default mime-type
//var mimeType = "image/png";
var mimeType = "image/jpeg";


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
//  var srcImage = 'http://164.67.30.146/drupal/fedora/repository/ucla:4618/JP2/JP2';
//  var srcImage = 'http://lorempixel.com/output/sports-q-c-1920-1920-6.jpg';
//  var srcImage = 'http://192.168.56.195/fedora/repository/image:4/JP2/bugtray-georgetown.tiff JP2.jp2';
//  var srcImage = 'http://sandbox.islandora.ca/fedora/repository/islandora%3A28/JPG/bugtray-georgetown.tiff-med.jpg';
  var srcImage = 'http://memory.loc.gov/gmd/gmd433/g4330/g4330/np000066.jp2';
//  var srcImage = 'http://hpitt.pittsburgh/fedora/repository/hpitt%3A943.000042.GN/JP2/000042gn.jp2'; 
//  var srcImage = 'http://sandbox.islandora.ca/fedora/repository/islandora%3A80/OBJ/upitt-map.png'; 
//  var srcImage = 'http://sandbox.islandora.ca/fedora/repository/islandora%3A105/OBJ/map.JPG'; 
//  var srcImage = 'http://sandbox.islandora.ca/fedora/repository/islandora:109/OBJ/FULL_SIZE.jpg'; 
//  var srcImage = 'http://sandbox.islandora.ca/fedora/repository/islandora%3A28/FULL_SIZE/bugtray-georgetown.tiff'; 
  
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
     
      //console.log(imgHeight);
      
      // create new image and assign style and attributes.
      var img = document.createElement("img");
      // get djatoka url
      var djatokaImg = djatokaRegion(image, imgWidth, imgHeight, tileTop, tileLeft, tileSize, tileSize);
//      alert(globalLeft);
//      alert(globalTop);
      //img.style.background = 'green';
      if ((globalLeft > vpSW.x || globalRight > vpSW.x) && // don't include left
          (globalLeft < vpNE.x || globalRight < vpNE.x) && // don't include right
          (globalTop < vpSW.y || globalBottom < vpSW.y) && // don't include bottom
          (globalTop > vpNE.y || globalBottom > vpNE.y) // don't include top
         ) {
        //img.style.background = 'blue';
        img.src = djatokaImg;
        img.className = 'img-loaded';
      }
      else {
        img.title = djatokaImg;
        img.className = 'img-not-loaded';
      }
      
      //img.alt = tileTop + '-' + tileLeft;
      //img.alt = globalTop + '-' + globalLeft;
//      img.style.border = '1px solid green';
      img.style.width = tileWidth + 'px';
      img.style.height = tileHeight + 'px';
      img.style.position = 'absolute';
      img.style.top = tileTop + 'px';
      img.style.left = tileLeft + 'px';
      img.style.opacity = '0.75';
      //img.id = 'tile-' + x + '-' + y;
      
      
      
      this.div_.appendChild(img);
    }
  }
  
  // set bounds variable to pass into addListener function below
  var bounds = this.bounds_;
//  var 
  
  // drag event listener
  google.maps.event.addListener(this.map_, 'drag', function(event) {
    
  // on drag: set bounds coordinates in pixels again.
  var sw = overlayProjection.fromLatLngToDivPixel(bounds.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(bounds.getNorthEast());

  // on drag: set viewPortBounds again
  var viewPortBounds = this.getBounds(); 
  var vpNE = overlayProjection.fromLatLngToDivPixel(viewPortBounds.getNorthEast());
  var vpSW = overlayProjection.fromLatLngToDivPixel(viewPortBounds.getSouthWest());

    $('.img-not-loaded').each(function() {
      // get offset    
      var offsetLeft = $(this).css('left');
      var offsetTop = $(this).css('top');
 
      // get image dimensions
      var imgWidth = $(this).width();
      var imgHeight = $(this).height();
      
      // global variables are tile borders relative to
      // global left px
      var globalLeft = sw.x + parseInt(offsetLeft, 10);
      // global top px
      var globalTop = ne.y + parseInt(offsetTop, 10);
      // global right px
      var globalRight = globalLeft + tileSize;
      // global bottom px
      var globalBottom = globalTop + tileSize;

      if (
          (globalLeft > vpSW.x || globalRight > vpSW.x) && // don't include left
          (globalLeft < vpNE.x || globalRight < vpNE.x) && // don't include right
          (globalTop < vpSW.y || globalBottom < vpSW.y) && // don't include bottom
          (globalTop > vpNE.y || globalBottom > vpNE.y) // don't include top
         ) {
        // get title
        var imgTitle = $(this).attr('title');
//        var imgTitle = djatokaRegion(image, imgWidth, imgHeight, parseInt(offsetTop, 10), parseInt(offsetLeft, 10), tileSize, tileSize);
        // set img src
        $(this).attr('src', imgTitle).removeClass('img-not-loaded').addClass('img-loaded').removeAttr('title');
        
        //console.log('loaded');
        
      }
      
    });
  });

  
  
}




function djatokaRegion(image, scaleWidth, scaleHeight, top, left, height, width) {

  // set url
  var url;
//  var image = encodeURIComponent(image);

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
//  console.log(scaledUrl);
  
  return scaledUrl;
  
}