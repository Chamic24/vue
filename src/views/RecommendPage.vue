<template>
  <div class="recommend-page">
    <!-- Filter Bar -->
    <div class="container-fluid py-4 bg-light">
      <div class="container d-flex justify-content-between align-items-center">
        <h3 class="mb-0">Featured Recommendations</h3>
        <div class="d-flex gap-3">
          <span class="me-2 text-muted">
            <i class="el-icon-menu"></i>
            Filter:
          </span>
          <el-select v-model="selectedCategory" placeholder="Category" clearable style="width: 300px">
            <el-option label="Natural Scenery" value="nature" />
            <el-option label="Historical and Cultural" value="history" />
            <el-option label="Theme Parks" value="park" />
          </el-select>
          <span class="me-2 text-muted">
            <i class="el-icon-sort"></i>
            Sort by:
          </span>
          <el-select v-model="sortBy" placeholder="Sort">
            <el-option label="Price Low to High" value="price-asc" />
            <el-option label="Price High to Low" value="price-desc" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- Attraction List -->
    <div class="container py-5">
      <div class="row g-4">
        <div 
          v-for="(attraction, index) in filteredAttractions" 
          :key="index" 
          class="col-md-6 col-lg-4"
        >
          <el-card 
            shadow="hover" 
            class="h-100 attraction-card"
            :body-style="{ padding: '0' }"
          >
            <div class="image-wrapper">
              <img 
                :src="attraction.image" 
                class="card-image"
                :alt="attraction.name"
              >
              <div class="image-overlay">
                <el-tag 
                  v-for="(tag, tagIndex) in attraction.tags" 
                  :key="tagIndex"
                  type="info"
                  class="me-2"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            
            <div class="p-3">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h4 class="mb-0">{{ attraction.name }}</h4>
                <el-rate 
                  v-model="attraction.rating" 
                  disabled 
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']" 
                />
              </div>
              
              <p class="text-muted description">{{ attraction.description }}</p>
              
              <div class="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span class="text-danger fs-4 fw-bold">${{ attraction.price }}</span>
                  <span class="text-muted ms-2 text-decoration-line-through">${{ attraction.originalPrice }}</span>
                </div>
                <el-button 
                  type="primary" 
                  @click="goToDetail(attraction.id)"
                  class="px-4"
                >
                  Book Now
                </el-button>
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
import { useRouter } from 'vue-router'

const router = useRouter()

// Filter conditions
const selectedCategory = ref('')
const sortBy = ref('')

