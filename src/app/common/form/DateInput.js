import React from 'react'
import { Form, Label } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DateInput = ({
    placeholder,
    input:{value , onBlur , onChange},
    width,
    meta : {touched , error},
    ...rest
}) => {
    
    return (
        
        <Form.Field error={touched && !!error} width={width}>
            <DatePicker {...rest}
            placeholder = {placeholder}
            selected = {value ? new Date(value) :null} //converting a normal input string to object
            onChange = {onChange}
            onBlur = {onBlur}
            onChangeRaw = { (e)=>e.preventDefault()} //stops user from entering values, only sel is possible
            />
            { touched && error && <Label basic color="red">{error}</Label>}
        </Form.Field>
    )
}

export default DateInput