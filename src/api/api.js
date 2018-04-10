import axios from 'axios'

const API = function (options = {}) {
  this.loginURL = options.login || 'http://localhost:3000/login'
  this.registerURL = options.register || 'http://localhost:3000/register'
  this.logoutURL = options.logout || 'http://localhost:3000/logout'
  this.getUserEventsURL = options.getUserEvents || 'http://localhost:3000/u/events/get'
  this.createEventURL = options.createEvent || 'http://localhost:3000/u/events/create'
  this.getEventDetailsURL = options.getEventDetails || 'http://localhost:3000/event/'
  this.joinEventURL = options.joinEvent || 'http://localhost:3000/event/'
}

API.prototype.login = function (credentials) {
  return new Promise((resolve, reject) => {
    axios.post(this.loginURL, credentials).then((res) => {
      if (res.data.status === 'OK') {
        resolve(res.data.token)
      }
      reject(res.data.error)
    }).catch((err) => {
      localStorage.removeItem('token')
      reject(err)
    })
  })
}

API.prototype.register = function (credentials) {
  return new Promise((resolve, reject) => {
    axios.post(this.registerURL, credentials).then((res) => {
      if (res.data.status === 'OK') {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
        localStorage.setItem('token', res.data.token)
        resolve(res.data.token)
      }
      reject(res.data.error)
    }).catch((err) => {
      localStorage.removeItem('token')
      reject(err)
    })
  })
}

API.prototype.getUserEvents = function () {
  return new Promise((resolve, reject) => {
    axios.get(this.getUserEventsURL).then((res) => {
      if (res.data.status === 'OK') {
        resolve(res.data.events)
      }
      reject(res.data.error)
    }).catch((err) => {
      reject(err)
    })
  })
}

API.prototype.createEvent = function (eventData) {
  return new Promise((resolve, reject) => {
    axios.post(this.createEventURL, eventData).then((res) => {
      if (res.data.status === 'OK') {
        resolve()
      }
      reject(res.data.error)
    }).catch((err) => {
      reject(err)
    })
  })
}

API.prototype.getEventDetails = function (eventSlug) {
  return new Promise((resolve, reject) => {
    axios.get(this.getEventDetailsURL + eventSlug).then((res) => {
      if (res.data.status === 'OK') {
        resolve(res.data)
      }
      reject(res.data.error)
    }).catch((err) => {
      reject(err)
    })
  })
}

API.prototype.joinEvent = function (eventSlug, username) {
  return new Promise((resolve, reject) => {
    axios.post(this.joinEventURL + eventSlug, {username}).then((res) => {
      if (res.data.status === 'OK') {
        resolve(res.data.token)
      }
      reject(res.data.error)
    }).catch((err) => {
      reject(err)
    })
  })
}

API.prototype.logout = function () {
  return new Promise((resolve, reject) => {
    axios.get(this.logoutURL).then((res) => {
      if (res.data.status === 'OK') {
        resolve()
      }
      reject(res.data.error)
    }).catch((err) => {
      reject(err)
    })
  })
}

API.prototype.checkToken = function (eventslug) {
  return new Promise((resolve, reject) => {
    axios.post(this.joinEventURL + eventslug + '/check_token', {eventslug}).then((res) => {
      if (res.data.status === 'OK') {
        resolve()
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

export default API
