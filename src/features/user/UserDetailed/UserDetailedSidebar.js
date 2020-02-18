import React from 'react'
import { Segment, Button } from 'semantic-ui-react'
import {Link} from 'react-router-dom'

const UserDetailedSidebar = ({unfollowUser , isCurrentUser, profile , followUser , isFollowing}) => {
    return (
        <Segment>
           {
           isCurrentUser ?
            <Button as={Link} to="/settings" color='teal' fluid basic content='Edit Profile' /> :
            (isFollowing ?
            <Button onClick={()=>{unfollowUser(profile)}} color='teal' fluid basic content='Unfollow User' />:
            <Button onClick={()=>{followUser(profile)}} color='teal' fluid basic content='Follow User' />)
        }
        </Segment>
    )
}

export default UserDetailedSidebar
