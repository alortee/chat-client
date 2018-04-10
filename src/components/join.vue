<template lang="html">
  <v-app dark>
  <v-content>
    <v-container fluid>
      <v-layout row justify-center mb-4>
        <h1 v-if="!loading && notFound">NOT FOUND</h1>
        <v-card v-if="!notFound" width="600px">
          <v-card-title>
            <v-layout justify-center>
              <span class="headline">JOIN EVENT - {{ eventDetails.eventname }}</span>
              <span class="headline"></span>
            </v-layout>
          </v-card-title>
          <v-divider/>
          <v-card-text>
            <v-container grid-list-md>
              <v-alert type="error" :value="error">
                {{ error }}
              </v-alert>
              <v-form v-model="valid">
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      v-model="username"
                      label="Username"
                      autocomplete="false"
                      :rules="usernameRules"
                      :counter="10"
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-flex xs12 mx-3>
            <v-btn
              @click="joinEvent"
              color="blue"
              dark
              large
              block
              :disabled="!valid || loading"
              :loading="loading"
            >
              JOIN
            </v-btn>
          </v-flex>
          </v-card-actions>
          <v-card-text/>
        </v-card>
      </v-layout>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
export default {
  props: ['eventslug'],
  data () {
    return {
      error: false,
      valid: false,
      loading: true,
      eventDetails: {},
      notFound: true,
      username: '',
      usernameRules: [
        v => !!v || 'username is required',
        v => (!/\s/.test(v)) || 'username should not contain spaces',
        v => (v && v.length <= 10) || 'username must be less than 10 characters',
        v => (v && v.length >= 3) || 'username must be more than 2 characters'
      ]
    }
  },
  methods: {
    getEventDetails () {
      this.$store.dispatch('getEventDetails', this.eventslug).then((eventDetails) => {
        this.notFound = false
        this.loading = false
        this.eventDetails.eventname = eventDetails.eventname
        this.eventDetails.themeColor = eventDetails.themeColor
      }).catch((err) => {
        this.notFound = true
        this.loading = false
        console.log(err)
      })
    },
    joinEvent () {
      this.loading = true
      this.$store.dispatch('joinEvent', {eventSlug: this.eventslug, username: this.username}).then(() => {
        this.$router.push('/events/' + this.eventslug + '/conversation')
      }).catch((err) => {
        console.log(err)
        this.error = err
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.getEventDetails()
  }
}
</script>

<style lang="css">
</style>
