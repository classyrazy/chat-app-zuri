console.log(window.location.href)
var spaceNameOnJoin = new URLSearchParams(window.location.search).get("space")
console.log(spaceNameOnJoin)
if(spaceNameOnJoin){
    document.querySelector("#space").value = spaceNameOnJoin
}