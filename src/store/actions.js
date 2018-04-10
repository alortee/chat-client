import API from '../api/api'
import axios from 'axios'

var api = new API()

export var loginOrRegister = (context, payload) => {
  return new Promise((resolve, reject) => {
    api[payload.action](payload).then(token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      localStorage.setItem('token', token)
      context.commit('authSuccess', token)
      resolve()
    }).catch(err => {
      localStorage.removeItem('token')
      reject(err)
    })
  })
}

export var getUserEvents = (context) => {
  console.log('dispatched getuserevents')
  return new Promise((resolve, reject) => {
    api.getUserEvents().then(events => {
      context.commit('updateEvents', events)
      resolve()
    }).catch(err => {
      reject(err)
    })
  })
}

export var createEvent = (context, payload) => {
  return new Promise((resolve, reject) => {
    api.createEvent(payload).then(() => {
      resolve()
    }).catch(err => {
      reject(err)
    })
  })
}

export var getEventDetails = (context, payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api.getEventDetails(payload).then(eventDetails => {
      resolve(eventDetails)
    }).catch(err => {
      reject(err)
    })
  })
}

export var joinEvent = (context, payload) => {
  return new Promise((resolve, reject) => {
    api.joinEvent(payload.eventSlug, payload.username).then(token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      localStorage.setItem('token', token)
      context.commit('authSuccess', token)
      resolve()
    }).catch(err => {
      reject(err)
    })
  })
}

export var logout = (context) => {
  return new Promise((resolve, reject) => {
    api.logout().then(() => {
      context.commit('authLogout')
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      resolve()
    }).catch(err => {
      reject(err)
    })
  })
}

export var checkToken = (context, eventslug) => {
  return new Promise((resolve, reject) => {
    api.checkToken(eventslug).then(() => {
      resolve()
    }).catch(err => {
      reject(err)
    })
  })
}
