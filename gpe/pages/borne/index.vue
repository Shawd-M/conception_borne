<template>
  <div>
    <v-row class="ma-0 pa-0">
      <v-col class="d-flex justify-end">
        <v-btn
          :color="$store.state.colorAdmin ? $store.state.colorAdmin : 'default'"
          class="ma-2"
          :style="{ color: $store.state.colorText ? $store.state.colorText : 'white' }"
          align="end"
          @click="openPersonalize"
        >
          Personaliser vos borne
          <v-icon
            right
            dark
          >
            mdi-plus-circle-outline
          </v-icon>
        </v-btn>
        <v-btn
          :color="$store.state.colorAdmin ? $store.state.colorAdmin : 'default'"
          class="ma-2"
          :style="{ color: $store.state.colorText ? $store.state.colorText : 'white' }"
          align="end"
          @click="dialogAdd = true"
        >
          Ajouter une borne
          <v-icon
            right
            dark
          >
            mdi-plus-circle-outline
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="mx-auto">
      <v-container fluid>
        <v-row dense :key="imgIndex">
          <v-col
            v-for="(card, cardIndex) in item"
            :key="cardIndex"
            cols="2"
            sm="4"
            md="3"
          >
            <v-card
              class="d-flex flex-column"
              width="320"
              height="550"
            >
              <v-list-item-subtitle
                class="pa-3"
                align="end"
              >
                <v-chip
                  :color="card.status === 1 ? $store.state.colorAdmin ? $store.state.colorAdmin : 'default' : 'error'"
                  :style="{ color: $store.state.colorText ? $store.state.colorText : 'white' }"
                >
                  {{ card.status === 1 ? 'Actif' : 'Désactiver' }}
                  <v-icon
                    right
                    dark
                  >
                    {{ card.status === 1 ? 'mdi-checkbox-marked-circle' : 'mdi-close-circle' }}
                  </v-icon>
                </v-chip>
              </v-list-item-subtitle>
              <v-card-title class="pt-0 pb-0">
                {{ card.name }}
              </v-card-title>
              <v-list-item-subtitle class="pa-4 pt-0 pb-0">
                Numéro de série : {{ card.serieNum }}
              </v-list-item-subtitle>
              <v-col
                justify="center"
                align="center"
              >
                <v-img
                  max-height="300"
                  max-width="350"
                  contain
                  :src="cardImage[card.id]"
                />
              </v-col>
              <v-card-subtitle class="pt-0">
                Révisé le : {{ card.previousMaintenance }}
              </v-card-subtitle>
              <v-card-subtitle class="pt-0">
                Prochaine révision : {{ card.nextMaintenance }}
              </v-card-subtitle>
              <v-spacer />
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-chart-bar</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col class="pointer">
            <v-hover v-slot="{ hover }">
              <v-card
                class="d-flex flex-column"
                width="320"
                height="550"
                :color="hover ? 'grey' : 'grey lighten-2'"
                @click="dialogAdd = true"
              >
                <v-row
                  align="center"
                  justify="center"
                >
                  <v-icon
                    :color="hover ? 'grey lighten-2' : 'grey'"
                    size="150"
                  >
                    mdi-plus-circle-outline
                  </v-icon>
                </v-row>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-dialog
      v-model="dialogAdd"
      persistent
      max-width="60%"
    >
      <v-form ref="formPlat">
        <v-card>
          <v-card-title class="text-h5">
            <v-row class="pa-2">
              <v-icon
                class="mr-3"
                color="default"
              >
                mdi-plus-circle-outline
              </v-icon>
              Ajouter une borne
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.login"
                    label="Nom de la borne"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.password"
                    label="Code de la borne (Mot de passe)"
                    required
                  />
                </v-col>
              </v-row>
            </v-container>
            <small>*Champ obligatoire</small>
          </v-card-text>
          <v-card-actions>
            <p>* Champ obligatoire</p>
            <v-spacer />
            <v-btn
              color="default"
              text
              @click="close()"
            >
              Annuler
            </v-btn>
            <v-btn
              color="default"
              text
              @click="addBorne()"
            >
              Ajouter
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <personalize-borne
      ref="personalize"
      :detail="detail ? detail : {}"
      @update-detail="updateDetail"
    />
  </div>
</template>

<script>
import PersonalizeBorne from '~/components/PersonalizeBorne.vue'

export default {
  name: 'Bornes',
  data: () => ({
    components: {
      PersonalizeBorne,
    },
    imgIndex: 0,
    cardImage: {},
    restaurantId: null,
    restaurantDetailId: null,
    dialogAdd: false,
    restaurant_folder: null,
    form: {
      login: null,
      password: null,
    },
    item: [],
    detail: null,
  }),

  watch: {

  },

  mounted() {
    this.restaurantId = this.$auth.user.restaurant_id
    this.restaurantDetailId = this.$auth.user.restaurant.detail_id
    this.restaurant_folder = this.$auth.user.restaurant.folder
    this.getData()
  },

  methods: {
    async getData() {
      const getBorneDataPromise = this.getBorneData()
      const getRestaurantDetailPromise = this.getRestaurantDetail()

      await Promise.all([getBorneDataPromise, getRestaurantDetailPromise])
    },

    async getBorneData() {
      this.item = []
      const response = await this.$axios({
        method: 'get',
        url: `/api/borne/read/all/bornes/${this.restaurantId}`,
      })

      if (response.data) {
        this.item = await response.data.values
        this.item.forEach(async (card) => {
          this.cardImage[card.id] = await this.fetchImageData(card)
          this.imgIndex++
        })
      }
    },

    async getRestaurantDetail() {
      this.detail = null
      const response = await this.$axios({
        method: 'get',
        url: `/api/restaurant-detail/read/by/${this.restaurantDetailId}`,
      })

      if (response.data) {
        this.detail = response.data.values
      }
    },

    async addBorne() {
      const response = await this.$axios({
        method: 'post',
        url: `/api/borne/link/borne`,
         data: 
         {
          ...this.form,
          restaurantId: this.restaurantId,
         },
      })

      if (response.data) {
        this.getData
      }
    },

    async updateDetail(item) {
      const formData = new FormData()
      item.color = item.color ? item.color.hexa ? item.color.hexa : item.color : null
      formData.append('restaurantFile', this.restaurant_folder)

      for (const property in item) {
        if (item[property])
          formData.append(property, item[property])
      }

      const response = await this.$axios({
        method: 'put',
        url: `/api/restaurant-detail/update/${this.restaurantDetailId}`,
        data: formData,
      })

      if (response) {
        this.closePersonalize()
      }
    },

    close() {
      this.dialogAdd = false
    },

    openPersonalize() {
      this.$refs.personalize.open()
    },

    closePersonalize() {
      this.$refs.personalize.close()
    },

    async fetchImageData(card) {
      try {
        const response = await this.$axios({
          method: 'get',
          url: `/api/image?url=${encodeURIComponent(card.image.url)}`,
          responseType: 'arraybuffer',
        });
        // Convert the binary data to base64 to use in the image src
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');

        // Return the base64 URL of the image
        return `data:${response.headers['content-type']};base64,${base64Image}`;
      } catch (error) {
        console.error('Error fetching image:', error);
        return null;
      }
    },
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

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
