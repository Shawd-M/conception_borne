<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="elevation-12">
          <v-row justify="center">
            <v-col cols="12" md="8">
              <v-card-text class="mt-12">
                <h1
                  class="text-center display-2 default--text text--accent-3"
                >
                  Connexion
                </h1>
                <v-form>
                  <v-text-field
                    v-model="finArrayObject(form, 'login').value"
                    label="Login"
                    type="text"
                    color="default"
                  />

                  <v-text-field
                    v-model="finArrayObject(form, 'password').value"
                    label="Mot de passe"
                    type="password"
                    color="default"
                  />
                </v-form>
              </v-card-text>
              <div class="pb-2 text-center mt-3">
                <v-btn rounded color="default" dark @click="login()">
                  Connexion
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MyAuth',
  components: {},
  data: () => ({
    form: [
      {
        field: 'login',
        value: null
      },
      {
        field: 'password',
        value: null
      }
    ],
    registerForm: {
      login: null,
      firstName: null,
      lastName: null,
      email: null,
      address: null,
      password: null,
      passwordConfirm: null
    }
  }),
  mounted () {
    if (this.$auth.user) {
      this.$router.push('/')
    }
  },
  methods: {
    ...mapMutations(['update']),

    async login () {
      if (!this.form[0].value && !this.form[1].value) {
        return
      }

      const data = {
        login: this.form[0].value,
        password: this.form[1].value
      }
      await this.$auth.loginWith('local', { data })
    },

    async register () {
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(this.registerForm)) {
        if (!value) {
          return
        }
      }

      if (this.registerForm.password !== this.registerForm.passwordConfirm) { return }

      const response = await this.$axios({
        method: 'post',
        url: '/api/auth/register',
        data: this.registerForm
      })

      if (response.data) {
        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of Object.entries(this.registerForm)) {
          this.registerForm[key] = null
        }
        this.index = 0
      }
    },

    finArrayObject (array, field) {
      if (!array || !field) { return null }

      return array.find(element => element.field === field)
    }
  }
}
</script>
