<template>
  <v-app>
    <v-app-bar
      v-if="$auth.user"
      fixed
      app
    >
      <v-btn
        icon
        @click="openshift = !openshift"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <img
        src="../assets/img/logo_cooksign.png"
        :style="{ width: '160px', height: '40px', marginTop: '5px' }"
        alt="Logo_CookSign"
      >
      <v-spacer />
      <v-btn
        icon
        @click="openConfig"
        class="mx-3"
      >
        <v-icon>mdi-cogs</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="logout"
        class="mx-3"
      >
        <v-icon>mdi-power</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="$auth.user && openshift"
      app
      :style="{ backgroundColor: colorAdmin }"
    > 
      <v-divider />
      <v-list
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :style="{ color: colorText }"
          @click="onButtonClick(item)"
        >
          <v-list-item-icon>
            <v-icon :style="{ color: colorText }">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-main class="pa-0 ma-5">
        <Nuxt />
      </v-main>
    </v-main>
    <personalize-admin
      ref="personalize"
      :detail="detail ? detail : {}"
      @update-detail="updateDetail"
    />
  </v-app>
</template>

<script>
import PersonalizeAdmin from '~/components/PersonalizeAdmin.vue'

export default {
  name: 'App',
  components: {
    PersonalizeAdmin,
  },
  data: () => ({
    openshift: true,
    restaurantDetailId: null,
    detail: null,
    items: [],
  }),
  computed: {
    colorAdmin() {
      return this.$store.state.colorAdmin || 'default';
    },
    colorText() {
      return this.$store.state.colorText || 'white';
    }
  },
  watch: {
    '$auth.user': {
      handler(newValue, oldValue) {
        if (newValue) {
          this.setColor(newValue.restaurant.restaurant_detail);
          this.setItems(newValue.roles[0].id);
        } else {
          this.setItems();
        }
      },
      deep: true,
    },
  },
  mounted() {
    const colorAdmin = localStorage.getItem('colorAdmin');
    const colorText = localStorage.getItem('colorText');

    if (colorAdmin) {
      this.$store.commit('update', { key: 'colorAdmin', value: colorAdmin });
    }
    if (colorText) {
      this.$store.commit('update', { key: 'colorText', value: colorText });
    }
    if (this.$auth.user) {
      this.setItems(this.$auth.user.roles[0].id);
    }
  },
  methods: {
    setColor(restaurant_detail) {
      const colorAdmin = restaurant_detail?.colorAdmin || '#8BD78F';
      const colorText = restaurant_detail?.colorText || 'white';

      this.$store.commit('update', { key: 'colorAdmin', value: colorAdmin });
      this.$store.commit('update', { key: 'colorText', value: colorText });

      this.detail = {
        colorAdmin: this.colorAdmin,
        colorText: this.colorText
      }
      this.restaurantDetailId = this.$auth.user.restaurant.detail_id

      // Save to localStorage
      localStorage.setItem('colorAdmin', this.colorAdmin);
      localStorage.setItem('colorText', this.colorText);
    },
    setItems(roleId = null) {
      this.items = [
        {
          title: "Vue d'ensemble",
          icon: 'mdi-view-dashboard',
          to: '/dashboard'
        },
        {
          title: 'Bornes',
          icon: 'mdi-tablet-dashboard',
          to: '/borne'
        },
        {
          title: 'Menus',
          icon: 'mdi-food',
          to: '/menu'
        },
      ];
      if (roleId === 1) {
        this.items.push(
          {
            title: 'Liste des restaurant',
            icon: 'mdi-table-chair',
            to: '/administration/restaurant-liste'
          },
          {
            title: 'Liste des utiliasteurs',
            icon: 'mdi-account-details',
            to: '/administration/users-liste'
          },
          {
            title: 'Liste des bornes',
            icon: 'mdi-format-list-text',
            to: '/administration/bornes-liste'
          },
        );
      }
    },
    async onButtonClick(item) {
      await this.$router.push(item.to)
    },
    async updateDetail(item) {
      const formData = new FormData()
      for (const property in item) {
        if (item[property])
          formData.append(property, item[property])
      }

      const response = await this.$axios({
        method: 'put',
        url: `/api/restaurant-detail/update/${this.restaurantDetailId}`,
        data: formData,
      })

      if (response) {
        this.detail = item
        this.closeConfig()
      }
    },
    openConfig() {
      this.$refs.personalize.open()
    },
    closeConfig() {
      this.$refs.personalize.close()
    },
    logout() {
      this.$auth.logout()
      this.openShift = true
    }
  },
};
</script>
