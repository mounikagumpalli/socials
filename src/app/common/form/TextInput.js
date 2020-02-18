import React from 'react'
import { Form, Label } from 'semantic-ui-react'

 const TextInput = ({
    input, 
    type, 
    width,
    placeholder,
    meta:{touched,error}}) => {
    return (
        
        <Form.Field error={touched && !!error} width={width} >
            <input {...input}  type={type} placeholder={placeholder} ></input>
    { touched && error && <Label basic color="red">{error}</Label> }
        </Form.Field>
    )
}
                            
export default TextInput