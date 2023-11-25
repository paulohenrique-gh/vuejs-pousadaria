const app = Vue.createApp({
  data() {
    return {
      guesthouses: []
    }
  },

  async mounted() {
    await this.getGuesthouses();
  },

  methods: {
    async getGuesthouses() {
      let response = await fetch('http://localhost:3000/api/v1/guesthouses');

      let data = await response.json();

      data.forEach(guesthouse => this.guesthouses.push(guesthouse));

      console.log(this.guesthouses)
    }
  }
})

app.mount('#app')