import React from 'react'
import { Segment, Header, Image } from 'semantic-ui-react'
import LazyLoad from 'react-lazyload'

const UserDetailedPhotos = ({ photos }) => {
    return (
        <Segment attached>
            <Header icon='image' content='Photos' />

            <Image.Group size='small'>
                {photos.map(photo => (
                    <LazyLoad key={photo.id} height={150} placeholder={<Image src='/assets/user.png'/>}>
                        <Image  src={photo.url} />
                    </LazyLoad>
                
                ))}
            </Image.Group>
        </Segment>
    )
}


export default UserDetailedPhotos