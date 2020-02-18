import React from 'react'
import { Segment, Item, Header } from 'semantic-ui-react'
import LazyLoad from 'react-lazyload'
//import { differenceInYears } from 'date-fns';

const UserDetailedHeader = ({ profile }) => {
    // let age;
    // if (profile.dateOfBirth) {
    //     // age = differenceInYears(Date.now(), profile.dateOfBirth.toDate())
    //     age = 27
    // }
    // else {
    //     age = 'Unknown'
    // }

    return (
        <Segment>
            <Item.Group>
                <Item>
                    <LazyLoad
                        height={150}
                        placeholder={<Item.Image size='small' src='/assets/user.png' />}>


                        <Item.Image
                            avatar
                            size='small'
                            src={profile.photoURL || '/assets/user.png'} />
                    </LazyLoad>

                    <Item.Content verticalAlign='bottom'>
                        <Header as='h1'>{profile.displayName}</Header>
                        <br />
                        <Header as='h3'>{profile.occupation}</Header>
                        <br />
                        <Header as='h3'> Lives in {profile.city || 'Unknown city'}</Header>
                    </Item.Content>
                </Item>
            </Item.Group>

        </Segment>
    )
}


export default UserDetailedHeader
