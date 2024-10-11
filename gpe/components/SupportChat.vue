<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      left
      top
      offset-y
      transition="fade-transition"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          dark
          fixed
          bottom
          right
          fab
          color="default"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-information-variant</v-icon>
        </v-btn>
      </template>

      <v-card
        style="border: 3px solid #8BD78F"
        height="550"
        width="350"
        class="d-flex flex-column"
      >
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon large>
                mdi-account-circle
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              Bonjour, veuillez saisir le problème rencontré
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list class="item-list">
          <v-list-item
            v-for="(item, index) in message"
            :key="index"
          >
            <v-col
              v-if="item.id === 1"
              class="ma-0 mt-3 pa-0 rounded-l-xl rounded-t-xl white--text text-right"
              style="background-color: #8BD78F"
            >
              <p class="ma-0 pa-2 mx-1">
                {{ item.message }}
              </p>
            </v-col>
            <v-col
              v-else
              class="ma-0 mt-3 pa-0 rounded-r-xl rounded-t-xl default--text"
              style="border: 2px solid #8BD78F"
            >
              <p class="ma-0 pa-2 mx-1">
                {{ item.message }}
              </p>
            </v-col>
          </v-list-item>
        </v-list>
        <v-spacer />
        <v-card-actions>
          <v-text-field
            v-model="textInput"
            class="ma-0 mx-1 pa-0"
            append-icon="mdi-send"
            outlined
            color="default"
            hide-details
            @click:append="addMessage"
            @keydown.enter.prevent="addMessage"
          />
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'SupportChat',
  components: {},
  data: () => ({
    index: 0,
    menu: false,
    textInput: "",
    message: [
      {
          id:1,
          message: "ok",
      },
      {
          id:2,
          message: "c'estkokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokokok",
      },
      {
          id:1,
          message: "ok",
      },
      {
          id:2,
          message: "ok",
      },
    ]
  }),
  mounted() {
  },
  methods: {
    addMessage () {
        if (!this.textInput)
            return
        this.message.push({
            id: 1,
            message: this.textInput,
        })
        this.textInput = ""
    }
  }
}
</script>

<style>
.item-list{
  height:400px;/* or any height you want */
  overflow-y:auto
}
</style>