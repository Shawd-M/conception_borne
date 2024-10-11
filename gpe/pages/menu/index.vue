<template>
  <div>
    <v-row class="ma-0 pa-0">
      <v-col>
        <v-tabs
          v-model="indexTabs"
          :color="$store.state.colorAdmin ? $store.state.colorAdmin : 'default'"
        >
          <v-tab>Plat</v-tab>
          <v-tab>Menu</v-tab>
        </v-tabs>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn 
          v-for="(item, index) in btnList"
          :key="`btn${index}`"
          :color="$store.state.colorAdmin ? $store.state.colorAdmin : 'default'"
          class="ma-2"
          :style="{ color: $store.state.colorText ? $store.state.colorText : 'white' }"
          align="end"
          @click="openDialog(item.dialog)"
        >
          {{ item.title }}
          <v-icon
            right
            dark
          >
            {{ item.icon }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="mx-auto" :key="imgIndex">
      <v-container fluid>
        <v-col class="ma-0 pa-0">
          <template v-if="!indexTabs">
            <v-col
              v-if="filteredItemPlat(itemCategorie.id).length"
              v-for="(itemCategorie, indexCategorie) in itemCategorie"
              :key="indexCategorie"
            >
              <h3>{{ itemCategorie.name }} {{ "&nbsp" }} <v-icon>{{ itemCategorie.icon }}</v-icon></h3>
              <v-divider class="my-2"/>
              <v-row class="my-3">
                <v-col
                  v-for="(card, cardIndex) in filteredItemPlat(itemCategorie.id)"
                  :key="cardIndex"
                  cols="2"
                  sm="4"
                  md="3"
                >
                  <v-card class="d-flex flex-column" max-width="320" height="100%">
                    <v-card-title>
                      {{ card.name }}
                    </v-card-title>
                    <v-col justify="center" align="center">
                      <v-img max-height="200" max-width="350" :src="cardImages[card.id]" />
                    </v-col>
                    <v-card-subtitle class="pt-0" justify="center">
                      Catégorie : {{ card.categorie.name }} <v-icon> {{ card.categorie.icon }} </v-icon>
                    </v-card-subtitle>
                    <v-card-subtitle class="pt-0">
                      Description : {{ card.description }}
                    </v-card-subtitle>
                    <v-card-subtitle class="pt-0">
                      Prix : {{ card.price }} €
                    </v-card-subtitle>
                    <v-spacer />
                    <v-divider />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn v-for="item in actionList" :key="item.id" icon @click="handleAction(item.action, card)">
                        <v-icon>{{ item.icon }}</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </template>
          <template v-else>
            <v-row dense>
              <v-col
                v-for="(card, cardIndex) in itemMenu"
                :key="cardIndex"
                cols="2"
                sm="4"
                md="3"
              >
                <v-card class="d-flex flex-column" max-width="320" height="100%">
                  <v-card-title>
                    {{ card.name }}
                  </v-card-title>
                  <v-col justify="center" align="center">
                    <v-img max-height="200" max-width="350" :src="cardMenu[card.id]"/>
                  </v-col>
                  <v-card-subtitle class="pt-0">
                    Description : {{ card.description }}
                  </v-card-subtitle>
                  <v-card-subtitle class="pt-0">
                    Prix : {{ card.price }} €
                  </v-card-subtitle>
                  <v-spacer />
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn v-for="item in actionList" :key="item.id" icon @click="handleAction(item.action, card)">
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-col>
      </v-container>
    </v-card>

    <menu-form-dialog
      ref="dialogPlat"
      title="Ajouter un nouveau plat"
      icon="mdi-hamburger-plus"
      :forms="addPlatForm"
      @validate="addPlat()"
      @close="close"
    >
    </menu-form-dialog>

    <menu-form-dialog
      ref="dialogPlatEdit"
      title="Modifier un plat"
      icon="mdi-hamburger"
      :forms="addPlatForm"
      isEdit
      :selectedItem="selectedItem"
      @validate="editPlat()"
      @close="close"
    >
    </menu-form-dialog>

    <menu-form-dialog
      ref="dialogMenu"
      title="Ajouter un nouveau Menu"
      icon="mdi-hamburger-plus"
      :itemCategorie="itemCategorie"
      :forms="addMenuForm"
      :cardImages="cardImages"
      isMenu
      :itemPlat="itemPlat"
      @validate="addMenu()"
      @close="close"
    >
    </menu-form-dialog>

    <menu-form-dialog
      ref="dialogMenuEdit"
      title="Modifier un Menu"
      icon="mdi-hamburger"
      :forms="addMenuForm"
      :itemCategorie="itemCategorie"
      :cardImages="cardImages"
      isMenu
      isEdit
      :selectedItem="selectedItem"
      :itemPlat="itemPlat"
      @validate="editMenu()"
      @close="close"
    >
    </menu-form-dialog>

    <menu-form-dialog
      ref="dialogParams"
      title="Gestion"
      icon="mdi-cogs"
      isConfig
      :forms="addGestionForm"
      :itemCategorie="itemCategorie"
      :itemIngredient="itemIngredient"
      @validate="validateConfig"
      @close="close"
    >
    </menu-form-dialog>

    <v-dialog
      v-model="removeDialog"
      persistent
      max-width="60%"
    >
      <v-form ref="form">
        <v-card>
          <v-card-title class="text-h5">
            <v-row class="pa-2">
              <v-icon
                class="mr-3"
                color="default"
              >
                mdi-hamburger-remove
              </v-icon>
              Retirer un produit
            </v-row>
          </v-card-title>
          <h3 class="px-5 mt-3">
            Voulez-vous vraiment supprimer ce produit ?
          </h3>
          <v-card-actions>
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
              @click="removePlat()"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import MenuFormDialog from '~/components/MenuFormDialog'

export default {
  name: 'Menus',
  components: { MenuFormDialog },
  data: () => ({
    cardImages: {},
    cardMenu: {},
    removeDialog: false,
    imgIndex: 0,
    indexTabs: 0,
    selectedItem: null,
    actionList: [
      {
        title: 'Modifier',
        icon: 'mdi-pencil',
        action: 'edit',
      },
      {
        title: 'Supprimer',
        icon: 'mdi-delete',
        action: 'remove',
      },
      {
        title: 'Dupliquer',
        icon: 'mdi-content-duplicate',
        action: 'duplicate',
      }
    ],
    itemPlat: [],
    itemMenu: [],
    itemCategorie: [],
    itemIngredient: [],
    restaurant_id: null,
    restaurant_folder: null,
    pramsTabsItems: [
      {
        text: 'Categories'
      },
      {
        text: 'Ingredients'
      }
    ],
    btnList: [
      {
        title: 'Ajouter un plat',
        icon: 'mdi-hamburger',
        dialog: 'dialogPlat',
      },
      {
        title: 'Ajouter un menu',
        icon: 'mdi-food-fork-drink',
        dialog: 'dialogMenu',
      },
      {
        title: 'Gestion',
        icon: 'mdi-cogs',
        dialog: 'dialogParams',
      }
    ],
    addPlatForm: [
      {
        name: 'v-text-field',
        props: {
          label: 'Nom *',
        },
        field: 'name',
        value: null,
        cols: 10,
      },
      {
        name: 'v-autocomplete',
        props: {
          label: 'Catégorie *',
          items: [],
        },
        field: 'type_id',
        value: null,
        cols: 5,
      },
      {
        name: 'v-text-field',
        props: {
          label: 'Prix *',
          type: "number",
        },
        field: 'price',
        value: null,
        cols: 5,
      },
      {
        name: 'v-autocomplete',
        props: {
          label: 'Ingredients',
          items: [],
          multiple: true,
          outlined: true,
        },
        field: 'ingredient',
        value: null,
        cols: 10,
      },
      {
        name: 'v-textarea',
        props: {
          label: 'Description *',
        },
        field: 'description',
        value: null,
        cols: 10,
      },
    ],
    addMenuForm: [
      {
        name: 'v-text-field',
        props: {
          label: 'Nom *',
        },
        field: 'name',
        value: null,
        cols: 5,
      },
      {
        name: 'v-text-field',
        props: {
          label: 'Prix *',
          type: "number",
        },
        field: 'price',
        value: null,
        cols: 5,
      },
      {
        name: 'v-textarea',
        props: {
          label: 'Description *',
        },
        field: 'description',
        value: null,
        cols: 10,
      },
    ],
    addGestionForm: [
      {
        name: 'v-text-field',
        props: {
          label: 'Nom',
        },
        field: 'name',
        value: null,
        cols: 7,
      },
      {
        name: 'v-select',
        props: {
          label: 'Icône',
          items: [
            'mdi-food',
            'mdi-food-apple',
            'mdi-food-croissant',
            'mdi-food-fork-drink',
            'mdi-food-drumstick',
            'mdi-food-steak',
            'mdi-food-drumstick-off',
            'mdi-food-off',
            'mdi-food-variant',
            'mdi-silverware',
            'mdi-silverware-fork-knife',
            'mdi-silverware-fork',
            'mdi-silverware-spoon',
            'mdi-silverware-fork-knife',
            'mdi-spoon-sugar',
            'mdi-glass-cocktail',
            'mdi-glass-mug',
            'mdi-coffee',
            'mdi-tea',
            'mdi-tea-outline',
            'mdi-cupcake',
            'mdi-bread-slice',
            'mdi-bread-slice-outline',
            'mdi-hamburger',
            'mdi-hamburger-off',
            'mdi-hamburger-check',
            'mdi-pizza',
            'mdi-taco',
            'mdi-corn',
            'mdi-corn-off',
            'mdi-egg',
            'mdi-egg-off',
            'mdi-egg-off-outline',
            'mdi-cheese',
            'mdi-cheese-off',
            ],
          },
        field: 'icon',
        value: null,
        cols: 3,
      },
    ],
  }),

  mounted() {
    this.restaurant_id = this.$auth.user.restaurant_id
    this.restaurant_folder = this.$auth.user.restaurant.folder
    this.getData()
  },

  computed: {
    filteredItemPlat() {
      return (categoryId) => {
        return this.itemPlat.filter((item) => item.categorie.id === categoryId).sort((a, b) => a.name.localeCompare(b.name));
      };
    },
  },

  methods: {
    async getData() {
      const getplatPromise = this.getDataPlat()
      const getmenuPromise = this.getDataMenu()
      const getcategoriePromise = this.getDataCategorie()
      const getingredientPromise = this.getDataIngredient()

      await Promise.all([
        getplatPromise,
        getmenuPromise,
        getcategoriePromise,
        getingredientPromise,
      ])
    },

    async getDataPlat() {
      this.itemPlat = []
      const response = await this.$axios({
        method: 'get',
        url: `/api/plat/read/all/restaurant/${this.restaurant_id}`,
      })

      if (response.data) {
        this.itemPlat = await response.data.values.map(item => {
          return {
            ...item,
          }
        })
        this.itemPlat.forEach(async (item) => {
          this.cardImages[item.id] = await this.fetchImageData(item);
          this.imgIndex++
        });
      }
    },

    async getDataMenu() {
       this.itemMenu = []
      const response = await this.$axios({
        method: 'get',
        url: `/api/menu/read/all/restaurant/${this.restaurant_id}`,
      })

      if (response.data) {
        this.itemMenu = response.data.values
        this.itemMenu.forEach(async (item) => {
          this.cardMenu[item.id] = await this.fetchImageData(item);
          this.imgIndex++
        });
      }
    },

    async getDataCategorie() {
      this.itemCategorie = []
      const response = await this.$axios({
        method: 'get',
        url: `/api/categorie/read/all/restaurant/${this.restaurant_id}`,
      })

      if (response.data) {
        this.itemCategorie = response.data.values.sort((a, b) => a.name.localeCompare(b.name))
        this.finArrayObject(this.addPlatForm, 'type_id').props.items = this.itemCategorie.map(item => {
          return {
            text: item.name,
            value: item.id,
          }
        })
      }
    },

    async getDataIngredient() {
      this.itemIngredient = []
      const response = await this.$axios({
        method: 'get',
        url: `/api/ingredient/read/all/restaurant/${this.restaurant_id}`,
      })

      if (response.data) {
        this.itemIngredient = response.data.values
        this.finArrayObject(this.addPlatForm, 'ingredient').props.items = this.itemIngredient.map(item => {
          return {
            text: item.name,
            value: item.id,
          }
        })
      }
    },

    async addPlat() {
      const { addPlatForm, restaurant_folder, restaurant_id, $refs, $axios } = this
      const image = $refs.dialogPlat.getData('image')

      const data = this.getFormValues(addPlatForm)

      const formData = new FormData()
      formData.append('restaurantFile', restaurant_folder)
      formData.append('restaurant_id', restaurant_id)
      formData.append('image', image)

      Object.entries(data).forEach(([key, value]) => 
        formData.append(key, key === 'ingredient' ? JSON.stringify(value) : value)
      )

      try {
        const { data: responseData } = await $axios.post(`/api/plat/create`, formData)

        if (responseData) {
          this.getDataPlat()
          this.clearFormValues(addPlatForm)
          $refs.dialogPlat.close()
        }
      } catch (error) {
        console.error('An error occurred while adding plat: ', error)
      }
    },

    async addMenu() {
      const { addMenuForm, restaurant_folder, restaurant_id, $refs, $axios } = this
      const image = $refs.dialogMenu.getData('image')
      const items = $refs.dialogMenu.getData('selectedPlat')

      if (!this.checkForms(addMenuForm) || !image || !items || !items.length) {
        return
      }

      const data = this.getFormValues(addMenuForm)

      const formData = new FormData()
      formData.append('restaurantFile', restaurant_folder)
      formData.append('restaurant_id', restaurant_id)
      formData.append('image', image)
      formData.append('items', JSON.stringify(items))

      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      )

      try {
        const { data: responseData } = await $axios.post(`/api/menu/create`, formData)

        if (responseData) {
          this.getDataMenu()
          this.clearFormValues(addMenuForm)
          $refs.dialogMenu.close()
        }
      } catch (error) {
        console.error('An error occurred while adding menu: ', error)
      }
    },

    async addCategorie() {
      const { addGestionForm } = this

      if (!this.checkForms(addGestionForm)) {
        return
      }

      const data = this.getFormValues(addGestionForm)

      const response = await this.$axios({
        method: 'post',
        url: `/api/categorie/create`,
        data: {
          ...data,
          restaurant_id: this.restaurant_id,
        },
      })

      if (response.data) {
        this.getDataCategorie()
        this.clearFormValues(addGestionForm)
      }
    },

    async addIngredient() {
      const { addGestionForm } = this

      if (!this.checkForms(addGestionForm)) {
        return
      }

      const data = this.getFormValues(addGestionForm)

      const response = await this.$axios({
        method: 'post',
        url: `/api/ingredient/create`,
        data: {
          ...data,
          restaurant_id: this.restaurant_id,
        },
      })

      if (response.data) {
        this.getDataIngredient()
        this.clearFormValues(addGestionForm)
      }
    },

    async handleAction(action, item) {
      if (item?.ingredient?.length > 0) {
        item.ingredient = item.ingredient.map(item => item.id ? item.id : item)
      }
      
      this.selectedItem = await item
      this[action](item)
    },

    edit(item) {
      switch(this.indexTabs) {
        case 0:
          this.$refs.dialogPlatEdit.open()
          break
        case 1:
          this.$refs.dialogMenuEdit.open()
          break
      }
    },

    remove() {
      this.removeDialog = true
    },

    duplicate() {
      this.duplicate()
    },
    
    async editPlat() {
      const form = this.$refs.dialogPlatEdit.getData('editForm')

      if (!this.checkForms(form)) {
        return
      }

      const image = this.$refs.dialogPlatEdit.getData('image')
      const data = this.getFormValues(form)

      if (data) {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('id', this.selectedItem.id)
        formData.append('image_id', this.selectedItem.image.image_id)
        formData.append('restaurantFile', this.restaurant_folder)
        Object.entries(data).forEach(([key, value]) => 
          formData.append(key, key === 'ingredient' ? JSON.stringify(value) : value)
        )
        const response = await this.$axios({
          method: 'put',
          url: `/api/plat/update`,
          data: formData,
        })

        if (response.data) {
          this.getDataPlat()
          this.$refs.dialogPlatEdit.close()
        }
      }
    },

    async editMenu() {
      const form = this.$refs.dialogMenuEdit.getData('editForm')
      const selectedPlat = this.$refs.dialogMenuEdit.getData('selectedPlat')

      if (!this.checkForms(form) || selectedPlat.length === 0) {
        return
      }

      const image = this.$refs.dialogMenuEdit.getData('image')
      const data = this.getFormValues(form)

      if (data) {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('id', this.selectedItem.id)
        formData.append('image_id', this.selectedItem.image.image_id)
        formData.append('restaurantFile', this.restaurant_folder)
        formData.append('items', JSON.stringify(selectedPlat))

        for (const property in data) {
          formData.append(property, data[property])
        }

        const response = await this.$axios({
          method: 'put',
          url: `/api/menu/update`,
          data: formData,
        })

        if (response.data) {
          this.getDataMenu()
          this.$refs.dialogMenuEdit.close()
        }
      }
    },

    async removePlat() {
      const response = await this.$axios({
        method: 'put',
        url: `/api/${this.indexTabs ? 'menu' : 'plat'}/disable/${this.selectedItem.id}`,
      })

      if (response.data) {
        this.removeDialog = false
        !this.indexTabs ? this.getDataPlat() : this.getDataMenu()
        this.close()
      }
    },

    async duplicate() {
      const response = await this.$axios({
        method: 'post',
        url: `/api/${this.indexTabs ? 'menu' : 'plat'}/duplicate`,
        data: {
          id: this.selectedItem.id,
          restaurantFile: this.restaurant_folder,
        },
      })

      if (response.data) {
        !this.indexTabs ? this.getDataPlat() : this.getDataMenu()
      }
    },

    validateConfig(index) {
      switch (index) {
        case 0:
          this.addCategorie()
          break
        default:
          this.addIngredient()
          break
      }
    },

    openDialog(dialog) {
      this.$refs[dialog].open()
    },

    checkForms(form) {
      let check = true
      for (const [key, value] of Object.entries(form)) {
        if (!value.value) {
          check = false
        }
      }
      return check
    },


    finArrayObject(array, field) {
      if (!array || !field) return null

      return array.find((element) => element.field === field)
    },

    getFormValues(form) {
      let data = {}
      for (const [key, item] of Object.entries(form)) {
        data[item.field] = item.value
      }
      return data
    },

    close() {
      this.clearFormValues(this.addPlatForm)
      this.clearFormValues(this.addMenuForm)
      this.clearFormValues(this.addGestionForm)
      this.selectedItem = null
      this.removeDialog = false
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
            case 'object':
              item.value = []
              break
            default:
              item.value = null
              break
          }
        }
      }
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
  },
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
