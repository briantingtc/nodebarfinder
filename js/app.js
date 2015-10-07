'use strict';

var React = require('react');
var map;
var center;
var service;
var markers = [];
var defautSearchRadius = '500';
var mainMarker = [];
var MapFunctions = {

  randomLocation: function randomLocation() {
    MapFunctions.clearMarkers();
    var lat = mainMarker[0].position.H + 2 * (Math.random() - .5) * .02;
    var lng = mainMarker[0].position.L + 2 * (Math.random() - .5) * .02;
    MapFunctions.setMapOnAll(null, mainMarker);
    mainMarker = [];
    var newCenter = { lat: lat, lng: lng };
    map.setCenter(newCenter);
    MapFunctions.addMainMarker(lat, lng);
    MapFunctions.getNearbyPlaces(newCenter);
  },

  attachWindow: function attachWindow(marker, message) {
    var infowindow = new google.maps.InfoWindow({
      content: message
    });
    marker.addListener('rightclick', function () {
      marker.setMap(null);
      React.render(React.createElement(LeftMainModal, null), document.getElementById('left-target'));
    });
    marker.addListener('click', function () {
      infowindow.open(marker.get('map'), marker);
    });
    marker.addListener('mouseover', function () {
      MapFunctions.getGoogleDetails(marker.placeId);
    });
  },

  deleteMarkers: function deleteMarkers() {
    MapFunctions.clearMarkers();
    markers = [];
  },

  clearMarkers: function clearMarkers() {
    MapFunctions.setMapOnAll(null, markers);
    markers = [];
  },

  buildMap: function buildMap(lat, lng) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: lat, lng: lng },
      zoom: 14
    });
    React.render(React.createElement(LeftMainModal, null), document.getElementById('left-target'));
  },

  getGoogleDetails: function getGoogleDetails(placeId) {
    var request = { placeId: placeId };
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

        React.render(React.createElement(BarHeading, { name: place.name,
          address: address,
          website: place.website,
          reviews: place.reviews,
          rating: place.rating,
          hours: hours,
          ratingNum: place.user_ratings_total,
          key: place.place_id
        }), document.getElementById('left-target'));
      }
    }
  },

  addMainMarker: function addMainMarker(lat, lng) {
    var marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      animation: google.maps.Animation.BOUNCE,
      map: map,
      draggable: true,
      icon: 'http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/cat-icon.png'
    });
    var infowindow = new google.maps.InfoWindow({
      content: "You Are Here"
    });
    infowindow.open(map, marker);
    marker.addListener('click', function () {
      infowindow.open(marker.get('map'), marker);
    });
    marker.addListener('drag', function () {
      MapFunctions.deleteMarkers();
    });
    marker.addListener('rightclick', function () {
      MapFunctions.deleteMarkers();
      React.render(React.createElement(LeftMainModal, null), document.getElementById('left-target'));
    });
    marker.addListener('dragend', function () {
      var newCenter = { lat: this.position.H, lng: this.position.L };
      map.setCenter(newCenter);
      MapFunctions.getNearbyPlaces(newCenter);
      map.setZoom(14);
    });
    mainMarker.push(marker);
  },

  setMapOnAll: function setMapOnAll(map, markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  },

  getUserLocation: function getUserLocation() {
    // GETS LAT LNG BASED ON BROWSER, CENTERS MAP, THEN GETS NEARBY PLACES

    function success(position) {
      MapFunctions.buildMap(position.coords.latitude, position.coords.longitude);
      MapFunctions.addMainMarker(position.coords.latitude, position.coords.longitude);
      center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      MapFunctions.getNearbyPlaces(center);
    }

    function failure(message) {
      alert("Please share location, it's how this site works 😊\nChange location setting and refresh for best results");
      MapFunctions.buildMap(44.9778, -93.2650);
      MapFunctions.addMainMarker(44.9778, -93.2650);
      center = new google.maps.LatLng(44.9778, -93.2650);
      MapFunctions.getNearbyPlaces(center);

      React.render(React.createElement(NoGeoLocation, null), document.getElementById('left-target'));
    }

    navigator.geolocation.getCurrentPosition(success, failure);
  },

  getNearbyPlaces: function getNearbyPlaces(center) {
    var request = {
      location: center,
      radius: defautSearchRadius,
      types: ['bar']
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function (results, status) {
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
  }

};

var React = require('react');

var NoGeoLocation = React.createClass({
  displayName: 'NoGeoLocation',

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h2',
        { className: 'center' },
        'Geolocation failed...I\'ve placed you in Minneapolis, MN'
      ),
      React.createElement(LeftMainModal, null),
      ';'
    );
  }
});

