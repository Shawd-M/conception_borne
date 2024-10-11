<template>
  <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        width="1000"
        persistent
      >
        <v-card>
          <v-toolbar
            :color="custom.color || 'default'"
            dark
          >
            Personalisation des bornes
          </v-toolbar>
          <v-card
            flat
            tile
          >
            <v-window
              v-model="onboarding"
              reverse
            >
              <v-window-item v-if="index === 0">
                <v-card max-height="2000">
                  <v-card-title class="text-h5">
                    Modifier l'écran d'attente
                  </v-card-title>
                  <v-row
                    class="ma-0"
                    justify="center"
                  >
                    <v-card>
                      <v-img
                        :src="custom.image && imageURL ? imageURL : detailItem.image ? detailItem.image.url : null"
                        max-height="300"
                        max-width="500"
                        class="pointer"
                        @click="onButtonClick"
                      />
                    </v-card>
                    <v-btn icon @click="onButtonClick"><v-icon>mdi-image-edit</v-icon></v-btn>
                  </v-row>
                  <input
                    ref="uploader"
                    accept="image/*"
                    class="d-none"
                    type="file"
                    @change="handleFileUpload"
                  >
                </v-card>
              </v-window-item>
              <v-window-item v-if="index === 1">
                <v-card>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-color-picker
                        v-model="custom.color"
                        show-swatches
                        swatches-max-height="100"
                        hide-mode-switch
                        mode="hexa"
                        @input="updateThemeColor"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-window-item>
            </v-window>
            <v-card-actions class="justify-space-between">
              <v-btn
                text
                @click="prev"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-item-group
                v-model="index"
                class="text-center"
                mandatory
              >
                <v-item
                  v-for="(card, i) in cards"
                  :key="i"
                  v-slot="{ active, toggle }"
                >
                  <v-btn
                    :input-value="active"
                    icon
                    @click="toggle"
                  >
                    <v-icon>mdi-record</v-icon>
                  </v-btn>
                </v-item>
              </v-item-group>
              <v-btn
                text
                @click="next"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="close"
            >
              Close
            </v-btn>
            <v-btn
              text
              @click="updateDetail"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'PersonalizeBorne',
  props: {
    detail: {
      type: Object,
      default: null,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      onboarding: false,
      detailItem: {},
      index: 0,
      type: '',
      custom: {
        image: null,
        color: '#8BD78F',
        image_id: null,
        google_id: null,
      }
    };
  },
  computed: {
    cards() {
      return [1, 2];
    },
    imageURL() {
      return this.custom.image ? URL.createObjectURL(this.custom.image) : null
    },
  },

  mounted() {
    this.detail ? this.detailItem = this.detail : {}
    this.setCustom()
  },

  watch: {
    detail(value) {
      this.detailItem = value
      this.setCustom()
    },
  },

  methods: {
    prev() {
      this.index--;
    },
    next() {
      this.index++;
    },
    open () {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
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

    handleFileUpload(e) {
      try {
        this.custom.image = e.target.files[0]
      } catch (error) {
        console.log(error)
      }
    },

    updateDetail() {
      this.$emit('update-detail', this.custom)
    },

    setCustom() {
      this.custom.google_id = this.detailItem.image ? this.detailItem.image.image_id : null
      this.custom.image_id = this.detailItem.image ? this.detailItem.image_id : null
      this.custom.color = this.detailItem.color ? this.detailItem.color : '#8BD78F'
    }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
