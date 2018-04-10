import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../store/store'
import home from '@/components/home'
import dash from '@/components/dash'
import join from '@/components/join'
import conversation from '@/components/conversation'

const authCheckAdmin = (to, from, next) => {
  if (store.getters.authenticated && store.state.role === 'admin') {
    next()
  } else {
    next({
      path: '/'
    })
  }
}

const authCheckMember = (to, from, next) => {
  var joinPage = '/events/' + to.params.eventslug

  if (!store.getters.authenticated) {
    next({
      path: joinPage
    })
  } else if (store.getters.authenticated) {
    console.log('checking token')
    store.dispatch('checkToken', to.params.eventslug).then(() => {
      console.log('dispatched')
      next()
    }).catch((err) => {
      console.log(err)
      next({
        path: joinPage
      })
    })
  } else {
    next()
  }
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/u',
      name: 'dashboard',
      component: dash,
      beforeEnter: authCheckAdmin
    },
    {
      path: '/events/:eventslug',
      name: 'event',
      component: join,
      props: true
    },
    {
      path: '/events/:eventslug/conversation',
      name: 'conversation',
      component: conversation,
      props: true,
      beforeEnter: authCheckMember
    }
  ]
})
