import React from 'react';
import { Form, Segment, Button, Divider } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import  {connect} from  'react-redux'
import { loginUser , socialLogin} from "../authActions"
import { Label } from 'semantic-ui-react'
import SocialLogin from '../SocialLogin/SocialLogin';

const actions = {
  loginUser,
  socialLogin
}

const LoginForm = ({loginUser , handleSubmit,submitting, error , socialLogin}) => {  //handleSubmit obtained from REDUX-FORM
  return (
    <Form  size="large" onSubmit = {handleSubmit(loginUser)}> {/*  handleSubmit passes the form info(email , password) to the login function on its own*/}  
      <Segment>
        <Field
          name="email"
          component={TextInput}
          type="text"
          placeholder="Email Address"
        />
        <Field
          name="password"
          component={TextInput}
          type="password"
          placeholder="password"
        />
        {error && <Label basic color="red">{error}</Label>}
        <Button fluid size="large" color="teal" loading={submitting}>
          Login
        </Button>
        <Divider horizontal>
            Or
          </Divider>
          <SocialLogin socialLogin={socialLogin} />
      </Segment>
    </Form>
  );
};

export default connect(null,actions)(reduxForm({form:'loginForm'})(LoginForm));