<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="60%">
      <v-form ref="forms">
        <v-card v-if="!isConfig">
          <v-card-title class="text-h5">
            <v-row class="pa-2">
              <v-icon class="mr-3" :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }">
                {{ icon }}
              </v-icon>
              {{ title }}
            </v-row>
          </v-card-title>
          <v-row justify="center" align="center">
            <v-col
              v-for="item in (!isEdit ? forms : editForm)"
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
          <v-row class="ma-0" justify="center">
            <v-col justify="center" align="center">
              <v-img
                v-if="isEdit"
                class="mb-5"
                style="border-radius: 10px"
                max-height="150"
                max-width="250"
                :src="image && imageURL ? imageURL : selectedItem ? selectedItem.image.url : null"
              ></v-img>
              <v-btn
                rounded
                outlined
                x-large
                :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }"
                :loading="isSelecting"
                @click="onButtonClick"
              >
                <v-list-item>
                  <v-list-item-action>
                    <v-icon left size="45" :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }"> mdi-camera </v-icon>
                  </v-list-item-action>
                  <v-list-item-title class="text-color">
                    {{ imgText }}
                  </v-list-item-title>
                </v-list-item>
              </v-btn>
              <v-btn v-if="isEdit && image" rounded outlined large color="red" @click="removeImage()">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <input
            ref="uploader"
            accept="image/*"
            class="d-none"
            type="file"
            @change="handleFileUploadPlat"
          />
          <v-item-group v-if="isMenu" :key="indexItemPlat" class="mt-5" multiple>
            <v-container>
              <v-row> 
                <v-col cols="3">
                    <v-select 
                      v-model="menuCategoryFilter"
                      :items="itemCategorie"
                      label="Categorie"
                      outlined
                      dense
                      hide-details
                      clearable
                      item-text="name"
                      item-value="id"
                    >
                    </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col v-for="(element, index) in itemPlatFilter" :key="index" cols="12" md="4">
                  <v-item v-slot="{ active, toggle }">
                    <v-card
                      :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }"
                      class="d-flex align-center"
                      dark
                      height="200"
                      @click="toggle(); selectPlat(element)"
                    >
                      <v-img
                        v-if="element.active === false"
                        height="200"
                        width="200"
                        :src="cardImages[element.id]"
                      />
                      <v-scroll-y-transition>
                        <v-img
                          v-if="element.active === true"
                          :src="cardImages[element.id]"
                          class="image-with-text"
                          height="200"
                          width="200"
                        >
                          <v-overlay absolute>
                            <template #default>
                              <div class="text-overlay">
                                <v-card-text class="text-content">
                                  {{ element.name }}
                                </v-card-text>
                              </div>
                            </template>
                          </v-overlay>
                        </v-img>
                      </v-scroll-y-transition>
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
          <v-card-actions>
            <p>* Champ obligatoire</p>
            <v-spacer />
            <v-btn :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }" text @click="close()"> Annuler </v-btn>
            <v-btn :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }" text @click="validate()">{{ !isEdit ? 'Ajouter' : 'Modifier' }}</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-else>
          <v-card-title class="text-h5">
            <v-row class="pa-2">
              <v-icon class="mr-3" :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }">
                {{ icon }}
              </v-icon>
              {{ title }}
            </v-row>
          </v-card-title>
          <v-tabs v-model="tabIndex">
            <v-tab v-for="item in pramsTabsItems" :key="item.text">
              {{ item.text }}
            </v-tab>
            <v-tab-item>
              <v-row>
                <v-col>
                  <v-simple-table>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-left">Categorie</th>
                          <th class="text-left">Icône</th>
                          <th class="text-left">Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in itemCategorie"
                          :key="`${item.name}${index}`"
                        >
                          <td>{{ item.name }}</td>
                          <td>
                            <v-icon>{{ item.icon }}</v-icon>
                          </td>
                          <td>
                            <v-checkbox
                              :color="$store.state.colorAdmin ? $store.state.colorAdmin : 'default'"
                              v-model="item.isActive"
                              :value="1"
                              @change="activeCategorie(item)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <v-divider vertical />
                <v-col>
                  <v-row justify="center" align="center">
                    <v-col
                      v-for="(item, index) in forms"
                      :key="`formcategorie${index}`"
                      :cols="item.cols"
                    >
                      <component
                        :is="item.name"
                        v-model="item.value"
                        v-bind="item.props"
                      >
                        <template
                          v-if="item.name === 'v-select'"
                          #selection="{ item }"
                        >
                          <v-icon>{{ item }}</v-icon>
                        </template>
                        <template
                          v-if="item.name === 'v-select'"
                          #item="{ item }"
                        >
                          <v-icon>{{ item }}</v-icon>
                        </template>
                      </component>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col class="mt-0 mb-4" cols="3">
                      <v-btn text :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }" @click="validate()">
                        {{ !isEdit ? 'Ajouter' : 'Modifier' }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col>
                  <v-simple-table>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-left">Ingredient</th>
                          <th class="text-left">Icône</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in itemIngredient"
                          :key="`${item.name}${index}`"
                        >
                          <td>{{ item.name }}</td>
                          <td>
                            <v-icon>{{ item.icon }}</v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <v-divider vertical />
                <v-col>
                  <v-row justify="center" align="center">
                    <v-col
                      v-for="(item, index) in forms"
                      :key="`formingredient${index}`"
                      :cols="item.cols"
                    >
                      <component
                        :is="item.name"
                        v-model="item.value"
                        v-bind="item.props"
                      >
                        <template
                          v-if="item.name === 'v-select'"
                          #selection="{ item }"
                        >
                          <v-icon>{{ item }}</v-icon>
                        </template>
                        <template
                          v-if="item.name === 'v-select'"
                          #item="{ item }"
                        >
                          <v-icon>{{ item }}</v-icon>
                        </template>
                      </component>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col class="mt-0 mb-4" cols="3">
                      <v-btn text :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }" @click="validate()">
                        {{ !isEdit ? 'Ajouter' : 'Modifier' }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs>
          <v-card-actions>
            <v-spacer />
            <v-btn :style="{ color: $store.state.colorAdmin ? $store.state.colorAdmin : 'default' }" text @click="close()"> Annuler </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-snackbar
      v-model="toastError"
      color="#D32F2F"
      :right="true"
      :top="true"
      :multi-line="true"
      :timeout="3000"
    >
      Erreur rencontrée lors de la récupération du fichier
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'MenuFormDialog',
  props: {
    title: {
      required: true,
      type: String,
    },
    icon: {
      required: true,
      type: String,
    },
    forms: {
      required: true,
      type: Array,
    },
    isMenu: {
      required: false,
      type: Boolean,
      default: false,
    },
    isConfig: {
      required: false,
      type: Boolean,
      default: false,
    },
    isEdit: {
      required: false,
      type: Boolean,
      default: false,
    },
    itemPlat: {
      required: false,
      type: Array,
    },
    itemCategorie: {
      required: false,
      type: Array,
    },
    itemIngredient: {
      required: false,
      type: Array,
    },
    selectedItem: {
      required: false,
      type: Object,
    },
    cardImages: {
      required: false,
      type: Object,
    },
  },

  data: () => ({
    tabIndex: 0,
    indexItemPlat: 0,
    dialog: false,
    image: null,
    menuCategoryFilter: null,
    isSelecting: false,
    toastError: false,
    itemPlatFilter: [],
    selectedPlat: [],
    editItem: {},
    editForm: [],
    pramsTabsItems: [
      {
        text: 'Categories',
      },
      {
        text: 'Ingredients',
      },
    ],
  }),

  computed: {
    imgText() {
      return this.image ? this.image.name : !this.isEdit ?  'Choisir une image' : 'Modifier l\'image'
    },
    imageURL() {
      return this.image ? URL.createObjectURL(this.image) : null
    },
  },

  mounted() {},

  watch: {
    selectedItem(value) {
      if (value) {
        if (this.isEdit) {
          this.setEditData()
        }
      }
    },
    menuCategoryFilter(value) {
      if (value) {
        this.itemPlatFilter = this.itemPlat.filter((item) => item?.categorie?.id === value).sort((a, b) => a.name.localeCompare(b.name))
      } else {
        this.itemPlatFilter = this.itemPlat.sort((a, b) => a.name.localeCompare(b.name))
      }
    },
  },

  methods: {
    open() {
      if (this.isMenu) {
        this.itemPlat.forEach((item) => {
          item.active = false
        }),
        this.itemPlatFilter = this.itemPlat.sort((a, b) => a.name.localeCompare(b.name))
      }
      if (this.isEdit) {
        this.editItem = this.selectedItem
        this.editForm = this.forms
        this.setEditData()
      }
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.$emit('close')
      this.image = null
      this.selectedPlat = []
      this.indexItemPlat++
      this.tabIndex = 0
      this.editItem = {}
      this.editForm = []
    },

    validate() {
      this.$emit('validate', this.isConfig ? this.tabIndex : null)
    },

    handleFileUploadPlat(e) {
      try {
        this.image = e.target.files[0]
      } catch (error) {
        this.toastError = true
      }
    },

    onButtonClick() {
      this.isSelecting = true
      window.addEventListener(
        'focus',
        () => {
          this.isSelecting = false
        },
        { once: true }
      )

      this.$refs.uploader.click()
    },

    selectPlat(item) {
      if (!this.selectedPlat.some((e) => e.id === item.id)) {
        item.active = true
        this.selectedPlat.push(item)
      } else {
        item.active = false
        this.selectedPlat = this.selectedPlat.filter((e) => e.id !== item.id)
      }
    },

    getData(data) {
      return this[data]
    },

    removeImage() {
      this.image = null
    },

    setEditData() {
      if (this.selectedItem) {
        this.editForm.forEach((item) => {
          item.value = this.selectedItem[item.field]
        })
        if (this.isMenu && this.selectedItem.platHasMenu) {
          this.selectedPlat = this.selectedItem.platHasMenu
          this.selectedPlat.forEach((item) => {
            if (this.itemPlat.some((e) => e.id === item.id)) {
              this.itemPlat.find((e) => e.id === item.id).active = true
            }
          })

        }
        this.indexItemPlat++
      }
    },

    async activeCategorie(item) {
      const response = await this.$axios({
        method: 'put',
        url: '/api/categorie/active',
        data: {
          id: item.id,
          isActive: item.isActive ? 1 : 0,
        },
      })
    },
  },
}
</script>

<style scoped>
.image-with-text {
  position: relative;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  z-index: 2;
}

.text-content {
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
}
</style>
