import React, { Component } from 'react';
import { Grid } from "semantic-ui-react";
import UserDetailedEvents from './UserDetailedEvents';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedSidebar from './UserDetailedSidebar';
import UserDetailedPhotos from './UserDetailedPhotos';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect , isEmpty} from 'react-redux-firebase';
import  { getUserEvents , followUser , unfollowUser } from '../userActions'

const query = ({ auth , userUid , match }) => {
    
    if(userUid){
        
        return [
            {
                collection: 'users',
                doc:userUid,
                storeAs:'profile'
            },
            {
            collection: 'users',
            doc: userUid,
            subcollections: [{ collection: 'photos' }],
            storeAs: 'photos'
        },
        {
            collection:'users',
            doc : auth.uid,
            subcollections:[{collection:'following' , doc:match.params.id}],
            storeAs:'following'
        }
    ]
    }
    else{
        return [{
            collection: 'users',
            doc: auth.uid,
            subcollections: [{ collection: 'photos' }],
            storeAs: 'photos'
        }]
    }
}

const mapState = (state,ownProps) => {
    let userUid = null;
    let profile ={}
   
    if(ownProps.match.params.id === state.firebase.auth.uid){
        profile = state.firebase.profile
        userUid = ownProps.match.params.id
    }else {
        profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0]  // listening to what the firestore is sending after querrying
        userUid = ownProps.match.params.id
    }
    return {
        profile,
        userUid,
        events : state.events.userEvents,
        loading: state.async.loading,
        auth: state.firebase.auth,
        photos: state.firestore.ordered.photos,
        requesting : state.firestore.status.requesting,
        following : state.firestore.ordered.following
    }
}

const actions ={
    getUserEvents,
    followUser,
    unfollowUser
}

class UserDetailedPage extends Component {

    async componentDidMount(){
        await this.props.getUserEvents(this.props.userUid)
    }

     changeTab =  (e,data) => {
         console.log(this.props.userUid)
        this.props.getUserEvents(this.props.userUid, data.activeIndex)
    }

    render() {
        const { unfollowUser , following, followUser , profile, photos , auth , match , events , loading} = this.props;
        const isCurrentUser = (auth.uid === match.params.id)
        const isFollowing = !isEmpty(following)  
        //const loading = Object.values(requesting).some(a => a==='true')
        //if(loading) return <LoadingComponent />
        
        return (
            <Grid>
                <Grid.Column width={16}>
                    <UserDetailedHeader profile={profile} />
                </Grid.Column>

                <Grid.Column width={12}>
                    <UserDetailedDescription profile={profile} />
                </Grid.Column>
                <Grid.Column width={4}>
                    <UserDetailedSidebar unfollowUser={unfollowUser} isFollowing={isFollowing} profile={profile} followUser={followUser} isCurrentUser={isCurrentUser} />
                </Grid.Column>

                {photos && photos.length > 0 && <Grid.Column width={12}>
                    <UserDetailedPhotos photos={photos} />
                </Grid.Column>}

                <Grid.Column width={12}>
                    <UserDetailedEvents events={events} loading={loading} changeTab={this.changeTab} />
                </Grid.Column>
            </Grid>

        );
    }
}

export default compose(
    connect(mapState , actions ),
    firestoreConnect((auth,userUid,match) => query(auth,userUid))
)(UserDetailedPage);