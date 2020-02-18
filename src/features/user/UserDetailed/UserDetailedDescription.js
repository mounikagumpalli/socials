import React from 'react'
import { Segment, Grid, Header, List, Item, Icon } from 'semantic-ui-react'
import { format } from 'date-fns';

const UserDetailedDescription = ({ profile }) => {
    let createdAt;
    if (profile.createdAt) {
        createdAt = format(profile.createdAt.toDate(), 'dd LLL yyyy')

    }
    return (
        <Segment>
            <Grid columns={2}>
                <Grid.Column width={10}>
                    <Header icon='smile' content='About Display Name' />
                    <p>I am a: <strong>{profile.occupation || 'unknown'}</strong></p>
                    <p>Originally from <strong>{profile.origin || 'unknown'}</strong></p>
                    <p>Member Since: <strong>{createdAt}</strong></p>
                    <p>{profile.description}</p>

                </Grid.Column>
                <Grid.Column width={6}>

                    <Header icon='heart outline' content='Interests' />
                    {profile.interests ?
                        <List>
                        {profile.interests &&
                            profile.interests.map((interest , i) => (
                                <Item key={i}>
                                    <Icon name='heart' />
                                    <Item.Content>{interest}</Item.Content>
                                </Item>
                            ))
                        }
                    </List> : <p>No interests</p>}
                </Grid.Column>
            </Grid>

        </Segment>
    )
}

export default UserDetailedDescription