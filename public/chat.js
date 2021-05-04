// const { join } = require("node:path");

const socket = io();
const submitForm = document.querySelector("#msg-form")
const msgInput = document.querySelector("#msg-input")
const chatConEl = document.querySelector(".chat-messages")
const usersCon = document.querySelector("#users")
const spaceName = document.querySelector("#space-name")

const { username, space } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
console.log(username, space)


// join chatSpace
socket.emit("space-joined", {
    username,
    space
})




submitForm.addEventListener("submit", e => {
    e.preventDefault()
    console.log(msgInput.value.trim())
    // pass message to server
    socket.emit("msg-chat", msgInput.value.trim())
    chatConEl.scrollTop = chatConEl.scrollHeight
    msgInput.value = ""

})
// Msg From Server
socket.on("all-users", ({ space, allUsers }) => {
    console.log(space)
    spaceName.innerText = space
    renderUsersToDom(allUsers)
})
socket.on("message", data => {
    console.log(data)
    renderMsgToDom(data)
})
const renderMsgToDom = dataPassed => {
    const msgHtml = `<div class="message  ${dataPassed.userName === username ? "me" : "others"}">
    <p class="meta">${dataPassed.userName || dataPassed} <span>${dataPassed.time || dataPassed}</span></p><p class="text ${dataPassed.userName === username ? "me" : "others"}">${dataPassed.message || dataPassed}</p>
    </div>`
    chatConEl.innerHTML += msgHtml
}
const renderUsersToDom = (users) => {
    console.log(users)
    usersCon.innerHTML = `
        ${users.map(user => `<li>${user.username} ${user.username === username ? "(you)" : ""}</li>`).join("")}`
}