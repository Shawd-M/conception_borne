export default ({ store, $axios, $auth, app, error: nuxtError }) => {
  $axios.onResponse((response) => {
    if (
      !response.config.url.includes('auth/me') &&
      (!response.config.properties ||
        (response.config.properties && response.config.properties.toast))
    ) {
      // console.log(response.data.message)
    }
  })
  $axios.onError((error) => {
    const {
      response: {
        data: { message },
      },
    } = error
    if (error.response.status === 401) {
      app.$auth.logout()
      app.router.push('/')
    }
    if (
      !error.response.config.properties ||
      (error.response.config.properties &&
        error.response.config.properties.toast === undefined)
    ) {
      console.log(message)
    }
    return Promise.resolve(false)
  })
}
