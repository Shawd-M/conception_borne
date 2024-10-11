<template>
  <v-col class="mt-4">
    <v-btn
      depressed
      :color="$store.state.colorAdmin ? $store.state.colorAdmin : 'default'"
      class="my-2"
      :style="{ color: $store.state.colorText ? $store.state.colorText : 'white' }"
      @click="dialog = true"
    >
      Ajouter un restaurant
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      class="elevation-1"
    />

    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Ajouter un restaurant</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  label="Nom du restaurant *"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.address"
                  label="Adresse du restaurant *"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.employee"
                  label="Nombre d'employés *"
                  type="number"
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
            @click="createRestaurant()"
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
  name: 'RestaurantListe',
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Nom',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      {
        text: 'Adresse',
        align: 'start',
        sortable: true,
        value: 'address',
      },
      {
        text: "Nombre d'employé(s)",
        align: 'start',
        sortable: true,
        value: 'employee',
      },
    ],
    form: {
      name: '',
      address: '',
      employee: 0,
    },
    items: [],
  }),

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      const response = await this.$axios({
        method: 'get',
        url: `/api/restaurant/read/all`,
      })

      if (response.data) {
        this.items = response.data.values
      }
    },

    async createRestaurant() {
      const response = await this.$axios({
        method: 'post',
        url: `/api/restaurant/create`,
        data: this.form,
      })

      if (response.data) {
        this.getData()
        this.resetForm()
      }
    },

    resetForm() {
      this.dialog = false
      this.form = {
        name: '',
        address: '',
        employee: 0,
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
