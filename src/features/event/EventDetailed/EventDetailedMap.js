import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Icon, Segment } from 'semantic-ui-react'

const Marker = () => <Icon name="marker" size="large" color="red" />;

const zoom =11;

class EventDetailedMap extends Component {
  

  render() {
     const {lat , lng} =this.props
    return (
      // Important! Always set the container height explicitly
      <Segment attached="bottom" style={{padding:0}}>
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCLyVtlOd-jFLsE118g7lbpjLssAplF1ps' }}
          defaultCenter={{lat,lng}}
          defaultZoom={zoom}
        >
          <Marker
            lat={lat}
            lng={lng}
          />
        </GoogleMapReact>
      </div>
      </Segment>
    );
  }
}

export default EventDetailedMap;