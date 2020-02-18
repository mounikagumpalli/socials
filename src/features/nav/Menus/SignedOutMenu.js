import React  from 'react'
import { Menu, Button } from 'semantic-ui-react'

export const SignedOutMenu = (props) => {
   const {signOut , register} = props
    return (
       
            <Menu.Item position="right">
                        <Button basic inverted content="Login" onClick={signOut}/>
                        <Button basic inverted content="Register" onClick={register}/>
                      </Menu.Item>
        
    )
}
