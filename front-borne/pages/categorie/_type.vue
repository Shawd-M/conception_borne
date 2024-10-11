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
            class="d-flex flex-column"
            rounded="md"
            max-width="300"
            height="350"
            @click="openDialog(card)"
          >
            <v-img :src="cardImages[card.id]" height="60%" max-width="300" class="rounded-t-md" />
            <div class="d-flex justify-end mr-4 mt-n4">
              <v-btn elevation="0" color="green" style="pointer-events: none">
                <div class="text-white">
                  <v-card-title class="pa-0 text-h6" v-text="card.price + ' €'" />
                </div>
              </v-btn>
            </div>
            <v-card-text class="px-1 py-0">
              <v-card-title class="text-h6 py-0" v-text="truncateText(card.name, 18)" />
              <v-card-text class="pb-4" v-text="truncateText(card.description)" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-if="selected" v-model="dialog" width="75%">
      <v-card>
        <v-container fluid>
          <v-row>
            <v-col cols="4" class="align-self-center">
              <v-img :src="cardImages[selected.id]" height="300px" cover style="border-radius: 7px" />
            </v-col>
            <v-col cols="8" class="d-flex flex-column">
              <v-card-title class="align-self-start mb-4">
                {{ selected.name }}
              </v-card-title>
              <v-card-subtitle class="align-self-start">
                {{ selected.description }}
              </v-card-subtitle>
              <template v-if="selected.ingredient && selected.ingredient.length">
                <v-divider />
                <v-card-title :key="ingredientIndex" class="align-self-start">
                  Ingrédients
                </v-card-title>
                <div class="scrollable-content">
                  <v-col>
                    <v-btn
                      v-for="(ingredient, indexIngredient) in selected.ingredient"
                      :key="`Ingredient${indexIngredient}`"
                      outlined
                      class="ma-3"
                      height="100px"
                      width="100px"
                      :color="selected.ingredientSelected.includes(ingredient.name) ? 'green' : 'red'"
                      @click="selectIngredient(ingredient)"
                    >
                      <div class="d-flex flex-column align-center">
                        <v-icon class="my-2">
                          {{ ingredient.icon }}
                        </v-icon> <!-- Icône -->
                        <span>{{ ingredient.name }}</span> <!-- Texte -->
                      </div>
                    </v-btn>
                  </v-col>
                </div>
              </template>
              <v-spacer />
              <v-card-title class="d-flex justify-end align-end" style="padding-right: 15%;">
                {{ selected.price }} €
              </v-card-title>
              <v-card-actions class="align-self-end">
                <v-btn fab color="green" @click="addCart(selected)">
                  <v-icon color="white">
                    mdi-cart-arrow-down
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CategorieType',
  data () {
    return {
      dialog: false,
      items: [],
      restaurantId: null,
      type: null,
      cardImages: {},
      ingredientIndex: 0,
      imgIndex: 0,
      selected: null
    }
  },
  async mounted () {
    this.restaurantId = this.$auth.user.restaurant_id
    this.type = this.$route.params.type
    await this.getProducts()
  },

  methods: {
    ...mapMutations(['pushItem']),
    ...mapGetters(['get']),

    async getProducts () {
      const res = await this.$axios({
        method: 'get',
        url: `/api/plat/read/restaurant/${this.restaurantId}/type/${this.type}`
      })

      if (res.data.values) {
        this.items = await res.data.values.map((item) => {
          return {
            ...item
          }
        })
        this.items.forEach(async (item) => {
          this.cardImages[item.id] = await this.fetchImageData(item)
          this.imgIndex++
        })
      }
    },

    openDialog (card) {
      this.selected = card
      this.selected.ingredientSelected = []
      this.dialog = true
    },

    addCart (item) {
      this.pushItem({
        key: 'card',
        item
      })
      this.dialog = false
      this.selected = null
    },

    selectIngredient (ingredient) {
      if (this.selected.ingredientSelected.includes(ingredient.name)) {
        this.selected.ingredientSelected = this.selected.ingredientSelected.filter(item => item !== ingredient.name)
      } else {
        this.selected.ingredientSelected.push(ingredient.name)
      }
      this.ingredientIndex++
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
    },

    truncateText (text, maxLength = 120) {
      return text && text.length > maxLength
        ? text.substring(0, maxLength) + '...'
        : text
    }
  }
}
</script>

<style scoped>
.scrollable-content {
  height: 200px;
  overflow-y: auto;
}
</style>