var LeftMainModal = React.createClass({
  displayName: 'LeftMainModal',

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        { className: 'center' },
        'Hover over an icon for more info'
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          'Right click on a place to remove it from the map.'
        ),
        React.createElement(
          'li',
          null,
          'Right click on the bouncing cat to remove all the icons'
        ),
        React.createElement(
          'li',
          null,
          'You can drag and drop the bouncing cat (if you can catch it) to a new location'
        ),
        React.createElement(
          'li',
          null,
          'Or just have fun and click below, the cat won\'t move too far at once...'
        )
      ),
      React.createElement(
        'button',
        { id: 'random-button', onClick: MapFunctions.randomLocation },
        'Random Cat Placement'
      )
    );
  }
});

var MainBackground = React.createClass({
  displayName: 'MainBackground',

  componentDidMount: function componentDidMount() {},

  render: function render() {
    return React.createElement(
      'div',
      { className: 'image-1' },
      React.createElement(
        'h1',
        { className: "page-1", id: '#page-1' },
        'Find a Bar'
      ),
      React.createElement(
        'a',
        { href: '#cool-modal' },
        React.createElement(
          'button',
          { className: 'page-1' },
          'Browse'
        )
      )
    );
  }
});

var BarHeading = React.createClass({
  displayName: 'BarHeading',

  render: function render() {
    if (this.props.reviews === undefined) {
      var reviewsList = "No reviews availabel 😥";
      this.props.rating = "Can't rate";
      this.props.ratingNum = 0;
    } else {
      var reviewsList = this.props.reviews.map(function (review, i) {
        return React.createElement(
          'p',
          { key: i },
          review.text
        );
      });
    }

    if (this.props.hours === "Hours unavailable 😕") {
      var hoursDeatails = "Business hours unavailable 😕";
    } else {
      var hoursDetails = this.props.hours.map(function (h, i) {
        return React.createElement(
          'p',
          { className: 'hours', key: i },
          h
        );
      });
    }

    return React.createElement(
      'div',
      { className: 'bar-detail' },
      React.createElement(
        'h1',
        { className: 'bar-head' },
        ' ',
        this.props.name,
        ' '
      ),
      React.createElement(
        'p',
        null,
        ' ',
        this.props.address,
        ' '
      ),
      React.createElement(
        'p',
        null,
        'Average Rating:  ',
        this.props.rating,
        '....',
        this.props.ratingNum,
        ' reviews'
      ),
      React.createElement(
        'p',
        null,
        ' ',
        hoursDetails,
        ' '
      ),
      React.createElement(
        'a',
        { href: this.props.website },
        ' ',
        this.props.website,
        ' '
      ),
      React.createElement(
        'p',
        null,
        ' ',
        reviewsList,
        ' '
      ),
      React.createElement('hr', null)
    );
  }
});

var RightMainModal = React.createClass({
  displayName: 'RightMainModal',

  componentDidMount: function componentDidMount() {
    MapFunctions.getUserLocation();
  },

  render: function render() {
    return React.createElement('div', { id: 'map' });
  }
});

React.render(React.createElement(MainBackground, null), document.getElementById("background"));
React.render(React.createElement(RightMainModal, null), document.getElementById('right-target'));