const currentUsername = document.getElementById("currentUsername").textContent
console.log(currentUsername)
const table = document.getElementById("dataUser")
const tbody = document.createElement("tbody")

fetch("/user/currentUser")
.then(res => res.json())
.then(json => showUserData(json))

function showUserData(json) {
    let arr = []
    for (let i = 0; i < json["roles"].length; i++) {
        arr.push(json["roles"][i]["normalName"])
    }

    const tr = document.createElement("tr");
    const currentId = document.createElement("td");
    currentId.innerText = json["id"]
    const currentFirstName = document.createElement("td");
    currentFirstName.innerText = json["firstName"]
    const currentLastName = document.createElement("td");
    currentLastName.innerText = json["lastName"]
    const currentAge = document.createElement("td");
    currentAge.innerText = json["age"]
    const currentEmail = document.createElement("td");
    currentEmail.innerText = json["email"]
    const currentRoles = document.createElement("td");
    currentRoles.innerText = arr.join(" ")

    tr.appendChild(currentId);
    tr.appendChild(currentFirstName);
    tr.appendChild(currentLastName);
    tr.appendChild(currentAge);
    tr.appendChild(currentEmail);
    tr.appendChild(currentRoles);
    tbody.appendChild(tr)
    table.appendChild(tbody)
}