const express = require("express")
const socket = require("socket.io")
const moment = require("moment")

const app = express();

// listen for request
const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`already listening on port ${port}`)
})
const zuriChatApp = "Zuri Chat App"
//middleware and static
app.use(express.static("public"))

//setting socket 
const io = socket(server);
const users = []
function userJoin(id, username, space) {
    const user = { id, username, space }

    users.push(user)
    return user;
}
function getCurrentUser(id) {
    return users.find(user => user.id === id)
}
function userleave(id) {
   const index =  users.findIndex(user => user.id === id)
   if(index != -1){
       return users.splice(index, 1)[0]
   }
   console.log(index)
}
function getSpaceUsers(space){
    return users.filter(user => user.space === space)
}

io.on("connection", socket => {

    console.log("New Connection")

    socket.on("space-joined", ({ username, space }) => {
        const user = userJoin(socket.id, username, space)
        socket.join(user.space)
        console.log(user)
        console.log(users)
        
        
        socket.broadcast.to(user.space).emit("message", {
            userName: zuriChatApp,
            message: `${user.username} has joined the space`,
            time: moment().format("h:mm a")
        })
        io.to(user.space).emit("all-users",{
            space:user.space,
            allUsers: getSpaceUsers(user.space)
        })

        socket.emit("message", {
            userName: zuriChatApp,
            message: "Welcome to Zuri Chat App",
            time: moment().format("h:mm a")
        })
        socket.on("typing", (data)=>{
            console.log(data)
            socket.broadcast.to(user.space).emit("typing",data)
        })


        socket.on("msg-chat", data => {
            const user = getCurrentUser(socket.id)
            io.to(user.space).emit("message", {
                userName: user.username,
                message: data,
                time: moment().format("h:mm a")
            })
        })
        
        socket.on("disconnect", () => {
            const user = userleave(socket.id)
            console.log(user)
            if(user){
                io.to(user.space).emit("message", {
                    userName: zuriChatApp,
                    message: `${user.username} has left the space`,
                    time: moment().format("h:mm a")
                })
                io.to(user.space).emit("all-users",{
                    space:user.space,
                    allUsers: getSpaceUsers(user.space)
                })
            }
            
            
        })

    })
    // socket.on("disconnect",()=>{
    //     io.emit("message", {
    //         userName: zuriChatApp,
    //         message: `A user has left the chat`,
    //         time: moment().format("h:mm a")
    //     })
    // })


})

