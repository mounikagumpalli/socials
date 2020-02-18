import React, { Fragment } from 'react'
import { Segment, Image, Item, Header, Button, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
//import { format } from 'date-fns'



 const EventDetailedHeader = ({authenticated,
                                openModal,
                                loading, 
                                event, 
                                isHost, 
                                isGoing ,
                                 goingToEvent , 
                                 cancelGoingToEvent }) => {

 

  const eventImageStyle = {
    filter: 'brightness(30%)'
  };

  const eventImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
  };
  let date = (event && event.date) ? (typeof(event.date)=="string" ? new Date(event.date) : event.date.seconds && new Date(event.date.seconds*1000)) : ''
  
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: '0' }}>
        <Image src={`/assets/categoryImages/${event.category}.jpg`} fluid style={eventImageStyle} />

        <Segment basic style={eventImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={event.title}
                  style={{ color: 'white' }}
                />
                <p>{date && date.toDateString()}</p>
                <p>
                  Hosted by <Link to={`/profile/${event.hostUid}`} style={{color:'white'}}><strong>{event.hostedBy}</strong></Link>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached="bottom" clearing={true}>
      {
                  event.cancelled &&
                  <Label size="large" color="red" content="This event has been cancelled"/>
                }
        {!isHost &&
          <Fragment>
            
            {isGoing && !event.cancelled &&
                <Button onClick={()=>cancelGoingToEvent(event)}>Cancel My Place</Button>
             }
               { !isGoing && authenticated && !event.cancelled &&
                  <Button loading={loading} color="teal" onClick = {()=>goingToEvent(event)}>JOIN THIS EVENT</Button>
               }
                
                {   !authenticated && !event.cancelled &&
                    <Button loading={loading} color="teal" onClick = {()=>openModal('UnauthModal')}>JOIN THIS EVENT</Button>
                }
                
          </Fragment>}

        {isHost &&
          <Button as={Link} to={`/manageevent/${event.id}`} color="orange" floated="right">
            Manage Event
                </Button>}
      </Segment>
    </Segment.Group>
  )
}

export default EventDetailedHeader