<template>
  <v-col class="mt-4">
    <v-btn
      depressed
      :color="$store.state.colorAdmin ? $store.state.colorAdmin : 'default'"
      class="my-2"
      :style="{ color: $store.state.colorText ? $store.state.colorText : 'white' }"
      @click="dialog = true"
    >
      Ajouter une borne
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
            :items="restaurantList"
            item-text="name"
            item-value="id"
            v-model="item.restaurant_id"
            @change="updateBorne(item)"
            dense
            class="mt-0">
          </v-select>
        </v-col>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Ajouter une borne</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  label="Nom de la borne"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.code"
                  label="Code de la borne (Mot de passe)"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
          <small>*Champ obligatoire</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="resetForm()"
          >
            Annuler
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="createBorne()"
          >
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  name: 'BorneListe',
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Id',
        align: 'start',
        sortable: true,
        value: 'id',
      },
      {
        text: 'Nom',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      {
        text: 'Code',
        align: 'start',
        sortable: true,
        value: 'code',
      },
      {
        text: "Numéro de série",
        align: 'start',
        sortable: true,
        value: 'serieNum',
      },
      {
        text: "Restaurant",
        align: 'start',
        sortable: false,
        value: 'restaurant_id',
      },
      {
        text: "Next Maintenance",
        align: 'start',
        sortable: true,
        value: 'nextMaintenance',
      },
      {
        text: "Previous Maintenance",
        align: 'start',
        sortable: true,
        value: 'previousMaintenance',
      },
      {
        text: "Status",
        align: 'start',
        sortable: true,
        value: 'status',
      },
    ],
    form: {
      code: '',
      name: '',
    },
    items: [],
    restaurantList: [],
  }),

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      const getBornesPromise = this.getBornes()
      const getRestaurantPromise = this.getRestaurants()
      await Promise.all([
        getBornesPromise,
        getRestaurantPromise,
      ])
    },

    async getBornes() {
      const response = await this.$axios({
        method: 'get',
        url: `/api/borne/read/all`,
      })

      if (response.data) {
        this.items = response.data.values
      }
    },

    async getRestaurants() {
      const response = await this.$axios({
        method: 'get',
        url: `/api/restaurant/read/all`,
      })

      if (response.data) {
        this.restaurantList = response.data.values
      }
    },

    async createBorne() {
      const { ...data } = this.form
      const response = await this.$axios({
        method: 'post',
        url: `/api/borne/create`,
        data: {
          ...data,
          image_id: 3,
          status: 1,
          serieNum: Math.floor(100000 + Math.random() * 900000)
        },
      })

      if (response.data) {
        this.getData()
        this.resetForm()
      }
    },

    async updateBorne(item) {
      const { ...data } = item

      const response = await this.$axios({
        method: 'put',
        url: `/api/borne/update`,
        data: {
          ...data,
        },
      })

      if (response.data) {
        this.getData()
      }
    },

    resetForm() {
      this.dialog = false
      this.form = {
        code: '',
        name: '',
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
