import React, { Component } from 'react'
import TextArea from '../../../app/common/form/TextArea'
import {Field , reduxForm} from 'redux-form'
import { Form, Button } from 'semantic-ui-react'

class EventDetailedChatForm extends Component {

    handleCommentSubmit=(values)=>{
        const {addEventComment , reset , eventId ,handleCloseReplyForm, parentId} = this.props;
        addEventComment(eventId, values,parentId)
        reset()
        if(parentId!==0){
            handleCloseReplyForm()
        }
    }

    render() {
        
        return (
            <Form reply onSubmit={this.props.handleSubmit(this.handleCommentSubmit)}>
          <Field 
          type='text'
          component = {TextArea}
          rows={2}
          name="comment"
          placeholder="Comment"
          />
          <Button
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            primary
          />
        </Form>
        )
    }
}

export default reduxForm({Fields:'comment'})(EventDetailedChatForm)
