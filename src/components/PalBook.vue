<template>
  <!-- Payment Modal -->
  <el-dialog
    v-model="dialogVisible"
    :title="paymentTitle"
    width="35%"
    :before-close="handleClose"
    class="payment-dialog"
  >
    <div class="price-display">
      <span class="price-label">Total Amount Due:</span>
      <span class="price-value">¥ {{ totalPrice }}</span>
    </div>

    <el-tabs v-model="activePayment" stretch class="payment-tabs">
      <el-tab-pane label="QR Code Payment" name="qrcode">
        <div class="qrcode-container">
          <div class="qrcode-card" :class="{ 'scanned': qrScanned }">
            <transition name="el-fade-in">
              <div v-if="!qrScanned" class="qrcode-wrapper">
                <img 
                  src="@/assets/imgs/qr.png"
                  alt="Payment QR Code"
                  class="qrcode-img"
                >
                <div class="scan-tip">
                  <el-icon class="scan-icon"><Camera /></el-icon>
                  <span>Open your phone to scan</span>
                </div>
              </div>
              <div v-else class="scan-success">
                <el-icon class="success-icon"><Select /></el-icon>
                <div class="success-text">
                  <h4>Scan Successful</h4>
                  <p>Please confirm payment on your phone</p>
                </div>
              </div>
            </transition>
          </div>
          <div class="payment-steps">
            <el-steps :active="qrScanned ? 2 : 1" simple>
              <el-step title="Scan" icon="Camera" />
              <el-step title="Confirm" icon="Select" />
              <el-step title="Complete" icon="CircleCheck" />
            </el-steps>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Bank Card" name="bank">
        <div class="bank-card-form">
          <el-form label-position="top">
            <el-form-item label="Card Number">
              <el-input 
                placeholder="Enter your bank card number"
                v-model="cardInfo.number"
                class="card-input"
              >
                <template #prefix>
                  <el-icon class="input-icon"><CreditCard /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <div class="row">
              <el-form-item label="Expiration Date" class="half-item">
                <el-input
                  placeholder="MM/YY"
                  v-model="cardInfo.expiry"
                />
              </el-form-item>
              <el-form-item label="CVV" class="half-item">
                <el-input
                  placeholder="123"
                  v-model="cardInfo.cvv"
                  show-password
                />
              </el-form-item>
            </div>

            <el-button type="primary" class="pay-button" @click="handleBankPay">
              Pay Now ¥{{ totalPrice }}
            </el-button>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Alipay" name="alipay">
        <div class="alipay-container">
          <div class="alipay-logo">
            <img src="https://cdn.jsdelivr.net/gh/duochizhacai/generate-robot/asset/alipay-logo.png" alt="Alipay">
          </div>
          <el-button 
            type="primary" 
            class="alipay-button"
            @click="handleAlipay"
          >
            <el-icon class="alipay-icon"><Alipay /></el-icon>
            Pay Now ¥{{ totalPrice }}
          </el-button>
          <p class="alipay-tip">You will be redirected to Alipay to complete payment</p>
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="dialog-footer">
        <span class="security-tip">
          <el-icon><Lock /></el-icon>
          Secure Payment Guarantee
        </span>
        <el-button @click="dialogVisible = false">Cancel Payment</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- Payment Success Prompt -->
  <el-dialog
    v-model="successVisible"
    title="Payment Successful"
    width="380px"
    center
    :show-close="false"
  >
    <div class="success-container">
      <el-icon class="success-icon" :size="60"><CircleCheckFilled /></el-icon>
      <h3 class="success-title">Payment Successful!</h3>
      <p class="success-amount">Amount Paid: ¥{{ totalPrice }}</p>
      <div class="success-countdown">
        <el-progress
          type="circle"
          :percentage="countdownPercent"
          :width="60"
          :show-text="false"
          status="success"
        />
        <span class="countdown-text">{{ countdown }} seconds until the dialog closes automatically</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, watch ,defineExpose} from 'vue'
import { 
  CircleCheckFilled, 
  Select, 
  Camera, 
  CreditCard, 
  Lock,
  Alipay
} from '@element-plus/icons-vue'

defineProps({
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  }
})

const dialogVisible = ref(false)
const successVisible = ref(false)
const activePayment = ref('qrcode')
const qrScanned = ref(false)
const countdown = ref(5)
const countdownPercent = ref(100)
const paymentTitle = ref('Select Payment Method')

const cardInfo = ref({
  number: '',
  expiry: '',
  cvv: ''
})

// Countdown timer for success dialog
watch(successVisible, (val) => {
  if(val) {
    const timer = setInterval(() => {
      countdown.value--
      countdownPercent.value = (countdown.value / 5) * 100
      if(countdown.value <= 0) {
        clearInterval(timer)
        successVisible.value = false
      }
    }, 1000)
  }
})

const showPaymentDialog = () => {
  dialogVisible.value = true
  resetState()
  
  // Simulate QR code scan process
  setTimeout(() => qrScanned.value = true, 3000)
  setTimeout(() => {
    dialogVisible.value = false
    successVisible.value = true
  }, 8000)
}

const handleBankPay = () => {
  dialogVisible.value = false
  successVisible.value = true
}

const handleAlipay = () => {
  dialogVisible.value = false
  successVisible.value = true
}

const resetState = () => {
  qrScanned.value = false
  countdown.value = 5
  countdownPercent.value = 100
  activePayment.value = 'qrcode'
}

const open = () => showPaymentDialog()

defineExpose({ open })
</script>

<style scoped>
.price-display {
  text-align: center;
  margin-bottom: 24px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.price-label {
  font-size: 16px;
  color: #606266;
}

.price-value {
  font-size: 24px;
  color: #e6a23c;
  font-weight: bold;
  margin-left: 8px;
}

.qrcode-card {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 20px;
  margin: 0 auto;
  width: 280px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.qrcode-card.scanned {
  border-color: #67c23a;
  background: #f6ffed;
}

.qrcode-wrapper {
  position: relative;
}

.qrcode-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.scan-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  color: #909399;
}

.scan-icon {
  margin-right: 8px;
  font-size: 18px;
}

.scan-success {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  margin-bottom: 12px;
}

.success-text h4 {
  margin: 8px 0;
  color: #67c23a;
}

.success-text p {
  color: #909399;
  font-size: 13px;
}

.payment-steps {
  margin-top: 24px;
}

.bank-card-form {
  padding: 0 20px;
}

.card-input :deep(.el-input__inner) {
  padding-left: 40px;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  font-size: 18px;
}

.row {
  display: flex;
  gap: 16px;
}

.half-item {
  flex: 1;
}

.pay-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  margin-top: 20px;
}

.alipay-container {
  text-align: center;
  padding: 20px;
}

.alipay-logo img {
  width: 120px;
  margin-bottom: 24px;
}

.alipay-button {
  width: 100%;
  height: 48px;
  background: #1677ff;
  border-color: #1677ff;
}

.alipay-button:hover {
  background: #409eff;
}

.alipay-icon {
  font-size: 20px;
  margin-right: 8px;
}

.alipay-tip {
  color: #909399;
  font-size: 13px;
  margin-top: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.security-tip {
  color: #909399;
  font-size: 13px;
}

.security-tip .el-icon {
  margin-right: 4px;
}

.success-container {
  text-align: center;
  padding: 20px;
}

.success-title {
  color: #67c23a;
  margin: 12px 0;
}

.success-amount {
  color: #606266;
  font-size: 16px;
}

.success-countdown {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.countdown-text {
  color: #909399;
  font-size: 14px;
}
</style>
