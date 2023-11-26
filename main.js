const app = Vue.createApp({
  data() {
    return {
      id: '',
      brand_name: '',
      description: '',
      phone_number: '',
      email: '',
      pet_policy: '',
      guesthouse_policy: '',
      checkin_time: '',
      checkout_time: '',
      payment_methods: '',
      address: '',
      average_rating: '',

      guesthouses: [],
      rooms: []
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

      console.log(this.guesthouses);
    },
    
    async getDetails(id) {
      this.rooms = [];

      let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${id}`)
      let guesthouse = await response.json();
      
      this.id = guesthouse.id;
      this.brand_name = guesthouse.brand_name;
      this.average_rating = guesthouse.average_rating;
      this.description = guesthouse.description;
      this.phone_number = guesthouse.phone_number;
      this.email = guesthouse.email;
      this.pet_policy = guesthouse.pet_policy;
      this.guesthouse_policy = guesthouse.guesthouse_policy;
      this.checkin_time = guesthouse.checkin_time;
      this.checkout_time = guesthouse.checkout_time;
      this.payment_methods = [
        guesthouse.payment_method_one,
        guesthouse.payment_method_two,
        guesthouse.payment_method_three
      ].filter(pm => pm !== '').join(' | ');
      this.address = [
        guesthouse.address.street_name,
        guesthouse.address.number,
        guesthouse.address.complement,
        guesthouse.address.neighbourhood,
        guesthouse.address.postal_code,
        guesthouse.address.city,
        guesthouse.address.state
      ].filter(info => info !== '').join(', ');

      document.querySelector('.guesthouse-details').removeAttribute('hidden')
    },

    async getRooms(id) {
      let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${id}/rooms`)
      let rooms = await response.json();

      this.rooms = [];

      console.log(rooms);
      rooms.forEach(item => {
        let room = new Object();
        room.id = item.id;
        room.name = item.name;
        room.description = item.description;
        room.daily_rate = item.daily_rate.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2
        });
        room.dimension = item.dimension;
        room.max_people = item.max_people;
        room.features = [
          item.private_bathroom ? 'Banheiro próprio' : '',
          item.balcony ? 'Varanda' : '',
          item.air_conditioning ? 'Ar-condicionado' : '',
          item.tv ? 'TV': '',
          item.closet ? 'Guarda-roupas' : '',
          item.safe ? 'Cofre' : '',
          item.accessibility ? 'Acessível para pessoas com deficiência' : ''
        ].filter(feat => feat !== '');

        console.log(room)
        this.rooms.push(room);
      });

      document.querySelector('.rooms').removeAttribute('hidden');
    }
  }
})

app.mount('#app')