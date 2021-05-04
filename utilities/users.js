const users = []

function userJoin(id, username, space){
    const user = {id, username, space}
    
    users.push(user)
    return user;
}

function getCurrentUser(id){
    return users.find(user => user.id === id)
}
module.exports = {
    userJoin,
    getCurrentUser
}