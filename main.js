const app = Vue.createApp({
  data() {
    return {
      searchText: '',

      id: '',
      brandName: '',
      description: '',
      phoneNumber: '',
      email: '',
      petPolicy: '',
      guesthousePolicy: '',
      checkinTime: '',
      checkoutTime: '',
      paymentMethods: '',
      address: '',
      averageRating: '',

      guesthouses: [],
      rooms: [],
      
      hideGuesthouseDetails: true,
      hideRooms: true,

      roomResponse: ''
    }
  },

  computed: {
    searchResults() {
      if (this.searchText) {
        return this.guesthouses.filter(guesthouse => {
          return guesthouse.brandName.toLowerCase().includes(this.searchText.toLowerCase());
        });
      } else {
        return this.guesthouses;
      }
    }
  },

  async mounted() {
    await this.getGuesthouses();
  },

  methods: {
    async getGuesthouses() {
      let response = await fetch('http://localhost:3000/api/v1/guesthouses');

      let data = await response.json();

      data.forEach(item => {
        let guesthouse = new Object();
        guesthouse.id = item.id;
        guesthouse.brandName = item.brand_name;
        this.guesthouses.push(guesthouse)
      });

      document.querySelector('main').hidden = false;
    },
    
    async getDetails(id) {
      this.hideRoomForm = true;
      this.rooms = [];

      let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${id}`)
      let guesthouse = await response.json();
      
      this.id = guesthouse.id;
      this.brandName = guesthouse.brand_name;
      this.averageRating = guesthouse.average_rating;
      this.description = guesthouse.description;
      this.phoneNumber = guesthouse.phone_number;
      this.email = guesthouse.email;
      this.petPolicy = guesthouse.pet_policy;
      this.guesthousePolicy = guesthouse.guesthouse_policy;
      this.checkinTime = guesthouse.checkin_time;
      this.checkoutTime = guesthouse.checkout_time;
      this.paymentMethods = [
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

      this.hideGuesthouseDetails = false;
    },

    async getRooms(id) {
      let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${id}/rooms`)
      let rooms = await response.json();

      this.rooms = [];

      rooms.forEach(item => {
        let room = new Object();
        room.id = item.id;
        room.name = item.name;
        room.description = item.description;
        room.dailyRate = this.convertToCurrency(item.daily_rate);
        room.dimension = item.dimension;
        room.maxPeople = item.max_people;
        room.features = [
          item.private_bathroom ? 'Banheiro próprio' : '',
          item.balcony ? 'Varanda' : '',
          item.air_conditioning ? 'Ar-condicionado' : '',
          item.tv ? 'TV': '',
          item.closet ? 'Guarda-roupas' : '',
          item.safe ? 'Cofre' : '',
          item.accessibility ? 'Acessível para pessoas com deficiência' : ''
        ].filter(feat => feat !== '');

        this.rooms.push(room);
      });

      this.hideRooms = false;
    },

    hideDetails() {
      this.hideGuesthouseDetails = true;
      this.hideRooms = true;
    },

    async checkAvailability(roomId) {
      let checkinValue = document.getElementById('checkin').value;
      let checkoutValue = document.getElementById('checkout').value;
      let guestCountValue = document.getElementById('guest-count').value;

      let url = `http://localhost:3000/api/v1/rooms/${roomId}/check_availability/?` +
                `checkin=${checkinValue}&checkout=${checkoutValue}&guest_count=${guestCountValue}`

      console.log(roomId)
      console.log(checkinValue)
      console.log(checkoutValue)
      console.log(guestCountValue)
      console.log(url)

      let response = await fetch(url)
      
      let responseJson = await response.json();

      console.log(responseJson)

      if (responseJson.stay_total) {
        let total = this.convertToCurrency(responseJson.stay_total);

        this.roomResponse = `Total da hospedagem: ${total}`
      } else if (responseJson.error === 'Quarto não disponível no período informado'){
        this.roomResponse = responseJson.error;
      } else {
        this.roomResponse = "Dados inválidos"
      }

      console.log('RESPONSEEEE')
      console.log(this.roomResponse)
    },

    convertToCurrency(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      })
    }
  },
  
})

app.mount('#app')