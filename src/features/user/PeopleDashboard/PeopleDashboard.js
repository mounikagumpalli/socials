import React from 'react';
import { Grid, Segment, Header, Card } from 'semantic-ui-react';
import PersonCard from './PersonCard';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'

const query = ({ auth }) => {
  return [{
    collection: 'users',
    doc: auth.uid,
    subcollections: [{ collection: 'followers' }],
    storeAs: 'followers'
  },
  {
    collection: 'users',
    doc: auth.uid,
    subcollections: [{ collection: 'following' }],
    storeAs: 'following'
  }]
}

const mapState = (state) => ({
  auth: state.firebase.auth,
  followers: state.firestore.ordered.followers,
  followings: state.firestore.ordered.following
})


const PeopleDashboard = ({ followers, followings, auth }) => {
  
  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment>
          <Header dividing content="People following me" />
          <Card.Group itemsPerRow={8} stackable>
            {
              followers && followers.map(follower => <PersonCard key={follower.id} user={follower} />)
            }

          </Card.Group>
        </Segment>
        <Segment>
          <Header dividing content="People I'm following" />
          <Card.Group itemsPerRow={8} stackable>
            {
              followings && followings.map(following => <PersonCard key={following.id} user={following} />)
            }
          </Card.Group>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default compose(
  connect(mapState),
  firestoreConnect(auth => query(auth))
)(PeopleDashboard);