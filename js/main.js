var React        = require('react');


var NoGeoLocation = React.createClass({
  render: function(){
    return <div>
            <h2 className='center'>Geolocation failed...I've placed you in Minneapolis, MN 😘</h2>
            <LeftMainModal />;
           </div>
  },
});

var LeftMainModal = React.createClass({
  render: function(){
    return <div>
            <h1 className='center'>Hover over an icon for more info</h1>
            <ul>
              <li>Showing bars within 500 meters of the bouncing cat.</li>
              <li>Right click on a place to remove it from the map.</li>
              <li>Right click on the bouncing cat to remove all the icons from the map.</li>
              <li>You can drag and drop the bouncing cat (if you can catch it) to a new location.</li>
              <li>Or just have fun and click below, the cat won't move too far at once...</li>
            </ul>
            <button id='random-button' onClick={MapFunctions.randomLocation}>Random Cat Placement</button>
           </div>
  },
});

var MainBackground = React.createClass({


  render: function(){
                  return  <div className={'image-1'}>
                           <h1 className={"main"} id="#page-1">Find a Bar</h1>
                           <a href="#cssModal"><button className='page-1'>Browse</button></a>
                          </div>
                    },
});

var BarHeading = React.createClass({
  getDefaultProps: function(){
    return {rating: 'No ratings'};
  },
  render: function(){
    if (this.props.reviews === undefined) {
      var reviewsList = "No reviews availabel 😥";
      this.props.rating = "No ratings";
      this.props.ratingNum = 0;
    } else {
      var reviewsList = this.props.reviews.map(function(review, i){
        return <p key={i}>{review.text}</p>
      });
    }

    if (this.props.hours === "Hours unavailable 😕") {
      var hoursDeatails = "Business hours unavailable 😕";

    } else {
      var hoursDetails = this.props.hours.map(function(h,i){
        return <p className='hours' key={i}>{h}</p>
      });
    }


    return <div className='bar-detail'>
            <h1 className='bar-head'> {this.props.name} </h1>
            <p> {this.props.address} </p>
            <p>Average Rating:  {this.props.rating} from {this.props.ratingNum} reviews</p>
            <p> {hoursDetails} </p>
            <a href={this.props.website}> {this.props.website} </a>
            <h3>Reviews</h3>
            <p> {reviewsList} </p>
            <hr />
           </div>
    },
});

var RightMainModal = React.createClass({

  componentDidMount: function(){
    MapFunctions.getUserLocation();
  },

  render: function(){
    return  <div id='map'>
             </div>;

  },
});


React.render(<MainBackground />, document.getElementById("background"));
React.render(<RightMainModal />, document.getElementById('right-target'));
