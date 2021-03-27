const list = document.querySelector('#list');
const newPersonForm = document.querySelector('.new');


newPersonForm.addEventListener('submit', addPerson);
list.addEventListener('click', enableEditForm);
list.addEventListener('click', cancelEdit);
list.addEventListener('click', removeSingle);
list.addEventListener('submit', submitEdit);

function addPerson(e){
    e.preventDefault();

    const form = new FormData();
    const data = {
        name: newPersonForm.querySelector('#name').value,
        nickname: newPersonForm.querySelector('#nickname').value,
        rank: newPersonForm.querySelector('#rank').value,
        group: newPersonForm.querySelector('#group').value,
        country: newPersonForm.querySelector('#country').value,
        'file-to-upload': newPersonForm.querySelector('#logo').files[0]
    }

    addPersonDOM();

    for(property in data)
        form.set(property, data[property]);


    fetch('add', {
        method:'post',
        body:form
    })



}

function addPersonDOM() {
    //Create li to insert new Capoeirista
    const newPerson = document.createElement('li');
    const editForm = document.createElement('form');
    const editActiveDiv = document.createElement('div');
    const opacityDiv = document.createElement('div');
    const newInfo = document.createElement('section');
    let children = ['rank', 'nickname', 'name', 'group', 'country', 'logo', 'DELETE', 'Edit'];

    newInfo.classList.add('info');
    newPerson.classList.add('person');
    editForm.classList.add('editForm','hide');
    list.appendChild(newPerson);
    newPerson.appendChild(editActiveDiv);
    newPerson.appendChild(editForm);
    editActiveDiv.appendChild(opacityDiv);
    opacityDiv.appendChild(newInfo);

    //Create variable for each element
    //Give each element its appropriate class
    children.forEach((child, i) => {
        let el;
        switch(i) {
            case 0: case 1: el = document.createElement('h2'); break;
            case 2: case 3: el = document.createElement('h3'); break;
            case 4: el = document.createElement('h4'); break;
            case 5: { 
                el = document.createElement('img');
                el.src = URL.createObjectURL(newPersonForm.querySelector(`#${child}`).files[0]);
        } break;
            case 6:
            case 7: {
                el = document.createElement('button');
                el.innerText = child;
        } break;
        }
        el.classList.add(child.toLowerCase());
        if (i < 5) {
            el.innerText = newPersonForm.querySelector(`#${child}`).value;
            newInfo.appendChild(el)
        }
        else
            opacityDiv.appendChild(el);
    })

    //Create form to edit
    children = ['Name','Nickname','Rank','Group','Country','Logo','Submit', 'Cancel']
    children.forEach((child, i) => {
        let label, input, placeHolder = 'Enter ', innerText = child;
        const div = document.createElement('div');
        switch(i) {
            case 1: placeHolder += 'Capoeira name'; innerText = 'Capoeira Name:'; break;
            case 2: placeHolder += 'rank (Graduado/Monitor/Formado)'; break;
            case 3: placeHolder += 'group name'; innerText = 'Group Name'; break;
            case 5: innerText = 'Group Logo'; break;
            case 6:
                let submit = document.createElement('input');
                submit.setAttribute('type', 'submit');
                submit.classList.add('submit','submitEdit');
                submit.value = child;
                editForm.appendChild(submit);
            break;
            case 7:
                let cancel = document.createElement('button');
                cancel.setAttribute('type', 'button')
                cancel.classList.add(`${child.toLowerCase()}Edit`);
                cancel.innerText = child;
                editForm.appendChild(cancel);
        }
        if (i <= 5) {
            label = document.createElement('label');
            input = document.createElement('input');
            label.htmlFor = child.toLowerCase();
            label.innerText = innerText;
            input.classList.add(child.toLowerCase());
            if (i < 5){
                input.setAttribute('name', `new${child}`);
                input.setAttribute('type', 'text');
                input.placeholder = placeHolder + (i === 0 || i === 4) ? child.toLowerCase() : '';
            }
            else if (i === 5) {
                input.setAttribute('name', 'file-to-upload');        
                input.setAttribute('type', 'file');
            }
            div.appendChild(label);
            div.appendChild(input);
            editForm.appendChild(div);
        }

    })
}


function cancelEdit(e) {
    if (e.target.className === 'cancelEdit') {
        const person = e.target.closest('.person');
        person.querySelector('.editForm').classList.add('hide');
        person.querySelector('.person > div > div').classList.remove('opacity');
        person.querySelector('.person > div').classList.remove('editActive');
        }
}

function enableEditForm(e) {
    if (e.target.className === 'edit') {
        const person = e.target.closest('.person');
        console.log(person);
        person.querySelector('.editForm').classList.remove('hide');
        person.querySelector('.person > div > div').classList.add('opacity');
        person.querySelector('.person > div').classList.add('editActive');
        }
}

function submitEdit(e) {
        e.preventDefault();
        const personEl = e.target.closest('.person');
        const newName = personEl.querySelector('form .name').value;
        const newNickname = personEl.querySelector('form .nickname').value;
        const newRank = personEl.querySelector('form .rank').value;
        const newGroup = personEl.querySelector('form .group').value;
        const newCountry = personEl.querySelector('form .country').value;
        const newLogo = personEl.querySelector('form .logo').files[0];

        const form = new FormData();
        const data = {
            name: personEl.querySelector('.info .name').innerText,
            nickname: personEl.querySelector('.info .nickname').innerText,
            rank: personEl.querySelector('.info .rank').innerText,
            group: personEl.querySelector('.info .group').innerText,
            country: personEl.querySelector('.info .country').innerText,
            logo: imagePath(personEl.querySelector('.logo').src),
            newName: newName,
            newNickname: newNickname,
            newGroup: newGroup,
            newRank: newRank,
            newCountry: newCountry,
            'filetoupload' : newLogo
        }
        for(property in data)
            form.set(property, data[property])

        fetch('edit', {
            method:'put',
            body:form
        })
        .then(function(response) {
            window.location.reload()
        })
}


function imagePath(path) {
    for(i = 0; i < path.length; i++) {
        if (i < path.length-3) {
            if (path[i] + path[i+1] + path[i+2] === 'img'){
                return (path.slice(path.indexOf(path[i]), path.length))};
        }
    }
}
function taskComplete(e) {
    if (e.target.tagName === 'SPAN') {
        fetch('markCompleted', {
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                task: e.target.innerText,
                completed: e.target.classList.contains('done')
            })
        })
        .then(function (response) {
            window.location.reload()
          })
    }
}

function removeSingle(e) {
    if (e.target.className === 'delete'){
        const info = e.target.closest('.person');
        fetch('delete', {
        method: 'delete',
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify({
            name: info.querySelector('.info .name').innerText,
            nickname: info.querySelector('.info .nickname').innerText,
            rank: info.querySelector('.info .rank').innerText,
            group: info.querySelector('.info .group').innerText,
            country: info.querySelector('.info .country').innerText,
            logo: imagePath(info.querySelector('.logo').src)
        })
        })
        .then(function(response) {
            window.location.reload();
        })
}
}

function removeCompleted() {
    fetch('completedTasks', {
        method: 'delete',
        headers: {'Content-Type' : 'application/json'}
    })
    .then(function(response) {
        window.location.reload();
    })
}

function removeAll() {
    fetch('clear', {
        method: 'delete',
        headers: {'Content-Type' : 'application/json'}
    })
    .then(function(response) {
        window.location.reload();
    })
}