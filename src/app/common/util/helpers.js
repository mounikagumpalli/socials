export const objectToArray = (object) => {
    if (object) {
        return Object.entries(object).map(e => Object.assign({}, e[1], {id:e[0]}))
    }
}


export const createNewEvent  = (user,photoURL,event,displayName) => {
    return{
        ...event,
        hostUid : user.uid,
        hostedBy : displayName,
        hostPhotoURL : photoURL || '/asset/user.png',
        created: new Date(),
        attendees : {
            [user.uid] : {
                going : true,
                joinDate : new Date(),
                photoURL : photoURL || '/asset/user.png',
                displayName : displayName, 
                host : true
            }
        }
    }
}

export const createDataTree = dataset => {
    let hashTable = Object.create(null);
    dataset.forEach(a => hashTable[a.id] = {...a, childNodes: []});
    let dataTree = [];
    dataset.forEach(a => {
        if (a.parentId) hashTable[a.parentId].childNodes.push(hashTable[a.id]);
        else dataTree.push(hashTable[a.id])
    });
    return dataTree
};
