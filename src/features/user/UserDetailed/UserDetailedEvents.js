
import React from 'react'
import { Header,  Card, Image, Segment, Tab } from 'semantic-ui-react'
import { Link } from  'react-router-dom'

const panes= [
    {menuItem : 'All Events' , pane:{key:'allEvents'}},
    {menuItem : 'Past Events' , pane:{key:'pastEvents'}},
    {menuItem : 'Future Events' , pane:{key:'futureEvents'}},
    {menuItem : 'Hosting' , pane:{key:'hosting'}}
]

const UserDetailedEvents = ({ events, loading, changeTab }) => {
    let date = {}
    const handleDate= (eventDate)=>{
        date = typeof(eventDate)=="string" ? new Date(eventDate) : new Date(eventDate.seconds*1000)
        return date;
    }
    return (
        <Segment loading={loading} attached>
            <Header icon='calendar' content='Events' />
            <Tab onTabChange={(e,data)=>changeTab(e,data)} panes={panes} menu={{secondary:true , pointing:true}} />
            <br />
            <Card.Group itemsPerRow={5}>
                {
                    events && events.map(event => (
                    
                        <Card key={event.id} as={Link} to={`/events/${event.id}`}>

                            <Image src={`/assets/categoryImages/${event.category}.jpg`} />
                            <Card.Content>
                                <Card.Header textAlign='center'>
                                    {event.title}
                                </Card.Header>
                                <Card.Meta textAlign='center'>
                                    
                                    <div>{handleDate(event.date).toDateString()}</div>
                                    <div>{handleDate(event.date).toLocaleTimeString()}</div>
                                </Card.Meta>
                            </Card.Content>
                        </Card>
                        
                    ))
                }
            </Card.Group>

        </Segment>


    )
}

export default UserDetailedEvents
