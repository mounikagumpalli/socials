import React, { Component , Fragment } from 'react'
import { Icon, Segment, List, Button, Item, Label } from 'semantic-ui-react'
import EventListAttendee from './EventListAttendee'
import {Link} from 'react-router-dom'
import { objectToArray } from '../../../app/common/util/helpers'



class EventListItem extends Component {
  
    
    render() {
        const {event} = this.props
        const date = typeof(event.date)=="string" ? new Date(event.date) : new Date(event.date.seconds*1000)
        
        return (
            <Fragment>
                     <Segment.Group>
                        <Segment>
                          <Item.Group>
                            <Item>
                              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
                              <Item.Content>
                                <Item.Header as={Link} to={`/events/${event.id}`}>{event.title}</Item.Header>
                                <Item.Description>
                                  Hosted by <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link>
                                </Item.Description>
                                {event.cancelled &&
                                  <Label
                                ribbon = 'right'
                                color = 'red'
                                content = "This event has been cancelled"
                                style ={{top:-40}}
                                />}
                              </Item.Content>
                            </Item>
                          </Item.Group>
                        </Segment>
                        <Segment>
                          <span>
                            <Icon name="clock" /> {date.toDateString()} at  {date.toLocaleTimeString()} 
                               {/* {date.getUTCHours()}:{date.getUTCMinutes()}  */}
                            <Icon name="marker" /> {event.venue}
                          </span>
                        </Segment>
                        <Segment secondary>
                          <List horizontal>
                            {
                                event.attendees && objectToArray(event.attendees).map((attendee) => (
                                    <EventListAttendee key={attendee.id} attendee={attendee} />
                                ))
                            }
                            </List>
                        </Segment>
                        <Segment clearing>
                            <span>{event.description}</span>
                          <Button as={Link} exact to={`/events/${event.id}`} color="teal" floated="right" content="View" />
                        </Segment>
                      </Segment.Group>
            </Fragment>
        )
    }
}

export default EventListItem
