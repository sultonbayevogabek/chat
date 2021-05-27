function select(selector) {
   return document.querySelector(selector)
}
const socket = io()

const chatForm = select('.chat-form'),
   chatInput = select('.chat-input'),
   chatMember = select('.chat-member'),
   messagesList = select('.messages-list'),
   membersList = select('.members-list')


const memberName = prompt('Your name') || 'Ismsiz'
chatMember.textContent = memberName

chatForm.addEventListener('submit', e => {
   e.preventDefault()

   socket.emit('send-front', {
      id: socket.id,
      memberName,
      message: chatInput.value
   })

   chatInput.value = ''
})

function chatListRender(array) {
   messagesList.innerHTML = ''
   array.forEach(message => {
      messagesList.innerHTML += `
          <li class="messages-list-item list-group-item d-flex align-items-center p-0">
            <div class="messages-list-item-name">${message.memberName}</div>
            <p class="messages-list-item-text">${message.message}</p>
         </li>
      `
   })
}

function memberListRender(array) {
   membersList.innerHTML = ''
   array.forEach(member => {
      membersList.innerHTML += `
         <li class="messages-list-item list-group-item">
            <a href="/${member.id}">${member.name}</a>
         </li>
      `
   })
}

socket.on('send-history', ({messages, members}) => {
   chatListRender(messages)
   memberListRender(members)
})

socket.on('send-back', ({messages, members}) => {
   chatListRender(messages)
   memberListRender(members)
})