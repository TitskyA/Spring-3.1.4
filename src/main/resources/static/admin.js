const table = document.querySelector(".table");
const tbody = document.createElement("tbody")

fetch('/admin/allUsers')
    .then(res => res.json())
    .then(json => getTableData(json))

const getTableData = data => {
    data.forEach(x => {
        let arr = []
        for (let i = 0; i < x["roles"].length; i++) {
            arr.push(x["roles"][i]["normalName"])
        }
        addUserInTable(x["id"], x["firstName"], x["lastName"], x["age"], x["email"], arr)
    })
    table.appendChild(tbody);
}

const newUserButton = document.getElementById("newUserButton");
newUserButton.addEventListener('click', saveNewUser)

function saveNewUser() {
    const newId = table.getElementsByTagName("tr").length
    const newFirstName = document.getElementById("newFirstName").value;
    const newLastName = document.getElementById("newLastName").value;
    const newAge = document.getElementById("newAge").value;
    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;
    let newRoles = [];
    let rolesNames = []
    const options = document.getElementById("newRoles").options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            newRoles.push(options[i].value)
            rolesNames.push(options[i].value.split("ROLE_")[1])
        }
    }
    fetch('/admin/saveUser', {
        method: 'POST',
        body: JSON.stringify({
            firstName: newFirstName,
            lastName: newLastName,
            age: newAge,
            email: newEmail,
            password: newPassword,
            roles: newRoles
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
        .then(response => response.json())
    addUserInTable(newId, newFirstName, newLastName, newAge, newEmail, rolesNames)
    document.getElementById("tabAllUser").click()
}

function addUserInTable(id, firstName, lastName, age, email, roles) {

    const tr = document.createElement("tr");
    tr.setAttribute("id", "row" + id)
    const userId = document.createElement("td");
    userId.innerText = id
    const UserFirstName = document.createElement("td");
    UserFirstName.innerText = firstName
    const userLastName = document.createElement("td");
    userLastName.innerText = lastName
    const userAge = document.createElement("td");
    userAge.innerText = age
    const userEmail = document.createElement("td");
    userEmail.innerText = email
    const userRoles = document.createElement("td");
    userRoles.innerText = roles.join(" ");
    const edit = document.createElement("td")
    edit.insertAdjacentHTML( 'beforeend',
        `<button type="button" class="btn btn-info" name="edit" id="edit${id}" data-toggle="modal" data-target="#editModal">Edit</button>`
    );
    const remove = document.createElement("td")
    remove.insertAdjacentHTML( 'beforeend',
        `<button type="button" class="btn btn-danger" name="delete" id="delete${id}" data-toggle="modal" data-target="#deleteModal">Delete</button>`
    );
    tr.appendChild(userId);
    tr.appendChild(UserFirstName);
    tr.appendChild(userLastName);
    tr.appendChild(userAge);
    tr.appendChild(userEmail);
    tr.appendChild(userRoles);
    tr.appendChild(edit)
    tr.appendChild(remove);
    tbody.appendChild(tr)
}


table.addEventListener('click', e => {
    let editButtonPressed = e.target.name === 'edit';
    let deleteButtonPressed = e.target.name === 'delete'

    if (editButtonPressed) {
        let id = e.target.id.split("edit")[1]
        fetch('/admin/getUser/' + id)
            .then(res => res.json())
            .then(json => editForm(json['id'], json['firstName'], json['lastName'], json['age'], json['email'], json['password']))
        document.getElementById("editUserButton").addEventListener('click', e => {
            e.preventDefault()
            saveChanges()
        })
    }
    if (deleteButtonPressed) {
        let id = e.target.id.split("delete")[1]
        fetch('/admin/getUser/' + id)
            .then(res => res.json())
            .then(json => deleteForm(json['id'], json['firstName'], json['lastName'], json['age'], json['email'], json['password']))
        document.getElementById("deleteUserButton").addEventListener('click', e => {
            e.preventDefault()
            deleteUser(id)
        })
    }

    function editForm(id, firstName, lastName, age, email, password) {
        document.getElementById("editId").setAttribute("value", id)
        document.getElementById("editFirstName").setAttribute("value", firstName)
        document.getElementById("editLastName").setAttribute("value", lastName)
        document.getElementById("editAge").setAttribute("value", age)
        document.getElementById("editEmail").setAttribute("value", email)
        document.getElementById("editPassword").setAttribute("value", password)
    }

    function saveChanges() {
        const editId = document.getElementById("editId").value
        const editFirstName = document.getElementById("editFirstName").value
        const editLastName = document.getElementById("editLastName").value
        const editAge = document.getElementById("editAge").value
        const editEmail = document.getElementById("editEmail").value
        const editPassword = document.getElementById("editPassword").value
        let editRoles = [];
        const options = document.getElementById("editRoles").options;

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {editRoles.push(options[i].value)}
        }
        fetch('/admin/update', {
            method: 'PATCH',
            body: JSON.stringify({
                id: editId,
                firstName: editFirstName,
                lastName: editLastName,
                age: editAge,
                email: editEmail,
                password: editPassword,
                roles: editRoles
            }),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
            .then(response => response.json())
        let row = document.getElementById("row" + editId)
        const columns = row.getElementsByTagName("td")
        columns[0].innerText = editId
        columns[1].innerText = editFirstName
        columns[2].innerText = editLastName
        columns[3].innerText = editAge
        columns[4].innerText = editEmail
        let arr = [];
        for (let i=0; i < editRoles.length; i++) {
            arr.push(editRoles[i].split("ROLE_")[1])
        }
        columns[5].innerText = arr.join(" ")
    }

    function deleteForm(id, firstName, lastName, age, email, password) {
        document.getElementById("deletedId").setAttribute("value", id)
        document.getElementById("deletedFirstName").setAttribute("value", firstName)
        document.getElementById("deletedLastName").setAttribute("value", lastName)
        document.getElementById("deletedAge").setAttribute("value", age)
        document.getElementById("deletedEmail").setAttribute("value", email)
        document.getElementById("deletedPassword").setAttribute("value", password)
    }

    function deleteUser(id) {
        fetch('/admin/delete/' + id, {
            method: 'DELETE',
        })
            .then(res => res.text())
            .then(text => console.log(text))
        document.getElementById("row" + id).remove()
    }
})