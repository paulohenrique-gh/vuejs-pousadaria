const app = Vue.createApp({
  data() {
    return {
      searchText: '',
      errorMessage: '',

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

      cities: [],      
      guesthouses: [],
      rooms: [],
      
      hideGuesthouseDetails: true,
      hideRooms: true,
    }
  },

  async mounted() {
    await this.getCities();
    await this.getGuesthouses();
  },

  methods: {
    fillGuesthousesArray(guesthouses) {
      this.guesthouses = [];
  
      guesthouses.forEach(item => {
        let guesthouse = new Object();
        guesthouse.id = item.id;
        guesthouse.brandName = item.brand_name;
        this.guesthouses.push(guesthouse);
      });

      document.querySelector('main').hidden = false;
    },

    async getCities() {
      this.hideDetailsAndErrors();

      try {
        let response = await fetch(`http://localhost:3000/api/v1/guesthouses/cities`)
        
        if (response.status !== 200) {
          this.errorMessage = 'Dados indisponíveis';
          return;
        }

        let cities = await response.json();

        cities.forEach(city => this.cities.push(city.city_name));
      } catch (error) {
        this.errorMessage = 'Dados indisponíveis';
      }
    },

    async getGuesthouses() {
      this.hideDetailsAndErrors();

      try {
        let url = '';
        if (this.searchText) {
          url = `http://localhost:3000/api/v1/guesthouses/?search=${this.searchText}`;
        } else {
          url = `http://localhost:3000/api/v1/guesthouses`;
        }

        let response = await fetch(url);

        if (response.status !== 200) {
          this.errorMessage = 'Dados indisponíveis';
          return;
        }

        let guesthouses = await response.json();

        this.fillGuesthousesArray(guesthouses);
      } catch(e) {
        this.errorMessage = 'Dados indisponíveis';
      }
    },

    async getGuesthousesByCity(city) {
      this.hideDetailsAndErrors();

      try {
        let response = await fetch(`http://localhost:3000/api/v1/guesthouses/cities/?city=${city}`)

        if (response.status !== 200) {
          this.errorMessage = 'Dados indisponíveis';
          return;
        }

        let guesthouses = await response.json();

        this.fillGuesthousesArray(guesthouses);
      } catch (error) {
        this.errorMessage = 'Dados indisponíveis';
      }
    },

    loadAll() {
      this.searchText = '';
      this.getGuesthouses();
    },
    
    async getDetails(id) {
      this.hideDetailsAndErrors();
      this.hideRoomForm = true;
      this.rooms = [];

      try {
        let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${id}`)

        if (response.status !== 200) {
          this.errorMessage = 'Dados indisponíveis';
        }

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
      } catch (e) {
        this.errorMessage = 'Dados indisponíveis';
      }
    },

    convertToCurrency(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      })
    },

    async getRooms(id) {
      this.errorMessage = '';

      try {
        let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${id}/rooms`)

        if (response.status !== 200) {
          this.errorMessage = 'Dados indisponíveis';
        }

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
      } catch (e) {
        this.errorMessage = 'Dados indisponíveis'
      }
    },

    hideDetailsAndErrors() {
      this.hideGuesthouseDetails = true;
      this.hideRooms = true;
      this.errorMessage = '';
    },

    async checkAvailability(roomId) {
      this.errorMessage = '';
      
      try {
        let room = this.rooms.find(r => r.id === roomId);
  
        let checkinValue = document.getElementById(`checkin-${roomId}`).value;
        let checkoutValue = document.getElementById(`checkout-${roomId}`).value;
        let guestCountValue = document.getElementById(`guest-count-${roomId}`).value;
  
        let url = `http://localhost:3000/api/v1/rooms/${roomId}/check_availability/?` +
                  `checkin=${checkinValue}&checkout=${checkoutValue}&guest_count=${guestCountValue}`
  
        let response = await fetch(url)

        let responseJson = await response.json();
        if (responseJson.stay_total) {
          let total = this.convertToCurrency(responseJson.stay_total);
  
          room.response = `Total da hospedagem: ${total}`
        } else if (responseJson.error === 'Quarto não disponível no período informado'){
          room.response = responseJson.error;
        } else {
          room.response = "Dados inválidos";
        }
      } catch (e) {
        this.errorMessage = 'Dados indisponíveis';
      }
    }
  },
  
})

app.mount('#app')