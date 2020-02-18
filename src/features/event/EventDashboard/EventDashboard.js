import React, { Component , createRef} from 'react'
import { Grid, GridColumn,Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'
import EventList from '../EventList/EventList'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import EventActivity from '../EventActivity/EventActivity'
import { firestoreConnect } from 'react-redux-firebase'
import { getEventsForDashboard } from '../eventActions'


const query = [{
    collection:'activity',
    orderBy:['timestamp','desc'],
    limit:5
}]

const mapState = (state) => ({
  events : state.events.events,                                              //state.firestore.ordered.events,
  loading : state.async.loading,
  activities : state.firestore.ordered.activity
})

const actions = {
    getEventsForDashboard
}



class EventDashboard extends Component {
    contextRef = createRef()
    state = {
        moreEvents :false,
        loadingInitial : true,
        loadedEvents : []
        }
  async  componentDidMount() {
        let next = await this.props.getEventsForDashboard();

        if(next && next.docs && next.docs.length > 1){
            
            this.setState({
                moreEvents : true,
                loadingInitial : false
            })
        }
    }

    getNextEvents = async () => {
        const {events} = this.props
        let lastEvent = events && events[events.length-1]
        let next = await this.props.getEventsForDashboard(lastEvent);
        if(next && next.docs.length <= 1){
            this.setState({
                moreEvents : false
            })
        }
    }

    componentDidUpdate = (prevProps) => {
        // Compare new props with prevprops
        if (this.props.events !== prevProps.events){
            this.setState({
                loadedEvents : [...this.state.loadedEvents, ...this.props.events]
            })
        }
    }

    render() {
        
        const {loading , activities } = this.props;
               
        
        if(this.state.loadingInitial) return <LoadingComponent />


        return (
            <div>
                <Grid>
                    <GridColumn width="10">
                        <div ref={this.contextRef}>
                        <EventList 
                        events={this.state.loadedEvents}
                        getNextEvents={this.getNextEvents}
                        loading={loading}
                        moreEvents={this.state.moreEvents}/>
                            
                        </div>
                        
                        {/* <Button 
                        loading = {loading}
                        onClick={this.getNextEvents}
                        positive
                        floated= "right" 
                        content="More events"
                        disabled ={!this.state.moreEvents}/> */}
                    </GridColumn>
                    <GridColumn width="6">
                        
                       <EventActivity activities={activities} contextRef={this.contextRef}/>
                    </GridColumn>
                    <GridColumn width={10}>
                        <Loader active={loading} />
                    </GridColumn>
                </Grid>
            </div>
        )
    }
}

export default connect(mapState, actions)(firestoreConnect(query)(EventDashboard))
