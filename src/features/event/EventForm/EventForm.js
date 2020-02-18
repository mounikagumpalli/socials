/* global google */
import React, { Component , Fragment} from 'react'
import { Button, Segment, Form, Header, Grid, GridColumn } from 'semantic-ui-react'
import {connect} from 'react-redux'
import { createEvt , updateEvt , cancelToggle } from '../eventActions'
import {reduxForm , Field} from 'redux-form'
import {geocodeByAddress , getLatLng}  from 'react-places-autocomplete'
import {combineValidators , composeValidators , isRequired , hasLengthGreaterThan} from 'revalidate'
import TextInput from '../../../app/common/form/TextInput'
import TextArea from '../../../app/common/form/TextArea'
import { SelectInput } from '../../../app/common/form/SelectInput'
import DateInput from '../../../app/common/form/DateInput'
import PlaceInput from '../../../app/common/form/PlaceInput'
import { withFirestore } from 'react-redux-firebase'


const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];

const mapState = (state,ownProps) => {
  const evtId= ownProps.match.params.id 
  let event = {}
  let date = ""
  
  if(state.firestore.ordered.events && state.firestore.ordered.events.length > 0){
      event = state.firestore.ordered.events.filter(event => event.id === evtId)[0] || {};
     //date = !event.date.seconds ==='undefined' && typeof(event.date)=="string" ? new Date(event.date) : new Date(event.date.seconds*1000) 
     date = (event && event.date) ? (typeof(event.date)=="string" ? new Date(event.date) : event.date.seconds && new Date(event.date.seconds*1000)) : ''
  }
  return {
  
    initialValues : {
      ...event,
      date : date
    },
    event,
    loading : state.async.loading
  }

}

const actions = {
  createEvt,
  updateEvt,
  cancelToggle
}

const validate = combineValidators ({
  title : isRequired({message : 'Title is required'}),
  category : isRequired({message : 'Category is required'}),
  description : composeValidators(
    isRequired({message : 'desc is required'}),
    hasLengthGreaterThan(4)({message : 'Length should be greater than 4'})
  )(),
// city : isRequired('city'),
// venue : isRequired('venue'),
date : isRequired('date')
})

class EventForm extends Component {
  //this can be also done using fireStoreConnect as it listens to chhanges continously, but it was not needed as this component did not expect any changes to the display content intially. CAncle/reacvtivate we added late. #174 
  async componentDidMount(){
    const {firestore,match} = this.props;
         await firestore.setListener(`events/${match.params.id}`)        //Listen to all the changes , set manually to listen to the cancel/reactivTE activities
  }

  async componentWillUnmount(){
    const {firestore,match} = this.props;
         await firestore.unsetListener(`events/${match.params.id}`)     // Unset is mandatory when set manually    
  }

  state = {
    cityLatLng : {},
    venueLatLng : {}
  }
 
//normal forms give access to Event object where as forms give acess to values directly.
//with redux forms we do not have to use e.preventDefault();
  onFormSubmit = async (values) => {
    values.venueLatLng = this.state.venueLatLng
    try {
      if(this.props.initialValues.id){
        // As we switch betweeen pages , we are losing the latlong values(as these dont come from form), hhhence we are setting this #173
        if(Object.keys(values.venueLatLng).length === 0){    //venueLatLong is an object and cannot be checked just by matcing it to null.. an empty object will have no keys
              values.venueLatLng = this.props.event.venueLatLng
        }
     await this.props.updateEvt(values)
      this.props.history.push(`/events/${this.props.initialValues.id}`)
    }
    else{
    
        let createdEvent = await this.props.createEvt(values)
         this.props.history.push(`/events`)
    }
  } catch(err){
    console.log(err)
  }
    
  }

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
    .then(results=>getLatLng(results[0])) //geocodebyadd returns an array which is used hhere to obtain latlng values
    .then(latlng => {
      this.setState({
        cityLatLng : latlng               //local state is set from the prev obtained latlng values
      })
    })
    .then (()=>{
      this.props.change('city',selectedCity) //as we are handling onSelect on our own , to display the complete selected value in the form field we need to use the redux form prop and set it here
    })
  }

  handleCitySelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
    .then(results=>getLatLng(results[0])) 
    .then(latlng => {
      this.setState({
        venueLatLng : latlng              
      })
    })
    .then (()=>{
      this.props.change('venue',selectedVenue) 
    })
  }

 
    render() {
    const  {loading,initialValues , history , invalid, submitting , pristine , event , cancelToggle} = this.props //last 3 values from Redux forms
        return (
            <Grid>
              <GridColumn width={10}>
              <Fragment>
                      <Segment>
                        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)} autoComplete="off">
                          <Header sub content="Event Details" color="teal" />
                          <Field name="title" placeholder="Give your event a name" component={TextInput} /> 
                          {/* Multiple action can be used in below field by setting it to true, multiple={true} */}
                          <Field name="category" placeholder="What is your event about?" component={SelectInput} options={category} /> 
                          <Field name="description" placeholder="Tell us about your event" component={TextArea} rows={3} /> 
                          <Header sub content="Event Location Details" color="teal" /> 
                          <Field name="city" placeholder="Event city" component={PlaceInput} options={{type : [('cities')]}} onSelect={this.handleCitySelect} /> 
                          <Field name="venue" placeholder="Event venue" component={PlaceInput} options={{location : new google.maps.LatLng(this.state.cityLatLng), radius:1000 , type:['establishments'] } } onSelect={this.handleCitySelect} /> 
                          <Field 
                          name="date" 
                          component={DateInput} 
                          placeholder="Event Date" 
                          dateFormat = "hh LLL yyyy h:mm a"
                          showTimeSelect
                          timeFormat="HH:mm"
                          /> 
                          
                          <Button loading={loading} positive type="submit" disabled = {invalid || pristine || submitting}>
                            Submit
                          </Button>
                          {/* with history.goback, arrow funct was not necessary as we wer not passng any param,
                            function with parenthhesis gets invoked as soon as it is called. hhence use arow funcs.
                          */}
                          <Button disabled={loading} type="button"
                          onClick={
                            initialValues.id ? ()=>history.push(`/events/${initialValues.id}`) :
                            ()=>history.push('/events')
                          }>Cancel</Button>
                          {event.id &&
                            <Button 
                          type="button"
                          color = {event.cancelled ? 'green' : 'red'}
                          floated = "right"
                          content ={event.cancelled ? 'Reactivate Event' : 'Cancel Event'}
                          onClick = {()=>cancelToggle(!event.cancelled,event.id)}
                          />}

                        </Form>
                      </Segment>
            </Fragment>
              </GridColumn>
            </Grid>
        )
    }
}

//ordering is important, in thhis way we get proper acesss to initalValues property;

export default withFirestore(connect(mapState,actions)(reduxForm({form:'eventForm',validate, enableReinitialize: true})(EventForm)))
