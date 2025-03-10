<template>

  <div class="attraction-detail">
    <PalBook  ref="payopen" :totalPrice="calculateTotalPrice" />
    <!-- Header background image -->
    <div class="header-bg" :style="{ backgroundImage: `url(${attraction.cover})` }">
      <div class="overlay">
        <h1 class="title">{{ attraction.name }}</h1>
        <div class="meta-info">
          <div class="tags">
            <el-tag type="success" effect="dark">{{ attraction.category }}</el-tag>
            <el-tag type="info" effect="plain">4.9 Rating</el-tag>
            <el-tag type="warning" effect="plain">Sold {{ attraction.sold }}</el-tag>
          </div>
          <div class="price">
            <span class="currency">$</span>
            <span class="amount">{{ attraction.price }}</span>
            <span class="unit">/ person</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="container my-5">
      <div class="row g-4">
        <!-- Left content -->
        <div class="col-lg-8">
          <el-card class="detail-card" shadow="hover">
            <!-- Image gallery -->
            <el-carousel :interval="5000" height="400px" arrow="always">
              <el-carousel-item v-for="(img, index) in attraction.gallery" :key="index">
                <img :src="img" class="gallery-image" alt="Attraction image">
              </el-carousel-item>
            </el-carousel>

            <!-- Detailed information -->
            <div class="content-section">
              <h3 class="section-title">
                <el-icon><InfoFilled /></el-icon> Attraction Introduction
                <el-tag size="small" class="ms-2">Recommendation: ★★★★★</el-tag>
              </h3>
              <p class="text-content">{{ attraction.description }}</p>
              <div class="service-list">
                <div class="service-item" v-for="(item, index) in attraction.services" :key="index">
                  <el-icon :color="item.color"><component :is="item.icon" /></el-icon>
                  {{ item.text }}
                </div>
              </div>
            </div>

            <div class="content-section">
              <h3 class="section-title"><el-icon><Location /></el-icon> Location Information</h3>
              <div class="map-container">
                <img :src="attraction.map" alt="Location map" class="map-image">
                <div class="location-info">
                  <p>📍 Address: {{ attraction.address }}</p>
                  <p>🚗 Navigation: {{ attraction.navigation }}</p>
                  <p>🕒 Recommended visit duration: {{ attraction.duration }}</p>
                </div>
              </div>
            </div>

            <!-- New user reviews -->
            <div class="content-section">
              <h3 class="section-title"><el-icon><Comment /></el-icon> User Reviews (256)</h3>
              <div class="reviews">
                <div class="review-item" v-for="(review, index) in attraction.reviews" :key="index">
                  <el-avatar :src="review.avatar" />
                  <div class="review-content">
                    <div class="review-header">
                      <span class="user-name">{{ review.user }}</span>
                      <el-rate v-model="review.rating" disabled />
                      <span class="review-date">{{ review.date }}</span>
                    </div>
                    <p class="review-text">{{ review.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- Right side booking -->
        <div class="col-lg-4">
          <el-card class="booking-card" shadow="always">
            <h3 class="booking-title">Book Now</h3>
            <el-form :model="bookingForm" label-width="90px">
              <el-form-item label="Travel Date">
                <el-date-picker
                  v-model="bookingForm.date"
                  type="date"
                  placeholder="Select travel date"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledDate"
                  class="w-100"
                />
              </el-form-item>

              <el-form-item label="Visit Time">
                <el-time-select
                  v-model="bookingForm.time"
                  :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '18:30'
                  }"
                  placeholder="Select time"
                  class="w-100"
                />
              </el-form-item>

              <el-form-item label="Number of Visitors">
                <el-input-number 
                  v-model="bookingForm.people" 
                  :min="1" 
                  :max="10"
                  controls-position="right"
                  class="w-100"
                />
              </el-form-item>

              <el-form-item label="Contact Number">
                <el-input 
                  v-model="bookingForm.phone" 
                  placeholder="Enter phone number"
                  clearable
                />
              </el-form-item>

              <el-divider />

              <el-form-item label="Price Details">
                <div class="price-detail">
                  <div class="price-item">
                    <span>Unit Price</span>
                    <span>${{ attraction.price }} × {{ bookingForm.people }}</span>
                  </div>
                  <div class="price-item total">
                    <span>Total Price</span>
                    <span class="price-number">${{ calculateTotalPrice }}</span>
                  </div>
                </div>
              </el-form-item>

              <el-button 
                type="success" 
                size="large" 
                class="w-100 booking-btn"
                @click="handlepay"
              >
                <el-icon class="me-2"><Wallet /></el-icon>
                Pay Now
              </el-button>

              <div class="booking-tips">
                <el-icon><Warning /></el-icon>
                Reminder: The order must be paid within 30 minutes after confirmation, see the details for the cancellation policy.
              </div>
            </el-form>
          </el-card>

          <!-- New customer service information -->
          <el-card class="service-card mt-3" shadow="hover">
            <div class="customer-service">
              <el-icon class="service-icon"><Service /></el-icon>
              <div class="service-info">
                <h4>24/7 Customer Service</h4>
                <p>Phone: 400-123-4567</p>
                <p>Service Hours: Open year-round from 08:00 to 23:00</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  InfoFilled,
  Location,
  Comment,
  Wallet,
  Warning,
  Service
} from '@element-plus/icons-vue'
import PalBook from "../components/PalBook.vue"
const payopen = ref(null)
const handlepay=()=>{
  payopen.value.open();
}
const attractionsData = [
  {
    id: '1',
    name: 'Eiffel Tower',
    cover:  require('@/assets/imgs/p11.jpg'),
    category: 'Historical Landmark',
    price: 28,
    originalPrice: 35,
    sold: '18K',
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris',
    navigation: 'Subway line 6, Bir-Hakeim station',
    duration: '2-3 hours',
    description: 'A landmark of Paris, a symbol of the romantic city, with an observation deck to view the city',
    gallery: [
       require('@/assets/imgs/p12.jpg'),
       require('@/assets/imgs/p13.jpg')
    ],
    map:  require('@/assets/maps/map1.png'),
    services: [
      { icon: 'View', text: 'City Landmark', color: '#409EFF' },
      { icon: 'Platform', text: 'Observation Deck', color: '#E6A23C' }
    ],
    reviews: [
      {
        user: 'Paris Tourist',
        avatar: 'https://example.com/avatars/1.png',
        rating: 4.9,
        date: '2024-05-15',
        content: 'The night view is breathtaking, the summit experience is priceless!'
      }
    ]
  },
  {
    id: '2',
    name: 'Grand Canyon National Park',
    cover:  require('@/assets/imgs/p21.jpg'),
    category: 'Natural Wonder',
    price: 40,
    originalPrice: 50,
    sold: '23K',
    address: 'Grand Canyon Village, AZ 86023, USA',
    navigation: 'South Rim Visitor Center parking lot',
    duration: 'All day',
    description: 'One of the seven natural wonders of the world, a spectacular red rock canyon',
    gallery: [
       require('@/assets/imgs/p22.jpg'),
       require('@/assets/imgs/p23.jpg')
    ],
    map: require('@/assets/maps/map2.png'),
    services: [
      { icon: 'Hiking', text: 'Hiking Spot', color: '#67C23A' },
      { icon: 'Picture', text: 'Photography Points', color: '#F56C6C' }
    ],
    reviews: [
      {
        user: 'Nature Enthusiast',
        avatar: 'https://example.com/avatars/2.png',
        rating: 4.8,
        date: '2024-05-16',
        content: 'A magnificent geological wonder, the hiking trails are well-planned.'
      }
    ]
  },
  {
    id: '3',
    name: 'Colosseum',
    cover:  require('@/assets/imgs/p31.jpg'),
    category: 'Historical Landmark',
    price: 18,
    originalPrice: 24,
    sold: '15K',
    address: 'Piazza del Colosseo, 1, 00184 Roma RM',
    navigation: 'Subway B line, Colosseo station',
    duration: '2 hours',
    description: 'A symbol of ancient Roman civilization, experience the history of gladiators',
    gallery: [
      require('@/assets/imgs/p32.jpg'),
      require('@/assets/imgs/p33.jpg')
    ],
    services: [
      { icon: 'GuideBoard', text: 'Historical Landmark', color: '#909399' },
      { icon: 'Film', text: 'Filming Location', color: '#E6A23C' }
    ],
    map: require('@/assets/maps/map3.png'),
    reviews: [
      {
        user: 'History Buff',
        avatar: 'https://example.com/avatars/3.png',
        rating: 4.7,
        date: '2024-06-10',
        content: 'A historical monument full of significance, worth a visit.'
      }
    ]
  },
  {
    id: '4',
    name: 'Tokyo Disneyland',
    cover:  require('@/assets/imgs/p41.jpg'),
    category: 'Theme Park',
    price: 820,
    originalPrice: 9400,
    sold: '56K',
    address: '1-1 Maihama, Urayasu, Chiba 279-0031',
    navigation: '5-minute walk from JR Maihama station',
    duration: 'All day',
    description: 'The first Disney park in Asia, a dreamy fairy tale kingdom',
    gallery: [
       require('@/assets/imgs/p42.jpg'),
       require('@/assets/imgs/p43.jpg')
    ],
    map: require('@/assets/maps/map4.png'),
    services: [
      { icon: 'RollerCoaster', text: 'Roller Coaster', color: '#409EFF' },
      { icon: 'Parade', text: 'Parade', color: '#E6A23C' }
    ],
    reviews: [
      {
        user: 'Disney Fan',
        avatar: 'https://example.com/avatars/4.png',
        rating: 4.9,
        date: '2024-06-20',
        content: 'The experience in the park is truly magical! Every detail is full of fairy tale charm.'
      }
    ]
  },
  {
    id: '5',
    name: 'Maldives Villingili Island',
    cover:  require('@/assets/imgs/p51.jpg'),
    category: 'Natural Scenery',
    price: 450,
    originalPrice: 6000,
    sold: '8900',
    address: 'North Malé Atoll, Maldives',
    description: 'A pearl in the Indian Ocean, experience water villas and blue lagoons',
    gallery: [
       require('@/assets/imgs/p52.jpg'),
       require('@/assets/imgs/p53.jpg')
    ],
    map: require('@/assets/maps/map5.png'),
    services: [
      { icon: 'Beach', text: 'Private Beach', color: '#67C23A' },
      { icon: 'Snorkel', text: 'Snorkeling', color: '#F56C6C' }
    ],
    reviews: [
      {
        user: 'Island Tourist',
        avatar: 'https://example.com/avatars/5.png',
        rating: 4.8,
        date: '2024-06-25',
        content: 'A very peaceful resort, crystal-clear waters, a perfect vacation experience.'
      }
    ]
  },
  {
    id: '6',
    name: 'Statue of Liberty',
    cover:  require('@/assets/imgs/p61.jpg'),
    category: 'Historical Landmark',
    price: 24,
    originalPrice: 30,
    sold: '21K',
    address: 'Liberty Island, New York, NY 10004',
    navigation: 'Subway line 1 to South Ferry station',
    duration: '2 hours',
    description: 'A symbol of America, representing freedom and hope',
    gallery: [
       require('@/assets/imgs/p62.jpg'),
       require('@/assets/imgs/p63.jpg')
    ],
    map: require('@/assets/maps/map6.png'),
    services: [
      { icon: 'View', text: 'Observation Deck', color: '#409EFF' },
      { icon: 'Audio', text: 'Audio Guide', color: '#E6A23C' }
    ],
    reviews: [
      {
        user: 'Freedom Enthusiast',
        avatar: 'https://example.com/avatars/6.png',
        rating: 4.7,
        date: '2024-07-10',
        content: 'This statue makes me feel the strong sense of freedom, definitely worth a visit!'
      }
    ]
  },
  {
    id: '7',
    name: 'Jungfrau, Switzerland',
    cover:  require('@/assets/imgs/p71.jpg'),
    category: 'Natural Scenery',
    price: 210,
    originalPrice: 260,
    sold: '12K',
    address: 'Jungfraujoch, 3801 Lauterbrunnen',
    description: 'A classic spot in the Alps, stunning views of snow-capped mountains and glaciers',
    gallery: [
       require('@/assets/imgs/p72.jpg'),
       require('@/assets/imgs/p73.jpg')
    ],
    map: require('@/assets/maps/map7.png'),
    services: [
      { icon: 'Mountain', text: 'Skiing', color: '#67C23A' },
      { icon: 'View', text: 'Mountain View', color: '#409EFF' }
    ],
    reviews: [
      {
        user: 'Mountain Enthusiast',
        avatar: 'https://example.com/avatars/7.png',
        rating: 4.9,
        date: '2024-07-15',
        content: 'The scenery at the top of the mountain covered in ice and snow is breathtaking. It is a paradise for skiing and photography.'
      }
    ]
  },
  {
    id: '8',
    name: 'Burj Khalifa, Dubai',
    cover:  require('@/assets/imgs/p81.jpg'),
    category: 'Modern Architecture',
    price: 149,
    originalPrice: 199,
    sold: '34K',
    address: '1 Sheikh Mohammed bin Rashid Blvd, Dubai',
    navigation: 'Subway line 1, Burj Khalifa station',
    duration: '1-2 hours',
    description: 'The tallest building in the world, with a stunning view of Dubai from the top, especially breathtaking at night',
    gallery: [
       require('@/assets/imgs/p82.jpg'),
       require('@/assets/imgs/p83.jpg')
    ],
    map: require('@/assets/maps/map8.png'),
    services: [
      { icon: 'View', text: 'Panoramic Observation Deck', color: '#409EFF' },
      { icon: 'Elevator', text: 'High-speed Elevator', color: '#E6A23C' }
    ],
    reviews: [
      {
        user: 'Modern Architecture Enthusiast',
        avatar: 'https://example.com/avatars/8.png',
        rating: 4.8,
        date: '2024-07-20',
        content: 'The architectural design is stunning, and the view from the top is absolutely amazing.'
      }
    ]
  },
  {
    id: '9',
    name: 'Great Barrier Reef, Australia',
    cover:  require('@/assets/imgs/p91.jpg'),
    category: 'Natural Scenery',
    price: 350,
    originalPrice: 450,
    sold: '28K',
    address: 'Queensland, Australia',
    navigation: 'Boats from Cairns',
    duration: 'All day',
    description: 'The largest coral reef system in the world, a paradise for diving and snorkeling enthusiasts',
    gallery: [
       require('@/assets/imgs/p92.jpg'),
       require('@/assets/imgs/p93.jpg')
    ],
    map: require('@/assets/maps/map9.png'),
    services: [
      { icon: 'Snorkel', text: 'Snorkeling', color: '#67C23A' },
      { icon: 'Boat', text: 'Boat Tour', color: '#F56C6C' }
    ],
    reviews: [
      {
        user: 'Diving Enthusiast',
        avatar: 'https://example.com/avatars/9.png',
        rating: 4.9,
        date: '2024-08-10',
        content: 'The underwater world is unparalleled, full of rich marine life, a truly heavenly experience.'
      }
    ]
  },
  {
    id: '10',
    name: 'Universal Studios Hollywood',
    cover:  require('@/assets/imgs/p101.jpg'),
    category: 'Theme Park',
    price: 109,
    originalPrice: 139,
    sold: '42K',
    address: '100 Universal City Plaza, Universal City, CA',
    navigation: 'Subway Red line to Universal City station',
    duration: 'All day',
    description: 'Experience the magic of Hollywood movies, with thrilling roller coasters and movie-themed attractions',
    gallery: [
       require('@/assets/imgs/p102.jpg'),
       require('@/assets/imgs/p103.jpg')
    ],
    map: require('@/assets/maps/map10.png'),
    services: [
      { icon: 'Ride', text: 'Thrilling Roller Coaster', color: '#409EFF' },
      { icon: 'Cinema', text: 'Movie-themed Attractions', color: '#F56C6C' }
    ],
    reviews: [
      {
        user: 'Movie Fan',
        avatar: 'https://example.com/avatars/10.png',
        rating: 4.7,
        date: '2024-08-15',
        content: 'An immersive experience in the world of movies, every attraction is full of surprises.'
      }
    ]
  },
  {
    id: '11',
    name: 'Pyramids of Giza, Egypt',
    cover:  require('@/assets/imgs/p111.jpg'),
    category: 'Historical Landmark',
    price: 200,
    originalPrice: 250,
    sold: '16K',
    address: 'Al Haram, Giza Governorate, Egypt',
    navigation: 'Take a taxi to the pyramid area',
    duration: '2-3 hours',
    description: 'One of the symbols of ancient Egyptian civilization, featuring the Great Pyramids and the Sphinx',
    gallery: [
       require('@/assets/imgs/p112.jpg'),
       require('@/assets/imgs/p113.jpg')
    ],
    map: require('@/assets/maps/map11.png'),
    services: [
      { icon: 'Pyramid', text: 'Historical Landmark', color: '#67C23A' },
      { icon: 'Camel', text: 'Camel Tour', color: '#F56C6C' }
    ],
    reviews: [
      {
        user: 'History Explorer',
        avatar: 'https://example.com/avatars/11.png',
        rating: 4.8,
        date: '2024-08-18',
        content: 'Standing in front of the pyramids gives you a real sense of the greatness of ancient civilization, and the camel tour is very fun.'
      }
    ]
  },
  {
    id: '12',
    name: 'Niagara Falls',
    cover:  require('@/assets/imgs/p121.jpg'),
    category: 'Natural Scenery',
    price: 25,
    originalPrice: 35,
    sold: '29K',
    address: 'Niagara Falls, ON, Canada',
    navigation: 'Walk to the falls viewing platform',
    duration: '2 hours',
    description: 'One of the most famous waterfalls in North America, experience the immense power of the water flow',
    gallery: [
       require('@/assets/imgs/p122.jpg'),
       require('@/assets/imgs/p123.jpg')
    ],
    map: require('@/assets/maps/map12.png'),
    services: [
      { icon: 'Waterfall', text: 'Waterfall Viewing', color: '#67C23A' },
      { icon: 'Boat', text: 'Boat Experience', color: '#F56C6C' }
    ],
    reviews: [
      {
        user: 'Nature Lover',
        avatar: 'https://example.com/avatars/12.png',
        rating: 4.9,
        date: '2024-08-25',
        content: 'The power of the waterfall is overwhelming, and the boat experience is truly thrilling.'
      }
    ]
  },
  {
    id: '13',
    name: 'Ubud Palace, Bali',
    cover:  require('@/assets/imgs/p131.jpg'),
    category: 'Historical Landmark',
    price: 8,
    originalPrice: 12,
    sold: '37K',
    address: 'Jl. Raya Ubud No.8, Bali',
    description: 'The cultural center of Bali, enjoy traditional art and dance performances',
    gallery: [
       require('@/assets/imgs/p132.jpg'),
       require('@/assets/imgs/p133.jpg')
    ],
    map: require('@/assets/maps/map13.png'),
    services: [
      { icon: 'Cultural', text: 'Cultural Heritage', color: '#67C23A' },
      { icon: 'Dance', text: 'Traditional Dance', color: '#F56C6C' }
    ],
    reviews: [
      {
        user: 'Cultural Explorer',
        avatar: 'https://example.com/avatars/13.png',
        rating: 4.7,
        date: '2024-09-05',
        content: 'The artistic atmosphere in the palace is very strong, and the dance performances are captivating.'
      }
    ]
  },
  {
    id: '14',
    name: 'LEGO Land Denmark',
    cover:  require('@/assets/imgs/p141.jpg'),
    category: 'Theme Park',
    price: 385,
    originalPrice: 450,
    sold: '24K',
    address: 'Nordmarksvej 9, 7190 Billund',
    navigation: 'Take a bus from Billund station',
    duration: 'All day',
    description: 'A park suitable for family visitors, with a rich array of LEGO brick models and entertainment facilities',
    gallery: [
       require('@/assets/imgs/p142.jpg'),
       require('@/assets/imgs/p143.jpg')
    ],
    map: require('@/assets/maps/map14.png'),
    services: [
      { icon: 'Playground', text: 'Children\'s Play Area', color: '#67C23A' },
      { icon: 'Construction', text: 'LEGO Building Experience', color: '#F56C6C' }
    ],
    reviews: [
      {
        user: 'Family Visitor',
        avatar: 'https://example.com/avatars/14.png',
        rating: 4.6,
        date: '2024-09-12',
        content: 'The kids loved it here, and the LEGO building area is the most popular activity!'
      }
    ]
  },
  {
    id: '15',
    name: 'Santorini Island',
    cover:  require('@/assets/imgs/p151.jpg'),
    category: 'Natural Scenery',
    price: 120,
    originalPrice: 1500,
    sold: '45K',
    address: 'Santorini, Cyclades, Greece',
    description: 'Famous for its unique white buildings, turquoise waters, and romantic sunsets, it is a vacation and honeymoon destination',
    gallery: [
       require('@/assets/imgs/p152.jpg'),
       require('@/assets/imgs/p153.jpg')
    ],
    map: require('@/assets/maps/map15.png'),
    services: [
      { icon: 'Beach', text: 'Beach Resort', color: '#67C23A' },
      { icon: 'Sunset', text: 'Sunset Viewing', color: '#F56C6C' }
    ],
    reviews: [
      {
        user: 'Vacationer',
        avatar: 'https://example.com/avatars/15.png',
        rating: 4.9,
        date: '2024-09-20',
        content: 'The sunset in Santorini is indescribably beautiful, it is the most romantic place I have ever seen!'
      }
    ]
  }
];



