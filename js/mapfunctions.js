
var React = require('react');
var map;
var center;
var service;
var markers = [];
var defautSearchRadius = '500';
var mainMarker = [];
var MapFunctions = {


  randomLocation: function(){
    MapFunctions.clearMarkers();
    var lat = mainMarker[0].position.H + ((2 * (Math.random() - .5)) * .02);
    var lng = mainMarker[0].position.L + ((2 * (Math.random() - .5)) * .02);
    MapFunctions.setMapOnAll(null, mainMarker);
    mainMarker = [];
    var newCenter = {lat: lat, lng: lng};
    map.setCenter(newCenter);
    MapFunctions.addMainMarker(lat, lng);
    MapFunctions.getNearbyPlaces(newCenter);

  },

  attachWindow: function(marker,message){
    var infowindow = new google.maps.InfoWindow({
      content: message
    });
    marker.addListener('rightclick', function() {
      marker.setMap(null);
      React.render(<LeftMainModal />, document.getElementById('left-target'));

    });
    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
    });
    marker.addListener('mouseover',function(){
      MapFunctions.getGoogleDetails(marker.placeId);
    });
  },

  deleteMarkers: function() {
    MapFunctions.clearMarkers();
    markers = [];
  },

  clearMarkers: function() {
    MapFunctions.setMapOnAll(null, markers);
    markers = [];
  },

  buildMap: function(lat,lng){
    map = new google.maps.Map(document.getElementById('map'),{
      center: {lat: lat, lng: lng},
      zoom:   15
    });
    React.render(<LeftMainModal />, document.getElementById('left-target'));

  },

  getGoogleDetails: function(placeId){
    var request = {placeId: placeId};
    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);
    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (place.formatted_address === undefined) {
          var address = "Address format unrecognizable at this current state of development...";
        } else {
          var address = place.formatted_address;
        }
        if (place.opening_hours === undefined || place.opening_hours.weekday_text === undefined) {
          var hours = "Hours unavailable 😕";
        } else {
          var hours = place.opening_hours.weekday_text;
        }

        React.render(<BarHeading name=       {place.name}
                                 address=    {address}
                                 website=    {place.website}
                                 reviews=    {place.reviews}
                                 rating=     {place.rating}
                                 hours=      {hours}
                                 ratingNum=  {place.user_ratings_total}
                                 key       = {place.place_id}
                                 />, document.getElementById('left-target'));

      }
    }
  },

  addMainMarker: function(lat, lng){
    var marker = new google.maps.Marker({
      position:  {lat: lat, lng: lng},
      animation: google.maps.Animation.BOUNCE,
      map:       map,
      draggable: true,
      icon: 'http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/cat-icon.png'
    });
     var infowindow = new google.maps.InfoWindow({
      content: "You Are Here"
     });
    infowindow.open(map, marker);
    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
    });
    marker.addListener('drag', function() {
      MapFunctions.deleteMarkers();
    });
    marker.addListener('rightclick', function() {
      MapFunctions.deleteMarkers();
      React.render(<LeftMainModal />, document.getElementById('left-target'));
    });
    marker.addListener('dragend', function() {
      var newCenter = {lat: this.position.H, lng:this.position.L};
      map.setCenter(newCenter);
      MapFunctions.getNearbyPlaces(newCenter);
      map.setZoom(15);
    });
    mainMarker.push(marker);
  },

  setMapOnAll: function(map, markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  },

  getUserLocation: function(){
    // GETS LAT LNG BASED ON BROWSER, CENTERS MAP, THEN GETS NEARBY PLACES

    function success(position){
      MapFunctions.buildMap( position.coords.latitude, position.coords.longitude );
      MapFunctions.addMainMarker( position.coords.latitude, position.coords.longitude );
      center = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
      MapFunctions.getNearbyPlaces(center);
    }

    function failure(message){
      alert("Please share location, it's how this site works 😊\nChange location setting and refresh for best results");
      MapFunctions.buildMap(44.9778,-93.2650);
      MapFunctions.addMainMarker(44.9778,-93.2650);
      center = new google.maps.LatLng( 44.9778,-93.2650 );
      MapFunctions.getNearbyPlaces(center);

      React.render(<NoGeoLocation />, document.getElementById('left-target'));
    }

    navigator.geolocation.getCurrentPosition(success, failure);
  },

  getNearbyPlaces: function(center){
    var request = {
      location: center,
      radius: defautSearchRadius,
      types: ['bar']
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          if (place.name === undefined || place.id === undefined) {
            i++;
          }
          var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location,
            placeId: place.place_id
          });
          MapFunctions.attachWindow(marker, place.name);
          markers.push(marker);
        }
      }
    });
  },

};
