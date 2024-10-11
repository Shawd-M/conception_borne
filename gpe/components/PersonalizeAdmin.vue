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
            :color="custom.colorAdmin || 'default'"
            :style="{ color: $store.state.colorText ? $store.state.colorText : 'white' }"
          >
            Personalisation du site
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
                <v-card>
                  <v-card-title class="text-h5">
                    Modifier de la couleur
                  </v-card-title>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-color-picker
                        v-model="custom.colorAdmin"
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
              <v-window-item v-if="index === 1">
                <v-card>
                  <v-card-title class="text-h5">
                    Modifier de la couleur du texte
                  </v-card-title>
                  <v-row>
                    <v-col class="d-flex justify-center ma-2">
                      <v-btn
                        class="ma-2"
                        outlined
                        color="black"
                        @click="updateTextColor('black')"
                      >
                        Noire
                      </v-btn>
                      <v-btn
                        class="ma-2"
                        color="black"
                        @click="updateTextColor('white')"
                      >
                        <p hide-details class="white--text ma-0">Blanc</p>
                      </v-btn>
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
              @click="closeReset()"
            >
              Annuler
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
import { mapMutations } from 'vuex'

export default {
  name: 'PersonalizeAdmin',
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
        colorAdmin: '#8BD78F',
        colorText: '#ffffff',
      }
    };
  },
  computed: {
    cards() {
      return [1, 2];
    },
  },

  mounted() {
    this.detail ? this.detailItem = this.detail : {}
    this.setCustom()
  },

  watch: {
    detail(value) {
      this.detailItem = value;
      this.setCustom();
      this.updateThemeColor(); // update theme colors
    },
  },

  methods: {
    ...mapMutations(['update']),

    prev() {
      this.index--;
    },
    next() {
      this.index++;
    },
    open () {
      this.setCustom();
      this.dialog = true;
    },
    closeReset() {
      this.update({
        key: 'colorAdmin',
        value: this.detailItem.colorAdmin ? this.detailItem.colorAdmin : '#8BD78F'
      })
      this.update({
        key: 'colorText',
        value: this.detailItem.colorText || 'white'
      })
      this.dialog = false;
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

    updateThemeColor() {
      if (this.$vuetify && this.$vuetify.theme) {
        this.update({
          key: 'colorAdmin',
          value: this.custom.colorAdmin ? this.custom.colorAdmin.slice(0, 7) : '#8BD78F'
        })
      }
    },

    updateTextColor(value) {
      this.custom.colorText = value;
      this.update({
        key: 'colorText',
        value: value
      })
    },

    updateDetail() {
      this.$emit('update-detail', this.custom)
    },

    setCustom() {
      this.custom.colorText = this.detailItem.colorText ? this.detailItem.colorText : '#ffffff';
      this.custom.colorAdmin = this.detailItem.colorAdmin ? this.detailItem.colorAdmin : '#8BD78F';
      this.updateThemeColor(); // update theme colors
    },
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
