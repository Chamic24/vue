<template>
  <div class="main-content">
    <el-carousel height="400px" class="main-carousel" :interval="5000">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <div class="carousel-content" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="carousel-overlay">
            <h2 class="text-white">{{ item.title }}</h2>
            <p class="text-light">{{ item.description }}</p>
            <button class="btn btn-lg btn-primary mt-3" @click="goToDetail(item.id)">Book Now</button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div class="container mt-5">
      <h4 class="mb-4">Popular Attractions</h4>
      <div class="row g-4">
        <div v-for="(attraction, index) in attractions" :key="index" class="col-md-4 col-lg-3">
          <el-card shadow="hover" class="attraction-card">
            <img :src="attraction.image" class="card-image">
            <div class="p-3">
              <h5 class="card-title">{{ attraction.name }}</h5>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="text-primary fw-bold">${{ attraction.price }}</span>
                <button class="btn btn-sm btn-primary" @click="goToDetail(attraction.id)">Book</button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const carouselItems = ref([
  {
    id: 2,
    image: require('@/assets/imgs/banner1.jpeg'),
    title: 'Explore Majestic Mountains',
    description: 'Book your mountain adventure trip'
  },
  {
    id: 5,
    image: require('@/assets/imgs/bannerbech.jpg'),
    title: 'Tropical Beach Resort',
    description: 'Enjoy the sun, sand, and waves'
  },
  {
    id: 8,
    image: require('@/assets/imgs/bannercity.jpg'),
    title: 'City Sightseeing',
    description: 'Discover urban wonders'
  }
])

const attractions = ref([
  { id:4,name: 'Tokyo Disneyland', price: 820, image: require('@/assets/imgs/p42.jpg') },
  { id:8,name: 'Burj Khalifa, Dubai', price: 149, image: require('@/assets/imgs/p82.jpg') },
  { id:15,name: 'Santorini Island', price: 120, image: require('@/assets/imgs/p152.jpg') },
  { id:13,name: 'Ubud Palace, Bali', price: 8, image: require('@/assets/imgs/p132.jpg') }
])

const goToDetail = (id) => {
  console.log("ssss",id)
  router.push(`/attraction/${id}`)
}
</script>

<style scoped>
.main-content {
  flex: 1;
  background: #f8f9fa;
  padding: 20px;
}

.carousel-content {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 8px;
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  border-radius: 8px;
}

.attraction-card {
  transition: transform 0.3s;
  border: none;
}

.attraction-card:hover {
  transform: translateY(-5px);
}

.card-image {
  height: 180px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}
</style>
