import React from 'react'
import PlacesAutoComplete from 'react-places-autocomplete'
import { Form, Label, Segment, List } from 'semantic-ui-react'

const PlaceInput = ({
    placeholder,
    width,
    options,
    onSelect,
    input: {onChange,onBlur,value},
    meta: {error,touched}
}) => {
    return (
        <PlacesAutoComplete
        value = {value}
        onChange ={onChange}
        searchOptions = {options}
        onSelect = {onSelect}
        >
        {/* this gets displayed on the screen. PlcsAutoCMplt passes down few props
            getInput props is from PAC, rest of it come from google api call.
        */}
{({getInputProps,suggestions,getSuggestionItemProps, loading }) => (
    <Form.Field error={touched && !!error} width={width}>
        <input {...getInputProps({placeholder,onBlur})} />
        {touched && error && <Label basic color="red">{error}</Label>}   
        {   suggestions.length >0 && 
        <Segment style={{marginTop:0, width:"100%" , position:"absolute" , zIndex:1}}>
        {loading && <div>loading...</div>}
            <List selection>
                {
                    suggestions && suggestions.map(suggestion => (

                        <List.Item {...getSuggestionItemProps(suggestion)}>
                            <List.Header>
                                {suggestion.formattedSuggestion.mainText }
                            </List.Header>
                            <List.Description>
                                { suggestion.formattedSuggestion.secondaryText }
                            </List.Description>
                        </List.Item>
                    )
                        )
                }
            </List>
        </Segment>}
    </Form.Field>
)}
        </PlacesAutoComplete>
    )
}

export default PlaceInput
