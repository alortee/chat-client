<template lang="html">
  <v-app dark>
  <v-toolbar app>
    <v-toolbar-title class="white--text">Welcome {{ user }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click="logout">logout</v-btn>
  </v-toolbar>
  <v-content>
    <v-container>
      <v-layout justify-center mt-4>
        <v-flex xs12 sm10 md8>
          <v-card >
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Create an event</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-container grid-list-md>
                <v-alert type="error" :value="error">
                  {{ error }}
                </v-alert>
                <v-form v-model="valid" @submit.prevent="createEvent">
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field
                        v-model="eventName"
                        label="Event Name"
                        autocomplete="false"
                        :rules="eventnameRules"
                        :counter="15"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions mb-4>
              <v-btn
                @click="createEvent"
                color="primary"
                dark
                large
                block
                :disabled="!valid || loading"
                :loading="loading"
              >
                create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container>
      <v-layout justify-center mt-4>
        <v-flex xs12 sm10 md8>
          <v-card >
            <v-toolbar color="primary" dark>
              <v-toolbar-title>My Events</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-alert type="info" :value="!hasEvents">
                You have no events. Create one now
              </v-alert>
              <v-list>
                <template v-for="(item, index) in events">
                  <v-list-tile ripple :key="item.name">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                      <v-list-tile-sub-title>link to event conversation - <router-link :to="item.link">{{item.link}}</router-link></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < events.length" :key="index"></v-divider>
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      loading: false,
      error: false,
      eventName: '',
      eventnameRules: [
        v => !!v || 'event name is required',
        v => (v && v.length <= 15) || 'must be less than 15 characters'
      ]
    }
  },
  methods: {
    createEvent () {
      var payload = {
        name: this.eventName
      }
      this.loading = true
      this.$store.dispatch('createEvent', payload).then(() => {
        this.$store.dispatch('getUserEvents')
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    getUserEvents () {
      this.$store.dispatch('getUserEvents').then(() => {
        this.eventName = ''
      }).catch((err) => {
        console.log(err)
      })
    },
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/')
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  computed: {
    user () {
      return this.$store.state.username
    },
    events () {
      return this.$store.state.events.map(item => {
        return {
          name: item.name,
          slug: item.slug,
          link: '/events/' + item.slug + '/conversation'
        }
      })
    },
    hasEvents () {
      if (this.events.length > 0) return true
      return false
    }
  },
  mounted () {
    this.getUserEvents()
  }
}
</script>

<style lang="css">
</style>
