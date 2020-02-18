import React , { useState  } from 'react'
import { Segment, Grid, Icon, Button } from 'semantic-ui-react'
import EventDetailedMap from './EventDetailedMap'


export const EventDetailedInfo = ({event}) => {
  //const evtDateTime = event.date && format(event.date.toDate(),'EEEE do LLLL ') + ' at ' + format(event.date.toDate(),'h:mm a') 
  //console.log('evetdetainfo'+evtDateTime)
  const [isMapOpen, showMapToggle] = useState(false)
  let date = (event && event.date) ? (typeof(event.date)=="string" ? new Date(event.date) : event.date.seconds && new Date(event.date.seconds*1000)) : ''
    return (
           <Segment.Group>
              <Segment attached="top">
                <Grid>
                  <Grid.Column width={1}>
                    <Icon size="large" color="teal" name="info" />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <p>{event.description}</p>
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment attached>
                <Grid verticalAlign="middle">
                  <Grid.Column width={1}>
                    <Icon name="calendar" size="large" color="teal" />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <span>{date && date.toDateString()} at { date && date.toLocaleTimeString()} </span>
                    
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment attached>
                <Grid verticalAlign="middle">
                  <Grid.Column width={1}>
                    <Icon name="marker" size="large" color="teal" />
                  </Grid.Column>
                  <Grid.Column width={11}>
                    <span>{event.venue}</span>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Button color="teal" 
                    size="tiny" 
                    content= {isMapOpen ? "Hide Map" : "Show Map"} 
                    onClick={()=>showMapToggle(!isMapOpen)} />
                  </Grid.Column>
                </Grid>
              </Segment>
              
                {
                  isMapOpen && <EventDetailedMap lat={event.venueLatLng.lat} lng={event.venueLatLng.lng} />
                }
              
            </Segment.Group>
    )
}
