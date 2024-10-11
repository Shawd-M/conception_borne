<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <v-col class="mt-4">
      <v-btn
        depressed
        :color="$store.state.colorAdmin ? $store.state.colorAdmin : 'default'"
        class="my-2"
        :style="{ color: $store.state.colorText ? $store.state.colorText : 'white' }"
        @click="dialog = true"
      >
        Créer un utilsateur 
      </v-btn>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        class="elevation-1"
      >
        <template #item.restaurant_id="{ item }">
          <v-col>
            <v-select
              :items="restaurantItems"
              item-text="name"
              item-value="id"
              v-model="item.restaurant_id"
              @change="updateUser(item)"
              dense
              class="mt-0">
            </v-select>
          </v-col>
        </template>
      </v-data-table>
    </v-col>
    <v-dialog v-model="dialog" max-width="60%">
      <v-card>
        <v-card-title class="text-h5">
          <v-row class="pa-2">
            <v-icon class="mr-3" :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }">
              mdi-account
            </v-icon>
            Créer un utilisateur
          </v-row>
        </v-card-title>
        <v-row justify="center" align="center">
          <v-col
            v-for="item in forms"
            :key="`forms${item.field}`"
            :cols="item.cols"
          >
            <component
              :is="item.name"
              v-model="item.value"
              v-bind="item.props"
            >
            </component>
          </v-col>
        </v-row>
          <v-card-actions>
            <p>* Champ obligatoire</p>
            <v-spacer />
            <v-btn :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }" text @click="close()"> Annuler </v-btn>
            <v-btn :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }" text @click="validate()">Ajouter</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'UsersListe',
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Nom',
        align: 'start',
        sortable: true,
        value: 'lastName',
      },
      {
        text: 'Prénom',
        align: 'start',
        sortable: true,
        value: 'firstName',
      },
      {
        text: 'Login',
        align: 'start',
        sortable: true,
        value: 'login',
      },
      {
        text: 'Email',
        align: 'start',
        sortable: true,
        value: 'email',
      },
      {
        text: 'Adresse',
        align: 'start',
        sortable: true,
        value: 'address',
      },
      {
        text: 'Restaurant',
        align: 'start',
        sortable: true,
        value: 'restaurant_id',
      },
    ],
    forms: [
      {
        name: 'v-text-field',
        props: {
          label: 'Prénom *',
        },
        field: 'firstName',
        value: null,
        required: true,
        cols: 5,
      },
      {
        name: 'v-text-field',
        props: {
          label: 'Nom *',
        },
        field: 'lastName',
        value: null,
        required: true,
        cols: 5,
      },
      {
        name: 'v-text-field',
        props: {
          label: 'Email',
        },
        field: 'email',
        value: null,
        cols: 5,
      },
      {
        name: 'v-text-field',
        props: {
          label: 'Login *',
        },
        field: 'login',
        value: null,
        required: true,
        cols: 5,
      },
      {
        name: 'v-text-field',
        props: {
          label: 'Mot de passe *',
          type: 'password',
        },
        field: 'password',
        value: null,
        required: true,
        cols: 5,
      },
      {
        name: 'v-text-field',
        props: {
          label: 'Confirmé le de passe *',
          type: 'password',
        },
        field: 'confirmPassword',
        value: null,
        required: true,
        cols: 5,
      },
      {
        name: 'v-text-field',
        props: {
          label: 'Adresse',
        },
        field: 'address',
        value: null,
        cols: 5,
      },
      {
        name: 'v-select',
        props: {
          label: 'Restaurant',
          items: [],
          'item-text': 'name',
          'item-value': 'id',
        },
        field: 'restaurant_id',
        value: null,
        required: true,
        cols: 5,
      },
    ],
    items: [],
    restaurantItems: [],
  }),

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      const getUserPromise = this.getUserData()
      const getRestaurantPromise = this.getRestaurantData()

      await Promise.all([getUserPromise, getRestaurantPromise])
    },

    async getUserData() {
      const response = await this.$axios({
        method: 'get',
        url: `/api/users/read/all`,
      })

      if (response.data) {
        this.items = response.data.values
      }
    },
    async getRestaurantData() {
      const response = await this.$axios({
        method: 'get',
        url: `/api/restaurant/read/all`,
      })

      if (response.data) {
        this.finArrayObject(this.forms, 'restaurant_id').props.items = response.data.values
        this.restaurantItems = response.data.values
      }
    },

    async updateUser(item) {
      const { ...data } = item
      const response = await this.$axios({
        method: 'put',
        url: `/api/users/update`,
        data
      })

      if (response.data) {
        this.getData()
      }
    },

    async validate() {
      const data = this.getFormValues(this.forms)
      if (!data) {
        return
      }

      if (data.password !== data.confirmPassword) { return }

      const response = await this.$axios({
        method: 'post',
        url: '/api/auth/register',
        data
      })

      if (response.data) {
        this.getData()
        this.close()
      }
    },

    close() {
      this.dialog = false
      this.clearFormValues(this.forms)
    },

    finArrayObject(array, field) {
      if (!array || !field) return null

      return array.find((element) => element.field === field)
    },

    getFormValues(form) {
      let data = {}
      for (const [key, item] of Object.entries(form)) {
        if (item.required && !item.value)
          return null
        data[item.field] = item.value
      }
      return data
    },

    clearFormValues(form) {
      for (const [key, item] of Object.entries(form)) {
        if (typeof item) {
          const type = typeof item.value
          switch (type) {
            case 'string':
              item.value = ''
              break
            case 'boolean':
              item.value = false
              break
            case 'number':
              item.value = 0
              break
            default:
              break
          }
        }
      }
    },
  }
}
</script>

<style scoped>
p {
  margin-bottom: 0;
}

.checkbox {
  margin-left: 10px;
}

.text-field {
  padding: 13px;
}

.table {
  height: 5%;
  margin: 1%;
  border: 1px solid grey;
  border-radius: 5px;
}

.title {
  color: #899ab4;
  font-size: 20px;
}

.description {
  margin: 10px;
  color: #899ab4;
  font-size: 12px;
}
</style>
