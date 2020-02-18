import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import EventDetailedHeader from './EventDetailedHeader'
import { EventDetailedInfo } from './EventDetailedInfo'
import { EventDetailedChat } from './EventDetailedChat'
import { EventDetailedSidebar } from './EventDetailedSidebar'
import { withFirestore , firebaseConnect , isEmpty} from 'react-redux-firebase'
import { compose } from 'redux'
import { objectToArray , createDataTree } from '../../../app/common/util/helpers'
import { goingToEvent, cancelGoingToEvent  } from '../../user/userActions'
import { addEventComment } from '../eventActions'
import { openModal } from '../../modals/modalActions'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import NotFound from '../../../app/layout/NotFound'

const mapState = (state, ownProps) => {
    const evtId = ownProps.match.params.id
    let event = {}
    if (state.firestore.ordered.events && state.firestore.ordered.events.length > 0) {
        event = state.firestore.ordered.events.filter(event => event.id === evtId)[0] || {}
    }
    return {
        event,
        auth: state.firebase.auth,
        eventChat : !isEmpty(state.firebase.data.event_chat) &&
        objectToArray(state.firebase.data.event_chat[ownProps.match.params.id]) ,
        loading:state.async.loading,
        requesting: state.firestore.status.requesting
    }

}

const actions = {
    goingToEvent,
    cancelGoingToEvent,
   addEventComment,
   openModal

}


class EventDetailed extends Component {

    async componentDidMount() {
        const { firestore, match } = this.props;
        await firestore.setListener(`events/${match.params.id}`)   //button should change in header when a user joins or unjoins an event
    }

    async componentWillUnmount() {
        const { firestore, match } = this.props;
        await firestore.unsetListener(`events/${match.params.id}`)
    }

    render() {

        const { match , requesting , openModal , loading, event, auth, goingToEvent, cancelGoingToEvent,addEventComment , eventChat } = this.props
        const authenticated = auth.isLoaded && !auth.isEmpty;
        const attendees = event && event.attendees && objectToArray(event.attendees).sort((a,b)=>{
            return a.joinDate.toDate() - b.joinDate.toDate()
        })
        const isHost = auth.uid === event.hostUid
        const isGoing = attendees && attendees.some(a => a.id === auth.uid)
        const chatTree = !isEmpty(eventChat) && createDataTree(eventChat)
        const loadingEvent = requesting[`events/${match.params.id}`]

        if (loadingEvent) return <LoadingComponent />
        if(Object.keys(event).length === 0 ) return <NotFound />
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventDetailedHeader
                        authenticated={authenticated}
                        openModal={openModal}
                        event={event}
                        isHost={isHost}
                        isGoing={isGoing}
                        goingToEvent={goingToEvent}
                        cancelGoingToEvent={cancelGoingToEvent}
                        loading={loading}
                    />
                    <EventDetailedInfo event={event} />
                    {
                    authenticated &&    
                    <EventDetailedChat 
                    eventId={event.id} 
                    addEventComment={addEventComment}
                    eventChat={chatTree} />}
                </Grid.Column>
                <Grid.Column width={6}>
                    <EventDetailedSidebar attendees={attendees} />
                </Grid.Column>
            </Grid>
        )
    }
}

export default compose(
    withFirestore,
    connect(mapState, actions),
    firebaseConnect((props)=>([`event_chat/${props.match.params.id}`]))
)(EventDetailed)