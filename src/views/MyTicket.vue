<template>
  <div class="my-tickets-container">
    <div class="container-fluid pt-3">
      <!-- Title Area -->
      <div class="page-header mb-4 px-md-4">
        <h2 class="page-title">My Tickets</h2>
        <div class="divider"></div>
      </div>

      <!-- Ticket List -->
      <div v-if="tickets.length" class="row g-3 px-md-3">
        <div 
          v-for="ticket in tickets" 
          :key="ticket.id"
          class="col-12 col-md-6 col-xl-4"
        >
          <el-card class="ticket-card h-100">
            <div class="card-content">
              <!-- Card Header -->
              <div class="card-header">
                <div class="cover-image" :style="{ backgroundImage: `url(${ticket.cover})` }"></div>
                <div class="header-content">
                  <h5 class="attraction-name text-truncate">
                    {{ ticket.attractionName }}
                  </h5>
                  <el-tag 
                    :type="statusType(ticket.status)"
                    size="small"
                    class="status-tag"
                    effect="dark"
                  >
                    {{ ticket.status }}
                  </el-tag>
                </div>
              </div>

              <!-- Ticket Details -->
              <div class="ticket-details">
                <div class="detail-item">
                  <el-icon class="detail-icon"><Calendar /></el-icon>
                  <div class="detail-content">
                    <span class="detail-label">Travel Date</span>
                    <span class="detail-text">{{ ticket.date }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <el-icon class="detail-icon"><User /></el-icon>
                  <div class="detail-content">
                    <span class="detail-label">Number of People</span>
                    <span class="detail-text">{{ ticket.people }} people</span>
                  </div>
                </div>
                <div class="detail-item">
                  <el-icon class="detail-icon"><Ticket /></el-icon>
                  <div class="detail-content">
                    <span class="detail-label">Order Number</span>
                    <span class="detail-text text-muted">{{ ticket.orderId }}</span>
                  </div>
                </div>
                <div class="price-section">
                  <span class="total-label">Total Order Amount:</span>
                  <span class="detail-price">${{ ticket.totalPrice }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="card-actions">
                <el-button 
                  v-if="ticket.status === 'Pending Payment'"
                  type="primary"
                  size="small"
                  class="action-btn"
                  @click="handlePayment(ticket)"
                >
                  <el-icon class="mr-1"><Wallet /></el-icon>
                  Pay Now
                </el-button>
                <el-button 
                  v-if="ticket.status !== 'Cancelled'"
                  size="small"
                  class="action-btn"
                  :disabled="ticket.status === 'Cancelled'"
                  @click="openCancelDialog(ticket)"
                >
                  <el-icon class="mr-1"><Close /></el-icon>
                  Cancel Order
                </el-button>
                <el-button 
                  v-if="ticket.status === 'Cancelled'"
                  size="small"
                  disabled
                >
                  Cancelled
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- Empty State -->
      <el-empty 
        v-else 
        description="No ticket orders"
        class="empty-state"
        :image-size="200"
      >
        <el-button 
          type="success" 
          size="medium"
          @click="$router.push('/attractions')"
        >
          <el-icon class="mr-1"><Opportunity /></el-icon>
          Explore Attractions
        </el-button>
      </el-empty>

      <!-- Cancellation Confirmation Dialog -->
      <el-dialog
        v-model="cancelDialogVisible"
        title="Cancellation Confirmation"
        width="400px"
      >
        <span>Are you sure you want to cancel the order for 【{{ selectedTicket?.attractionName }}】?</span>
        <template #footer>
          <el-button @click="cancelDialogVisible = false">Cancel</el-button>
          <el-button type="danger" @click="confirmCancel">Confirm</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { 
Calendar,
User,
Ticket,
Wallet,
Close,
Opportunity
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const cancelDialogVisible = ref(false)
const selectedTicket = ref(null)

// Simulated Ticket Data
const tickets = ref([
{
  id: 1,
  attractionName: 'Eiffel Tower',
  cover: require("@/assets/imgs/p11.jpg"),
  date: '2025-03-20',
  people: 2,
  totalPrice: 56,
  orderId: 'ORD20240520001',
  status: 'Paid'
},
{
  id: 4,
  attractionName: 'Santorini Island',
  cover: require("@/assets/imgs/p152.jpg"),
  date: '2025-03-22',
  people: 3,
  totalPrice: 360,
  orderId: 'ORD20240520088',
  status: 'Paid'
},
{
  id: 2,
  attractionName: 'Forest Adventure Park',
  cover: require("@/assets/imgs/banner1.jpeg"),
  date: '2025-02-22',
  people: 3,
  totalPrice: 360,
  orderId: 'ORD20240520002',
  status: 'Pending Payment'
},
{
  id: 3,
  attractionName: 'Water World',
  cover: require("@/assets/imgs/p91.jpg"),
  date: '2025-01-25',
  people: 4,
  totalPrice: 480,
  orderId: 'ORD20240520003',
  status: 'Cancelled'
}
])

// Status Tag Type Mapping
const statusType = (status) => {
const types = {
  'Paid': 'success',
  'Pending Payment': 'warning',
  'Cancelled': 'danger'
}
return types[status] || ''
}

const openCancelDialog = (ticket) => {
selectedTicket.value = ticket
cancelDialogVisible.value = true
}

const confirmCancel = () => {
tickets.value = tickets.value.map(ticket => {
  if (ticket.id === selectedTicket.value.id) {
    return { ...ticket, status: 'Cancelled' }
  }
  return ticket
})
cancelDialogVisible.value = false
ElMessage.success('Order has been cancelled')
}

const handlePayment = (ticket) => {
console.log('Redirecting to payment page', ticket)
}
</script>
  
  <style scoped lang="scss">
  .my-tickets-container {
    width: 100%;
    padding: 30px;
    min-height: 100vh;
    background-color: #f8fafc;
    transition: margin-left 0.3s;
  
    .page-header {
      .page-title {
        font-size: 1.8rem;
        color: #1a1a1a;
        font-weight: 600;
        letter-spacing: 1px;
      }
  
      .divider {
        height: 3px;
        background: linear-gradient(90deg, #409eff 30%, transparent 70%);
        margin-top: 1rem;
        width: 120px;
      }
    }
  
    .ticket-card {
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.08);
      }
  
      .card-content {
        padding: 0;
  
        .card-header {
          position: relative;
          .cover-image {
            height: 160px;
            background-size: cover;
            background-position: center;
            position: relative;
            &::after {
              content: "";
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 60px;
              background: linear-gradient(transparent, rgba(0,0,0,0.6));
            }
          }
          .header-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
  
            .attraction-name {
              font-size: 1.2rem;
              color: white;
              margin: 0;
              max-width: 70%;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .status-tag {
              font-weight: bold;
              letter-spacing: 1px;
            }
          }
        }
  
        .ticket-details {
          padding: 20px;
  
          .detail-item {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            padding: 8px 0;
  
            .detail-icon {
              font-size: 1.4rem;
              color: #409eff;
              margin-right: 12px;
              width: 32px;
              height: 32px;
              border-radius: 6px;
              background: rgba(64,158,255,0.1);
              display: flex;
              align-items: center;
              justify-content: center;
            }
  
            .detail-content {
              flex: 1;
              .detail-label {
                display: block;
                font-size: 0.9rem;
                color: #909399;
                margin-bottom: 2px;
              }
              .detail-text {
                font-size: 1rem;
                color: #303133;
                font-weight: 500;
              }
            }
          }
  
          .price-section {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px dashed #ebeef5;
            display: flex;
            justify-content: space-between;
            align-items: center;
  
            .total-label {
              font-size: 0.95rem;
              color: #606266;
            }
            .detail-price {
              font-size: 1.4rem;
              color: #e6a23c;
              font-weight: 700;
            }
          }
        }
  
        .card-actions {
          padding: 15px 20px;
          background: #f8fafc;
          border-top: 1px solid #ebeef5;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
  
          .action-btn {
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
        }
      }
    }
  
    .empty-state {
      margin-top: 100px;
      ::v-deep .el-empty__description {
        p {
          color: #909399;
          font-size: 1.1rem;
          margin: 20px 0;
        }
      }
    }
  }
  
  @media (max-width: 1200px) {
    .my-tickets-container {
      margin-left: 0;
      padding: 20px;
    }
  }
  
  @media (max-width: 768px) {
    .ticket-card {
      margin-bottom: 1.5rem;
      
      .card-content {
        .card-header {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            
            .attraction-name {
              max-width: 100%;
              margin-bottom: 8px;
            }
          }
        }
      }
    }
  }
  </style>