const route = useRoute()
const attraction = ref({})

// 获取景点数据
attraction.value = attractionsData.find(
  item => item.id === route.params.id
) || {}

// 预订表单
const bookingForm = ref({
  date: '',
  time: '',
  people: 1,
  phone: ''
})

// 禁用过去日期
const disabledDate = (date) => {
  return date < new Date().setHours(0,0,0,0)
}

// 计算总价
const calculateTotalPrice = computed(() => {
  return attraction.value.price * bookingForm.value.people
})

// const handleBooking = () => {
//   // 处理预订逻辑
//   console.log('提交预订:', bookingForm.value)
// }
</script>

<style scoped lang="scss">
.attraction-detail {
  margin-left: 5%;
  .header-bg {
    height: 400px;
    background-size: cover;
    background-position: center;
    position: relative;
    
    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      color: white;
      
      .title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      }
      
      .meta-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .tags {
          display: flex;
          gap: 0.8rem;
        }
        
        .price {
          font-size: 1.8rem;
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          .currency {
            font-size: 1.2rem;
            vertical-align: super;
          }
          .unit {
            font-size: 1rem;
            margin-left: 0.5rem;
          }
        }
      }
    }
  }

  .gallery-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 4px;
  }

  .content-section {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #ebeef5;

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #2c9442;
      margin-bottom: 1.5rem;
      font-size: 1.3rem;
    }
    
    .text-content {
      line-height: 1.8;
      color: #666;
      font-size: 15px;
    }

    .service-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 1.5rem;
      
      .service-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    }

    .map-container {
      position: relative;
      .map-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
      }
      .location-info {
        margin-top: 1rem;
        p {
          margin: 0.5rem 0;
          font-size: 14px;
          color: #666;
        }
      }
    }

    .reviews {
      .review-item {
        display: flex;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid #eee;
        
        .review-content {
          flex: 1;
          .review-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
            
            .user-name {
              font-weight: 500;
            }
            .review-date {
              color: #999;
              font-size: 0.9rem;
            }
          }
          .review-text {
            color: #666;
            line-height: 1.6;
          }
        }
      }
    }
  }

  .booking-card {
    position: sticky;
    top: 1rem;
    
    .booking-title {
      text-align: center;
      color: #2c9442;
      margin-bottom: 1.5rem;
      font-size: 1.4rem;
    }
    
    .price-detail {
      width: 100%;
      .price-item {
        display: flex;
        justify-content: space-between;
        margin: 0.5rem 0;
        color: #666;
        
        &.total {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px dashed #eee;
          .price-number {
            color: #e6a23c;
            font-weight: bold;
            font-size: 1.4rem;
          }
        }
      }
    }
    
    .booking-btn {
      height: 50px;
      font-size: 1.1rem;
    }
    
    .booking-tips {
      margin-top: 1rem;
      padding: 0.8rem;
      background: #fdf6ec;
      color: #e6a23c;
      border-radius: 4px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .service-card {
    .customer-service {
      display: flex;
      gap: 1rem;
      align-items: center;
      
      .service-icon {
        font-size: 2.5rem;
        color: #409EFF;
      }
      
      .service-info {
        h4 {
          margin: 0;
          color: #333;
        }
        p {
          margin: 0.3rem 0;
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .header-bg .overlay .title {
    font-size: 1.8rem;
  }
  
  .meta-info .price {
    font-size: 1.2rem;
  }
  
  .service-list {
    grid-template-columns: 1fr !important;
  }
}
</style>