<template>
  <div @click="goToMenu">
    <v-img
      :src="imgBG"
      class="img"
    />
    <div
      align="end"
      justify="center"
      class="row ma-0 mb-3"
    >
      <v-row
        justify="center"
        align="center"
        :style="details && details.color ? `background-color: ${details.color}` : 'background-color: white'"
        class="text-center'"
      >
        <h2 style="color:#000">
          TOUCHEZ POUR COMMANDER
        </h2>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  data () {
    return {
      details: null,
      imgBG: null
    }
  },

  mounted () {
    this.setBackground()
  },
  methods: {
    ...mapGetters(['get']),
    ...mapMutations(['update']),

    async setBackground () {
      if (this.get()('homeDetails') && this.get()('ImageBg')) {
        this.details = this.get()('homeDetails')
        this.imgBG = this.get()('ImageBg')
        // console.log(this.get()('ImageBg'), 'lalalal')
      } else {
        const response = await this.$axios({
          method: 'get',
          url: `/api/restaurant-detail/read/by/${this.$auth.user.restaurant_id}`
        })
        this.update({
          key: 'homeDetails',
          value: response.data.values
        })

        this.details = response.data.values
        this.downloadAndSaveImage(this.details.image.image_id)
      }
    },

    async downloadAndSaveImage (fileID) {
      try {
        const { data } = await this.$axios({
          method: 'post',
          url: '/api/restaurant-detail/downloadFile',
          data: {
            fileID
          },
          responseType: 'blob' // Définir responseType sur 'blob'
        })

        const blob = new Blob([data])
        const imageUrl = URL.createObjectURL(blob)
        this.update({
          key: 'ImageBg',
          value: imageUrl
        })
        this.imgBG = imageUrl || 'https://drive.google.com/uc?id=16dJbxhlXEqK9F4CUS0dMDcrFnQFCP_nF&export=download'
      } catch (error) {
        console.error('Une erreur s\'est produite lors du téléchargement de l\'image :', error)
      }
    },
    goToMenu () {
      this.$router.push('/commande/menu')
    }
  }
}
</script>

<style scoped>
.row {
  width: 101%;
  height: 30%;
  z-index: 1;
  position: absolute;
  bottom: 0;
  left:0
}
.img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: no-repeat center center;
  background-size: cover;
  background-color: white;
  filter: brightness(100%);
  z-index:1;
}
</style>
