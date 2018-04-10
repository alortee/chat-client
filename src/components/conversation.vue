<template lang="html">
  <v-app dark>
  <v-navigation-drawer
    app
    v-model="drawer"
    fixed
    mobile-break-point="800"
  >
    <v-toolbar flat color="">
      <v-toolbar-title>Members</v-toolbar-title>
    </v-toolbar>
    <v-list dense>
      <template v-for="(member, index) in members">
        <v-list-tile :key="index">
          <v-list-tile-action>
            <v-icon color="light-green accent-3">person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ member }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar app flat fixed>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>{{ eventname }}</v-toolbar-title>
  </v-toolbar>
  <v-content>
    <v-container fluid>
      <v-layout v-for="(message, index) in messages" :key="index" :id="'msg' + index.toString()" row class="py-3" xs10 sm8 md3>
        <v-spacer v-if="message.sender === username || message.sender === 'server'"></v-spacer>
        <v-flex>
          <v-card v-if="message.sender === username" color="teal darken-2" class="white--text">
            <v-card-title primary-title class="pa-1">
              <div class="light-green--text">you</div>
            </v-card-title>
            <v-divider/>
            <v-card-text class="pa-1">
              <div>{{ message.text }}</div>
            </v-card-text>
          </v-card>
          <v-card v-if="message.sender === 'server'" color="primary" class="white--text">
            <v-card-text class="pa-1">
              <div>{{ message.text }}</div>
            </v-card-text>
          </v-card>
          <v-card v-if="message.sender !== username && message.sender !== 'server'" color="blue-grey darken-2" class="white--text">
            <v-card-title primary-title class="pa-1">
              <div class="yellow--text">{{ message.sender }}</div>
            </v-card-title>
            <v-divider/>
            <v-card-text class="pa-1">
              <div>{{ message.text }}</div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-spacer v-if="message.sender !== username"></v-spacer>
      </v-layout>
    </v-container>
  </v-content>
  <v-footer app height="80px">
    <v-layout class="pa-2" row>
      <v-flex xs10 sm12>
        <v-form @submit.prevent="sendMessage">
          <v-text-field solo label="type your message..." v-model.trim="newMessage" ref="sendbox"></v-text-field>
        </v-form>
      </v-flex>
      <v-spacer/>
      <v-btn flat icon @click="sendMessage"><v-icon>send</v-icon></v-btn>
    </v-layout>
  </v-footer>
</v-app>
</template>

<script>
import io from 'socket.io-client'

export default {
  props: ['eventslug'],
  data () {
    return {
      drawer: false,
      eventname: '',
      newMessage: '',
      members: [],
      messages: [],
      socket: {}
    }
  },
  methods: {
    appendMessage (message) {
      this.messages.push(message)
      this.$nextTick(() => {
        var noom = this.messages.length
        var target = '#msg' + (noom - 1)
        if (noom > 5) this.$vuetify.goTo(target, {duration: 300, offset: 0})
      })
    },
    sendMessage () {
      if (this.newMessage !== '') {
        this.socket.emit('newMessage', {sender: this.username, text: this.newMessage})
        this.newMessage = ''
      }
    }
  },
  computed: {
    username () {
      return this.$store.state.username
    }
  },
  mounted () {
    this.socket = io.connect('http://localhost:3000')
    var {username, eventslug} = this
    this.socket.on('connect', () => {
      console.log('connected to socket')
      this.socket.emit('join', {username, eventslug})
    })

    this.socket.on('previousMessages', (previousMessages) => {
      this.messages = []
      previousMessages.forEach(item => this.appendMessage(item))
    })

    this.socket.on('onlineMembers', (onlineMembers) => {
      this.members = onlineMembers
    })

    this.socket.on('disconnect', () => {
      console.log('disconnected from socket')
    })

    this.socket.on('message', (message) => {
      this.appendMessage(message)
    })
  }
}
</script>

<style lang="css">
</style>
