<template>
  <my-auth />
</template>

<script>
import MyAuth from '~/components/MyAuth'

export default {
  name: 'IndexPage',
  components: { MyAuth },
  data () {
    return {
    }
  },
  methods: {
    goToMenu () {
      this.$router.push('/commande/menu')
    }
  }
}
</script>
