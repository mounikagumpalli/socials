import React from 'react'
import { Form, Select, Label } from 'semantic-ui-react'

export const SelectInput = ({input , placeholder , type , multiple , options , meta:{error, touched}}) => {
    return (
        <Form.Field error={touched && !!error}>
            <Select {...input} 
            value = {input.value || null}
            onChange = {(e,data)=>input.onChange(data.value)} //e is the event , data is the item selected from the drop down list 
            placeholder = {placeholder}
            options = {options}
            multiple = {multiple}
            />
            { touched && error && <Label basic color="red">{error}</Label>}
        </Form.Field>
    )
}
