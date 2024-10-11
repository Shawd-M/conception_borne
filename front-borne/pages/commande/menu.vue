<template>
  <div>
    <v-container fluid>
      <v-row :key="imgIndex" dense>
        <v-col
          v-for="(card, cardIndex) in items"
          :key="cardIndex"
          cols="2"
          sm="3"
          md="3"
          class="px-5 pt-3"
        >
          <v-card
            elevation="2"
            class="d-flex flex-column pointer"
            rounded="md"
            max-width="300"
            height="350"
            @click="selectMenu(card)"
          >
            <v-img :src="cardMenu[card.id]" height="60%" max-width="300" class="rounded-t-md" />
            <div class="d-flex justify-end mr-4 mt-n4">
              <v-btn elevation="0" color="green">
                <div class="text-white">
                  <v-card-title class="pa-0 text-h6" v-text="card.price + ' €'" />
                </div>
              </v-btn>
            </div>
            <v-card-text class="px-1 py-0">
              <v-card-title class="text-h6 py-0" v-text="card.name && card.name.length > 20 ? card.name.substring(0, 20) + '...' : card.name" />
              <v-card-text class="pb-4" v-text="card.description && card.description.length > 60 ? card.description.substring(0, 100) + '...' : card.description" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      v-model="dialog"
      width="1000"
      persistent
    >
      <v-card v-if="selected" min-height="500">
        <v-card-title class="text-h5">
          {{ selected.name }}
        </v-card-title>
        <v-divider />
        <v-stepper v-model="e1" alt-labels color="green" class="elevation-0">
          <v-stepper-header class="elevation-0">
            <template v-for="(item, i, index) in groupBy(selected.platHasMenu, 'type_id')">
              <v-stepper-step
                :key="`${index}-step`"
                :complete="e1 > index"
                :step="index"
                :editable="e1 > index"
              >
                <v-col align="center" class="pa-0" cols="12">
                  {{ getTypeById(i, "name") }}<br>
                  <span style="font-weight: bold;">{{ selectMenuDetail[index] && selectMenuDetail[index].name }}</span>
                </v-col>
              </v-stepper-step>

              <v-divider
                :key="index"
                style="border-color: black"
              />
            </template>
            <v-stepper-step
              :key="`${recapStep()}-step`"
              :complete="e1 > recapStep()"
              :step="recapStep()"
            >
              <v-col align="center" class="pa-0" cols="12">
                Récapitulatif
              </v-col>
            </v-stepper-step>
          </v-stepper-header>
          <v-divider />
          <v-stepper-items>
            <v-stepper-content
              v-for="(item, i, index) in groupBy(selected.platHasMenu, 'type_id')"
              :key="`${index}-content`"
              :step="index"
            >
              <v-row dense class="ma-2">
                <v-col
                  v-for="(card, indexC) in item"
                  :key="`card${indexC}`"
                  :cols="4"
                >
                  <v-card @click="nextStep(card, e1)">
                    <v-img
                      :src="cardImage[card.id]"
                      class="white--text align-end"
                      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                      height="125px"
                    >
                      <v-card-title v-text="card.name" />
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-stepper-content>
            <v-stepper-content
              :key="`${recapStep()}-content`"
              :step="recapStep()"
            >
              <v-row dense class="ma-2">
                <template
                  v-for="(step, indexS) in selectMenuDetail"
                >
                  <v-list-item :key="`commande${indexS}`" align="start">
                    <v-list-item-avatar>
                      <v-img :src="cardImage[step.id]" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-row>
                        <v-col align="start" cols="8">
                          <v-list-item-title>
                            {{ step.name }}
                          </v-list-item-title>
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-row>
            </v-stepper-content>
          </v-stepper-items>
          <v-row justify="space-around">
            <v-btn
              class="ma-5"
              fab
              dark
              color="red"
              @click="closeMenu()"
            >
              <v-icon dark>
                mdi-close-thick
              </v-icon>
            </v-btn>
            <v-btn
              v-if="e1 == recapStep()"
              class="ma-5"
              fab
              dark
              color="teal"
              @click="addCart()"
            >
              <v-icon dark>
                mdi-cart-arrow-down
              </v-icon>
            </v-btn>
          </v-row>
        </v-stepper>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'MenuPage',
  data () {
    return {
      e1: 0,
      steps: 0,
      dialog: false,
      selected: null,
      items: [],
      restaurantId: null,
      selectMenuDetail: [],
      categorie: [],
      cardMenu: {},
      cardImage: {},
      imgIndex: 0
    }
  },

  watch: {
    steps (val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    }
  },

  async created () {
    this.restaurantId = this.$auth?.user?.restaurant_id
    if (this.restaurantId) { Promise.all([await this.getDataCategorie(), await this.getProducts()]) }
  },

  methods: {
    ...mapMutations(['pushItem']),
    ...mapGetters(['get']),

    // Récupréation des menus liés au restaurant
    async getProducts () {
      const res = await this.$axios({
        method: 'get',
        url: `/api/menu/read/all/restaurant/${this.restaurantId}`
      })

      if (res.data.values) {
        this.items = await res.data.values.map((item) => {
          return {
            ...item
          }
        })
        this.items.forEach(async (item) => {
          const { platHasMenu } = item
          platHasMenu.forEach(async (element) => {
            this.cardImage[element.id] = await this.fetchImageData(element)
          })
          this.cardMenu[item.id] = await this.fetchImageData(item)
          this.imgIndex++
        })
      }
    },

    // Sélection d'un menu -> ouverture popup séléection des items du menu
    selectMenu (item) {
      this.selected = item
      this.steps = Object.keys(this.groupBy(item.platHasMenu, 'type_id')).length
      this.dialog = true
    },

    closeMenu () {
      this.dialog = false
      this.selected = null
      this.selectMenuDetail = []
      this.e1 = 0
    },

    groupBy (xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    },

    recapStep () {
      return Object.keys(this.groupBy(this.selected.platHasMenu, 'type_id')).length
    },
    // Récupération des catégories
    async getDataCategorie () {
      this.categorie = []
      const response = await this.$axios({
        method: 'get',
        url: `/api/categorie/read/borne/all/restaurant/${this.restaurantId}`
      })

      if (response.data) {
        this.categorie = response.data.values.map(item => ({
          text: item.name,
          icon: item.icon,
          id: item.id
        }))
      }
    },
    getTypeById (index, type) {
      if (type === 'name') {
        // eslint-disable-next-line eqeqeq
        return this.categorie.find(x => x.id == index).text
      } else if (type === 'icon') {
        // eslint-disable-next-line eqeqeq
        return this.categorie.find(x => x.id == index).icon
      }
    },

    // Gestion des étapes pour le choix des items du menu
    nextStep (item, n) {
      if (this.selectMenuDetail[n]) {
        this.selectMenuDetail[n] = item
      } else {
        this.selectMenuDetail.push(item)
      }
      this.e1 = n + 1
    },

    addCart () {
      this.e1 = 0
      this.pushItem({
        key: 'card',
        item: {
          ...this.selected,
          detail: this.selectMenuDetail
        }
      })
      this.dialog = false
      this.selected = null
      this.selectMenuDetail = []
    },

    async fetchImageData (card) {
      try {
        const response = await this.$axios({
          method: 'get',
          url: `/api/image?url=${encodeURIComponent(card.image.url)}`,
          responseType: 'arraybuffer'
        })
        // Convert the binary data to base64 to use in the image src
        const base64Image = Buffer.from(response.data, 'binary').toString('base64')

        // Return the base64 URL of the image
        return `data:${response.headers['content-type']};base64,${base64Image}`
      } catch (error) {
        return null
      }
    }
  }
}
</script>
<style scoped>
.pointer {
  cursor: none;
}
</style>
