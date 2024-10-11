<template>
  <v-col>
    <v-row align="center" class="ma-3">
      <v-avatar
        :color="isSocketConnected ? 'green' : 'red'"
        size="20"
      >
      </v-avatar>
      <p class="ml-3">{{ isSocketConnected ? "Connecté" : "Non connecté, veuillez patienté" }}</p>
    </v-row>
    <h3>
      Liste des commandes ({{ commandList.length }})
      <v-icon
        class="pointer"
        @click="getCommande()"
      >
        mdi-refresh
      </v-icon>
    </h3>
    <v-container fluid>
      <v-row cols="3">
        <v-card
          v-for="(order, orderIndex) in commandList"
          :key="orderIndex"
          class="flex-column ma-2 fill-height"
          min-width="250"
        >
          <v-app-bar
            flat
            dense
            :color="getElapsedTimeColor(elapsedTimes[order.id])"
          >
            <v-row>
              <p class="white--text">
                {{ order.code }}
              </p>
              <v-spacer />
              <p class="white--text">
                {{ elapsedTimes[order.id] }}
              </p>
            </v-row>
          </v-app-bar>
          <v-list-item-subtitle
            v-for="(item, index) in order.order"
            :key="`order${index}`"
            class="pa-3 pb-0"
          >
            <p hide-details>- {{ item.name }}</p>
            <v-row v-if="item.ingredientSelected" class="mx-3 my-1">
              <p v-for="(ingredient, ingredientIndex) in item.ingredientSelected" :key="`ingredient${ingredientIndex}`">
                /{{ ingredient }}
              </p>
            </v-row>
            <v-col v-if="item.detail">
              <p v-for="(detail, detailIndex) in item.detail" :key="`detail${detailIndex}`">
                * {{ detail.name }}
              </p>
            </v-col>
          </v-list-item-subtitle>
          <v-spacer />
          <v-divider />
          <v-card-actions>
            <v-btn
              icon
              color="red"
              @click="closeOrder(order.id, 2)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn
              icon
              color="green"
              @click="closeOrder(order.id, 3)"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </v-col>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'Dashboard',
  components: {
  },
  data: () => ({
    isSocketConnected: false,
    socket: null,
    commandList: [],
    restaurantId: null,
    chartKey: 0,
    bornes: [],
    commande: [],
    resetOrder: 0,
    elapsedTimes: {},
    intervals: [],
    chart: {
      series: [{
        data: []
      }],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 10
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            barHeight: '10%',
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Rentabilité',
          },
        }
      }
    }
  }),

  beforeMount() {
    this.restaurantId = this.$auth.user.restaurant_id;

    this.socket = io('localhost:8080', {
      autoConnect: false,
      reconnectionAttempts: 5,
    });

    // Gestion des erreurs
    this.socket.on('connect_error', (error) => {
      console.error('Connection Error', error);
      this.isSocketConnected = false;
    });

    // Connexion au socket
    this.socket.connect();

    // Attendre que le socket soit connecté avant d'émettre 'restaurantId'
    this.socket.on('connect', () => {
      this.socket.emit('restaurantId', this.restaurantId);
    });

    this.socket.on('data', (data) => {
      this.isSocketConnected = true;
      this.commandList = data.map((item) => {
        return {
          id: item.id,
          code: item.code,
          order: item.order,
          createdAt: item.createdAt
        }
      })
      this.elapsedTimes = {}
      this.commandList.forEach((order) => {
        this.startChrono(order.createdAt, order.id);
      });
    });
  },

  beforeDestroy() {
    this.disconnectSocket();
  },

  mounted() {
    this.getCommande()
  },

  methods: {
    async getBorne() {
      try {
        this.bornes = []
        const response = await this.$axios({
          method: 'get',
          url: `/api/borne/read/all/bornes/${this.restaurantId}`,
        })

        if (response.data) {
          this.bornes = response.data.values
          this.bornes.forEach((borne) => {
            this.chart.series[0].data.push(0)
            this.chart.chartOptions.xaxis.categories.push(borne.name)
            this.chartKey++
          })
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getCommande() {
      try {
        this.commandList = []
        const { data } = await this.$axios({
          method: 'get',
          url: `/api/facture/read/all/restaurant/${this.restaurantId}`,
        })

        if (data) {
          this.commandList = await data.values.map((item) => {
            return {
              id: item.id,
              code: item.code,
              order: item.order,
              createdAt: item.createdAt
            }
          })
          this.elapsedTimes = {}
          this.commandList.forEach((order) => {
            this.startChrono(order.createdAt, order.id);
          });
        }
      } catch (error) {
        console.error(error);
      }
    },

    async closeOrder(id, active) {
      try {
        const { data } = await this.$axios({
          method: 'put',
          url: `/api/facture/update`,
          data: {
            id,
            active
          }
        })

        if (data) {
          clearInterval(this.intervals[id]); // Stop the interval
          delete this.intervals[id]; // Remove the interval from the list
          this.getCommande()
        }
      } catch (error) {
        console.error(error);
      }
    },

    startChrono(createdAt, orderId) {
      const intervalId = setInterval(() => {
        const now = Date.now();
        const diff = now - new Date(createdAt);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        this.$set(this.elapsedTimes, orderId, this.formatTime(hours) + ":" + this.formatTime(minutes) + ":" + this.formatTime(seconds));
      }, 1000);
      this.intervals[orderId] = intervalId;
    },

    formatTime(num) {
      return num < 10 ? "0" + num : num;
    },

    getElapsedTimeColor(elapsedTime) {
      if (!elapsedTime) return this.$store.state.colorAdmin ? this.$store.state.colorAdmin : 'default';
      const [hours, minutes] = elapsedTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      if (totalMinutes >= 10) {
        return 'red';
      } else if (totalMinutes >= 5) {
        return 'orange';
      } else {
        return this.$store.state.colorAdmin ? this.$store.state.colorAdmin : 'default';
      }
    },

    disconnectSocket() {
      console.log('Disconnecting from server');
      this.socket.off('data'); // Supprimer l'écouteur d'événements 'data'
      this.socket.disconnect();
      Object.values(this.intervals).forEach(clearInterval); // Nettoyer les intervalles
    },

    reconnectSocket() {
      if (!this.socket.connected) {
        this.socket.connect();
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

.title {
  color: #899ab4;
  font-size: 20px;
}

.description {
  margin: 10px;
  color: #899ab4;
  font-size: 12px;
}

.pointer {
  cursor: pointer;
}
</style>
