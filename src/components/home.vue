<template lang="html">
  <v-app dark>
  <v-content>
    <v-container fluid>
      <v-layout row justify-center mb-4>
        <v-card width="600px">
          <v-card-title>
            <v-layout justify-center>
              <span v-if="form === 'login'" class="headline">LOGIN</span>
              <span v-if="form === 'register'" class="headline">REGISTER</span>
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
                  <v-flex xs12>
                    <v-text-field
                      v-model="password"
                      label="Password"
                      type="password"
                      autocomplete="false"
                      :rules="passwordRules"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex v-if="form === 'register'" xs12>
                    <v-text-field
                      v-model="confirm_password"
                      label="Confirm Password"
                      type="password"
                      autocomplete="false"
                      :rules="confpasswordRules"
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
              @click="loginOrRegister"
              color="blue"
              dark
              large
              block
              :disabled="!valid || loading"
              :loading="loading"
            >
              {{ form }}
            </v-btn>
          </v-flex>
          </v-card-actions>
          <v-card-actions>
            <v-layout justify-center>
              <p v-if="form === 'login'"><a @click="showRegisterForm">REGISTER INSTEAD</a></p>
              <p v-if="form === 'register'"><a @click="showLoginForm">LOGIN INSTEAD</a></p>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
export default {
  data () {
    return {
      error: false,
      valid: false,
      loading: false,
      form: 'login',
      username: '',
      usernameRules: [
        v => !!v || 'username is required',
        v => (!/\s/.test(v)) || 'username should not contain spaces',
        v => (v && v.length <= 10) || 'username must be less than 10 characters',
        v => (v && v.length >= 3) || 'username must be more than 2 characters'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'password is required',
        v => (v && v.length >= 4) || 'user must be more than 3 characters'
      ],
      confirm_password: '',
      confpasswordRules: [
        v => !!v || 'confirm your password',
        v => (v && v === this.password) || 'passwords do not match'
      ]
    }
  },
  methods: {
    showRegisterForm () {
      this.form = 'register'
    },
    showLoginForm () {
      this.form = 'login'
    },
    loginOrRegister () {
      this.loading = true
      this.$store.dispatch('loginOrRegister', {
        action: this.form,
        username: this.username,
        password: this.password,
        confirm: this.confirm_password
      }).then(() => {
        this.$router.push('/u')
      }).catch((err) => {
        this.error = err
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="css">
</style>
