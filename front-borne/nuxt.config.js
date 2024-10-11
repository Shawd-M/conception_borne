import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - front-borne',
    title: 'front-borne',
    htmlAttrs: {
      lang: 'en'
    },
    script: [
      { src: '@/assets/global.js', type: 'text/javascript', body: true }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/axios', mode: 'client' },
    { src: '~/plugins/hide-cursor.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true
  },

  proxy: {
    '/api/': {
      target: process.env.API,
      pathRewrite: { '^/api/': '' },
      changeOrigin: true
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          default: '#8BD78F',
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token', // the token property should be set here, `propertyName` in endpoint was deprecated.
          type: 'Bearer' // should be "Bearer" if is jwt token
        },
        endpoints: {
          login: {
            url: '/api/auth/login/borne',
            method: 'post',
            propertyName: 'data.token'
          },
          user: {
            url: '/api/auth/me',
            method: 'get',
            propertyName: false
          },
          logout: false
        },
        user: {
          property: false
        }
      }
    },
    redirect: {
      login: '/',
      logout: '/',
      home: '/home'
    },
    cookie: {
      options: {
        maxAge: 5
      }
    },
    tokenRequired: true,
    tokenType: 'Bearer',
    watchLoggedIn: true,
    rewriteRedirects: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  server: {
    port: 3001 // par défaut: 3000
  }
}
