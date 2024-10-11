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
    ]
  }),
  mounted () {
    if (this.$auth.user) {
      this.$router.push('/Home')
    }
  },
  methods: {
    ...mapMutations(['update']),

    async login () {
      if (!this.finArrayObject(this.form, 'login').value && !this.finArrayObject(this.form, 'password').value) {
        return
      }

      const data = {
        login: this.finArrayObject(this.form, 'login').value,
        password: this.finArrayObject(this.form, 'password').value
      }
      const auth = await this.$auth.loginWith('local', { data })
      if (auth) {
        const response = await this.$axios({
          method: 'get',
          url: `/api/restaurant-detail/read/by/${this.$auth.user.restaurant_id}`
        })
        if (response) {
          this.update({
            key: 'homeDetails',
            value: response.data.values
          })
        }
      }

      this.$router.push('/Home')
    },
    finArrayObject (array, field) {
      if (!array || !field) { return null }

      return array.find(element => element.field === field)
    }
  }
}
</script>
