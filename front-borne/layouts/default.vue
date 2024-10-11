<!-- eslint-disable vue/valid-v-for -->
<template>
  <v-app>
    <v-row v-if="$auth.loggedIn" class="ma-0 pa-0">
      <v-col cols="10" class="ma-0 pa-0">
        <v-row>
          <v-col cols="12" class="pa-5 ma-0">
            <div style="height: 82vh;">
              <Nuxt class="nuxt-custom-height" />
            </div>
          </v-col>
        </v-row>
        <v-divider />
        <v-col cols="12">
          <v-sheet elevation="0" class="mx-auto">
            <v-slide-group :key="sliderIndex" v-model="activeIndex" active-class="success" style="justify-content: center;">
              <v-row justify="space-between" align="center" class="my-1 px-15">
                <v-slide-item v-for="(item,i) in items" :key="i" v-slot="{ active, toggle }">
                  <v-card
                    :color="active ? undefined : 'grey lighten-5'"
                    elevation="0"
                    class="ma-2"
                    height="100"
                    width="100"
                    :to="item.text === 'Menu' ? '/commande/menu' : `/categorie/${item.value}?`"
                    @click="toggle"
                  >
                    <v-col class="fill-height" justify="center" align="center">
                      <v-icon class="pt-5" size="x-large">
                        {{ item.icon }}
                      </v-icon>
                      <p>{{ item.text }}</p>
                    </v-col>
                  </v-card>
                </v-slide-item>
              </v-row>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-col>
      <v-divider vertical />
      <v-col class="px-1" cols="2">
        <v-list shaped two-line>
          <h3 style="color: grey" class="text-center">
            MA COMMANDE
          </h3>
          <div class="pt-3" style="height: 72vh;">
            <v-virtual-scroll :items="get()('card')" style="height: 100%;" item-height="90">
              <template #default="{ item, index }">
                <v-list-item :key="index">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.name }}
                      <template v-if="item.platHasMenu">
                        <v-list-item-subtitle v-for="(subItem, j) in item.detail" :key="j">
                          {{ getTypeId(subItem.type_id) }} : {{ subItem.name }}
                        </v-list-item-subtitle>
                      </template>
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-row>
                      <v-card-subtitle class="px-2" v-text="`${item.price} €`" />
                      <v-icon class="pointer" color="red" @click="removeCardItem(index)">
                        mdi-close
                      </v-icon>
                    </v-row>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </div>
          <v-divider />
          <v-list-item>
            <v-list-item-content>
              <h4>
                TOTAL : {{ get()('card').reduce((accumulator, object) => {
                  return accumulator + object.price;
                }, 0).toFixed(2) }} €
              </h4>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-col>
              <v-btn block class="ma-1 white--text" color="green" @click="validOrder = true">
                VALIDER
              </v-btn>
              <v-btn block class="ma-1 mt-5 white--text" color="red" @click="cancelOrder = true">
                ABANDONNER
              </v-btn>
            <!-- <v-btn block class="ma-1 mt-5 white--text" color="orange" @click="logout()">
                Déconnexion
              </v-btn> -->
            </v-col>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <Nuxt />
      </v-col>
    </v-row>
    <v-dialog
      v-model="validOrder"
      persistent
      max-width="500"
    >
      <v-card align="center" justify="center">
        <v-card-title class="text-h5">
          <v-row class="pa-3" justify="space-between">
            Commande
            <v-icon class="pointer" @click="validOrder = false">
              mdi-close
            </v-icon>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-list :key="imgIndex">
            <template v-for="(item, index) in cards">
              <v-list-item :key="`commande${index}`" align="start">
                <v-list-item-avatar>
                  <v-img :src="cardImage[item.id]" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-row>
                    <v-col align="start" cols="8">
                      <v-list-item-title>
                        {{ item.name }}
                        <template v-if="item.platHasMenu">
                          <v-list-item-subtitle v-for="(subItem, j) in item.detail" :key="j">
                            {{ getTypeId(subItem.type_id) }} : {{ subItem.name }}
                          </v-list-item-subtitle>
                        </template>
                      </v-list-item-title>
                    </v-col>
                    <v-col align="end" cols="4">
                      <v-list-item-subtitle>
                        {{ item.price }} €
                      </v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
              <v-col cols="12">
                <v-divider v-if="index !== get()('card').length - 1" />
              </v-col>
            </template>
          </v-list>
          <v-divider style="border-color: black" />
          <h4 class="mt-4" align="end">
            TOTAL : {{ get()('card').reduce((accumulator, object) => {
              return accumulator + object.price;
            }, 0).toFixed(2) }} €
          </h4>
          <p class="ma-0 mt-3">
            Type de commande : <span class="font-weight-bold"> {{ eatPlace === 'placce' ? 'Sur place' : 'A emporter' }} </span>
          </p>
          <v-row justify="space-around" class="mt-8 mb-3">
            <v-card
              width="40%"
              outlined
              class="pointer"
              @click="validCommand(0)"
            >
              <v-col>
                <v-icon large>
                  mdi-cash-multiple
                </v-icon>
                Espece
              </v-col>
            </v-card>
            <v-card
              width="40%"
              outlined
              class="pointer"
              @click="validCommand(1)"
            >
              <v-col>
                <v-icon large>
                  mdi-credit-card
                </v-icon>
                Carte
              </v-col>
            </v-card>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="cancelOrder"

      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5" align="center" justify="center">
          Êtes-vous sûres de vouloir annuler votre commande ?
        </v-card-title>
        <v-card-text />
        <v-card-actions align="space-between">
          <v-spacer />
          <v-btn color="red darken-1" class="white--text" @click="cancelOrder = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn color="green darken-1" class="white--text" @click="cancelOrder = false, goToHome()">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="$route.name !== 'home' && restaurantId"
      ref="dialogCarry"
      v-model="carry"

      persistent
      width="500"
    >
      <v-card class="pa-5" elevation="2">
        <v-card-title class="justify-center">
          Où souhaitez-vous déguster ?
        </v-card-title>
        <v-row class="pa-10 mt-5">
          <v-col align="center">
            <v-btn icon @click="commandType('place')">
              <v-img :src="require('../assets/imgs/sur_place.png')" height="100" width="100" />
            </v-btn>
            <v-card-subtitle class="mt-6">
              Sur place
            </v-card-subtitle>
          </v-col>
          <v-col align="center">
            <v-btn icon @click="commandType('emporter')">
              <v-img :src="require('../assets/imgs/carry.png')" height="100" width="100" />
            </v-btn>
            <v-card-subtitle class="mt-6">
              A emporter
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="recapCodeDialog"

      persistent
      width="30%"
    >
      <v-card height="60vh" class="text-center">
        <v-col cols="12" class="fill-height d-flex flex-column justify-center align-center">
          <p>
            Merci
          </p>
          <h1>
            Commande n°
          </h1>
          <v-card flat tile>
            <v-card-text>
              <h1>
                {{ codeCommand }}
              </h1>
            </v-card-text>
          </v-card>
        </v-col>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DefaultLayout',
  data () {
    return {
      recapCodeDialog: false,
      restaurantId: null,
      connect: false,
      carry: false,
      codeCommand: null,
      eatPlace: '',
      cards: [],
      cardItem: 0,
      cancelOrder: false,
      validOrder: false,
      activeIndex: 0,
      items: [],
      sliderIndex: 0,
      cardImage: {},
      imgIndex: 0
    }
  },

  watch: {
    $route (to, from) {
      if (from.name === 'home') {
        this.carry = true
      }
    },
    '$auth.user' (value) {
      if (value) {
        this.restaurantId = this.$auth.user.restaurant_id
        this.getDataCategorie()
      }
    },
    '$store.state.card' (value) {
      this.cards = value
      this.cardImage = {}
      value.forEach(async (item) => {
        this.cardImage[item.id] = await this.fetchImageData(item)
        this.imgIndex++
      }
      )
    }
  },
  mounted () {
    if (this.$auth.user) {
      this.restaurantId = this.$auth.user.restaurant_id
      this.getDataCategorie()
    }
    if (this.carry) {
      this.$refs.dialogCarry.open()
    }
  },
  methods: {
    ...mapMutations(['removeItem', 'reset']),
    ...mapGetters(['get']),

    logout () {
      this.$auth.logout()
      this.$router.push('/')
    },
    // Récupération des catégories
    async getDataCategorie () {
      this.items = []
      const response = await this.$axios({
        method: 'get',
        url: `/api/categorie/read/borne/all/restaurant/${this.restaurantId}`
      })

      if (response.data) {
        this.items = response.data.values.map(item => ({
          text: item.name,
          icon: item.icon,
          value: item.id
        }))
        this.items.unshift({
          text: 'Menu',
          icon: 'mdi-food'
        })
      }
      this.sliderIndex++
    },
    // Suppression d'un item du panier
    removeCardItem (index) {
      this.removeItem({
        key: 'card',
        index
      })
    },

    // Gestion commande sur place ou à emporter
    commandType (value) {
      this.eatPlace = value
      this.carry = false
    },

    // Récupération du type de l'item depuis son id
    getTypeId (id) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].value === id) {
          return this.items[i].text
        }
      }
      return null
    },

    // Validation de la commande puis stockage dans la BDD
    async validCommand (index) {
      const factCode = this.getFactCode(index)
      const command = this.get()('card').map((item) => {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          detail: item.detail
            ? item.detail.map((element) => {
              return {
                id: element.id,
                name: element.name,
                type_id: element.type_id,
                image: element.image?.url
              }
            })
            : null,
          ingredientSelected: item.ingredientSelected || null,
          image: item.image
        }
      })
      this.validOrder = false
      const { data } = await this.$axios({
        method: 'post',
        url: '/api/facture/create',
        data: {
          restaurant_id: this.restaurantId,
          order: command,
          totalPrice: this.get()('card').reduce((accumulator, object) => {
            return accumulator + object.price
          }, 0).toFixed(2),
          code: factCode
        }
      })

      if (data) {
        this.codeCommand = factCode
        this.recapCodeDialog = true
        setTimeout(() => this.resetCommand(), 4000)
      }
    },

    resetCommand () {
      this.carry = true
      this.codeCommand = null
      this.recapCodeDialog = false
      this.reset('card')
      this.$router.push('/home')
    },

    // Génération du code de la commande
    getFactCode (index) {
      if (!index) {
        return `ESP ${new Date().getHours().toString()[0]}${new Date().getMinutes().toString()[0]}${new Date().getSeconds().toString()[0]}`
      } else {
        return `CB ${new Date().getHours().toString()[0]}${new Date().getMinutes().toString()[0]}${new Date().getSeconds().toString()[0]}`
      }
    },

    goToHome () {
      // this.reset('card')
      this.$router.push('/home')
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
.nuxt-custom-height {
  height: 82vh;
  overflow: auto;
}
.v-tabs-items__content:focus {
  outline: 2px solid blue;
}
</style>