// Attraction Data
const attractions = ref([
{ 
  id: 1,
  name: 'Eiffel Tower', 
  price: 28,
  originalPrice: 35,
  image: require('@/assets/imgs/p11.jpg'),
  description: 'A landmark in Paris, symbolizing the romantic city, offering panoramic views of Paris from the top',
  rating: 4.9,
  tags: ['City Landmark', 'Viewing Platform'],
  category: 'history'
},
{
  id: 2,
  name: 'Grand Canyon National Park',
  price: 40,
  originalPrice: 50,
  image: require('@/assets/imgs/p21.jpg'),
  description: 'One of the Seven Natural Wonders of the World, a majestic red rock canyon',
  rating: 4.8,
  tags: ['Natural Wonder', 'Hiking Destination'],
  category: 'nature'
},
{
  id: 3,
  name: 'Colosseum, Rome',
  price: 18,
  originalPrice: 24,
  image: require('@/assets/imgs/p31.jpg'),
  description: 'A symbol of Ancient Roman civilization, experience the history of gladiators',
  rating: 4.7,
  tags: ['World Heritage', 'Historical Site'],
  category: 'history'
},
{
  id: 4,
  name: 'Tokyo Disneyland',
  price: 8200,
  originalPrice: 9400,
  image: require('@/assets/imgs/p41.jpg'),
  description: 'Asia\'s first Disney park, a magical fairytale kingdom',
  rating: 4.9,
  tags: ['Theme Park', 'Family Trip'],
  category: 'park'
},
{
  id: 5,
  name: 'Maldives Veligandu Island',
  price: 4500,
  originalPrice: 6000,
  image: require('@/assets/imgs/p51.jpg'),
  description: 'A pearl in the Indian Ocean, experience water villas and crystal-clear lagoons',
  rating: 4.9,
  tags: ['Honeymoon Destination', 'Diving Paradise'],
  category: 'nature'
},
{
  id: 6,
  name: 'Statue of Liberty, New York',
  price: 24,
  originalPrice: 30,
  image: require('@/assets/imgs/p61.jpg'),
  description: 'A symbol of America, visit the pedestal museum and observation deck',
  rating: 4.6,
  tags: ['National Monument', 'Harbor View'],
  category: 'history'
},
{
  id: 7,
  name: 'Jungfraujoch, Switzerland',
  price: 210,
  originalPrice: 260,
  image: require('@/assets/imgs/p71.jpg'),
  description: 'The Queen of the Alps, the highest railway access point in Europe',
  rating: 4.8,
  tags: ['Snowy Mountain Views', 'Mountain Train'],
  category: 'nature'
},
{
  id: 8,
  name: 'Burj Khalifa, Dubai',
  price: 149,
  originalPrice: 199,
  image: require('@/assets/imgs/p81.jpg'),
  description: 'The world\'s tallest building, with an observation deck offering stunning views of the city',
  rating: 4.7,
  tags: ['Modern Wonder', 'City Skyline'],
  category: 'history'
},
{
  id: 9,
  name: 'Great Barrier Reef, Australia',
  price: 350,
  originalPrice: 450,
  image: require('@/assets/imgs/p91.jpg'),
  description: 'The largest coral reef system in the world, dive to explore the underwater world',
  rating: 4.8,
  tags: ['Natural Heritage', 'Marine Ecosystem'],
  category: 'nature'
},
{
  id: 10,
  name: 'Universal Studios Hollywood',
  price: 109,
  originalPrice: 139,
  image: require('@/assets/imgs/p101.jpg'),
  description: 'A movie-themed park, experience Hollywood blockbuster scenes',
  rating: 4.7,
  tags: ['Movie Theme', 'Roller Coaster'],
  category: 'park'
},
{
  id: 11,
  name: 'Pyramids of Giza, Egypt',
  price: 200,
  originalPrice: 250,
  image: require('@/assets/imgs/p111.jpg'),
  description: 'The only remaining wonder of the ancient world\'s seven wonders',
  rating: 4.7,
  tags: ['Archaeological Wonder', 'Desert Landscape'],
  category: 'history'
},
{
  id: 12,
  name: 'Niagara Falls',
  price: 25,
  originalPrice: 35,
  image: require('@/assets/imgs/p121.jpg'),
  description: 'One of the three largest waterfalls in the world, take a boat to experience the power of the falls up close',
  rating: 4.8,
  tags: ['Cross-border Waterfall', 'Natural Wonder'],
  category: 'nature'
},
{
  id: 13,
  name: 'Ubud Palace, Bali',
  price: 8,
  originalPrice: 12,
  image: require('@/assets/imgs/p131.jpg'),
  description: 'A perfect blend of traditional Balinese architecture and tropical gardens',
  rating: 4.5,
  tags: ['Royal Palace', 'Cultural Experience'],
  category: 'history'
},
{
  id: 14,
  name: 'Legoland Denmark',
  price: 385,
  originalPrice: 450,
  image: require('@/assets/imgs/p141.jpg'),
  description: 'The first Legoland theme park in the world, a top choice for family fun',
  rating: 4.6,
  tags: ['Brick World', 'Children\'s Park'],
  category: 'park'
},
{
  id: 15,
  name: 'Santorini Island',
  price: 1200,
  originalPrice: 1500,
  image: require('@/assets/imgs/p151.jpg'),
  description: 'The pearl of the Aegean Sea, known for its blue-domed churches and stunning sunsets',
  rating: 4.9,
  tags: ['Romantic Island', 'Cliffside Hotels'],
  category: 'nature'
}
])

// Filter and Sort Logic
const filteredAttractions = computed(() => {
  let result = [...attractions.value]
  
  if (selectedCategory.value) {
    result = result.filter(item => item.category === selectedCategory.value)
  }
  
  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  }
  
  return result
})

const goToDetail = (id) => {
  router.push(`/attraction/${id}`)
}
</script>

<style scoped>
.recommend-page {
  background: #f8f9fa;
  min-height: 100vh;
  width: 100%;
}

.attraction-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;
  overflow: hidden;
}

.attraction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.image-wrapper {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-overlay {
  position: absolute;
  top: 15px;
  left: 15px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-wrapper:hover .card-image {
  transform: scale(1.05);
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3em;
}

.el-rate {
  margin-top: 2px;
}
/* 添加图标样式 */
.el-icon-view {
  color: #409EFF;
  font-size: 1.2rem;
  margin-right: 8px;
  vertical-align: middle;
}

.el-icon-menu,
.el-icon-sort {
  color: #666;
  font-size: 1.1rem;
  vertical-align: middle;
  margin-right: 4px;
}

/* 调整说明文字样式 */
.text-muted {
  font-size: 0.9rem;
  white-space: nowrap;
}

/* 保持原有布局 */
.bg-light {
  background-color: #f8f9fa!important;
}
</style>
