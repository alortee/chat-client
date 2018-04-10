import jwt from 'jsonwebtoken'

export var authSuccess = (state, payload) => {
  state.token = payload
  var {username, role} = jwt.decode(payload)
  state.username = username
  state.role = role
}

export var authLogout = (state) => {
  state.token = ''
  state.username = ''
  state.role = ''
}

export var updateEvents = (state, payload) => {
  state.events = payload
}
