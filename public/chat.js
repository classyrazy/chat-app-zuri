// const { join } = require("node:path");

const socket = io();
const submitForm = document.querySelector("#msg-form")
const msgInput = document.querySelector("#msg-input")
const chatConEl = document.querySelector(".chat-messages")
const usersCon = document.querySelector("#users")
const spaceName = document.querySelector("#space-name")
const feedback = document.querySelector("#feed-back")
const shareInput = document.querySelector(".share-input")
const shareBtn = document.querySelector(".share-btn")

const { username, space } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
console.log(username, space)
console.log(window.location.href)


// join chatSpace
socket.emit("space-joined", {
    username,
    space
})
shareInput.value = window.location.origin + `/index.html?space=${space}`
shareBtn.addEventListener("click",()=>{
    shareInput.select()
    document.execCommand("copy")
    let copiedMsg = document.querySelector(".copied-msg")
    copiedMsg.innerText = "Copied to clipboard You can now share to others to join"
    setTimeout(()=>{
        copiedMsg.innerText = ""
    }, 4000)
})



submitForm.addEventListener("submit", e => {
    e.preventDefault()
    console.log(msgInput.value.trim())
    // pass message to server
    socket.emit("msg-chat", msgInput.value.trim())
    console.log(chatConEl.scrollHeight)
    chatConEl.scrollTop = (chatConEl.scrollHeight + 8000)
    console.log(chatConEl.scrollTop)
    msgInput.value = ""

})
msgInput.addEventListener("keypress", ()=>{
    console.log(socket.emit("typing",username))
    socket.emit("typing",username)
})
// Msg From Server
socket.on("all-users", ({ space, allUsers }) => {
    console.log(space)
    spaceName.innerText = space
    renderUsersToDom(allUsers)
})
socket.on("message", data => {
    feedback.innerHTML = "";
    console.log(data)
    renderMsgToDom(data)
})
socket.on("typing",(user) =>{
    feedback.innerHTML = `<em>${user} is typing a mesaage</em>`
})
const renderMsgToDom = dataPassed => {
    const msgHtml = `<div class="message  ${dataPassed.userName === username ? "me" : "others"}">
    <p class="meta">${dataPassed.userName || dataPassed} <span>${dataPassed.time || dataPassed}</span></p><p class="text ${dataPassed.userName === username ? "me" : "others"}">${dataPassed.message || dataPassed}</p>
    </div>`
    chatConEl.innerHTML += msgHtml
    chatConEl.scrollTop = (chatConEl.scrollHeight + 8000)
}
const renderUsersToDom = (users) => {
    console.log(users)
    usersCon.innerHTML = `
        ${users.map(user => `<li>${user.username} ${user.username === username ? "(you)" : ""}</li>`).join("")}`
}