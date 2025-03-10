<template>
  <div class="settings-page">
    <div class="container py-5">
      <div class="row">
        <!-- Sidebar Navigation -->
        <div class="col-md-3">
          <el-menu
            default-active="1"
            class="settings-menu rounded-3 shadow-sm"
            @select="handleMenuSelect"
          >
            <el-menu-item index="1">
              <i class="el-icon-user me-2"></i>
              Personal Information
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-lock me-2"></i>
              Security Settings
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-notebook-2 me-2"></i>
              Privacy Settings
            </el-menu-item>
          </el-menu>
        </div>

        <!-- Main Content -->
        <div class="col-md-9">
          <!-- Personal Information -->
          <div v-show="activeTab === '1'" class="settings-card shadow-sm">
            <h4 class="mb-4"><i class="el-icon-user me-2"></i>Personal Information</h4>
            
            <el-form :model="userForm" label-width="100px">
              <!-- Avatar Upload -->
              <el-form-item label="Avatar">
                <el-upload
                  class="avatar-uploader"
                  action="/api/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                >
                  <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>

              <!-- Basic Information -->
              <el-form-item label="Nickname" prop="nickname">
                <el-input v-model="userForm.nickname" placeholder="Enter your nickname" />
              </el-form-item>

              <el-form-item label="Gender">
                <el-radio-group v-model="userForm.gender">
                  <el-radio label="male">Male</el-radio>
                  <el-radio label="female">Female</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Birthdate">
                <el-date-picker
                  v-model="userForm.birthday"
                  type="date"
                  placeholder="Select Date"
                />
              </el-form-item>

              <el-form-item label="Location">
                <el-cascader
                  v-model="userForm.region"
                  :options="regionOptions"
                  placeholder="Select Location"
                />
              </el-form-item>

              <el-form-item label="Bio">
                <el-input
                  v-model="userForm.bio"
                  type="textarea"
                  :rows="3"
                  placeholder="Introduce yourself~"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitUserInfo">Save Changes</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- Security Settings -->
          <div v-show="activeTab === '2'" class="settings-card shadow-sm">
            <h4 class="mb-4"><i class="el-icon-lock me-2"></i>Security Settings</h4>
            
            <el-form :model="securityForm" label-width="120px">
              <el-form-item label="Old Password">
                <el-input
                  v-model="securityForm.oldPassword"
                  type="password"
                  show-password
                  placeholder="Enter current password"
                />
              </el-form-item>

              <el-form-item label="New Password">
                <el-input
                  v-model="securityForm.newPassword"
                  type="password"
                  show-password
                  placeholder="8-20 character alphanumeric combination"
                />
                <div class="password-strength mt-2">
                  Password Strength: <el-tag :type="passwordStrengthType">{{ passwordStrength }}</el-tag>
                </div>
              </el-form-item>

              <el-form-item label="Confirm Password">
                <el-input
                  v-model="securityForm.confirmPassword"
                  type="password"
                  show-password
                  placeholder="Please re-enter new password"
                />
              </el-form-item>

              <el-divider />

              <el-form-item label="Bind Phone">
                <div class="d-flex align-items-center">
                  <el-input
                    v-model="securityForm.phone"
                    placeholder="Enter phone number"
                    style="width: 200px"
                  />
                  <el-button class="ms-2" :disabled="isCounting" @click="sendSMSCode">
                    {{ isCounting ? `${countdown} seconds remaining` : 'Get Verification Code' }}
                  </el-button>
                </div>
              </el-form-item>

              <el-form-item label="Bind Email">
                <div class="d-flex align-items-center">
                  <el-input
                    v-model="securityForm.email"
                    placeholder="Enter email address"
                    style="width: 200px"
                  />
                  <el-button class="ms-2" :disabled="isCounting" @click="sendEmailCode">
                    {{ isCounting ? `${countdown} seconds remaining` : 'Get Verification Code' }}
                  </el-button>
                </div>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitSecurity">Save Settings</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- Privacy Settings -->
          <div v-show="activeTab === '3'" class="settings-card shadow-sm">
            <h4 class="mb-4"><i class="el-icon-notebook-2 me-2"></i>Privacy Settings</h4>
            
            <div class="privacy-item mb-4">
              <div class="d-flex justify-content-between">
                <div>
                  <h5>Public Profile</h5>
                  <p class="text-muted">Other users can view your basic information</p>
                </div>
                <el-switch v-model="privacySettings.profilePublic" />
              </div>
            </div>

            <div class="privacy-item mb-4">
              <div class="d-flex justify-content-between">
                <div>
                  <h5>Show Travel Activities</h5>
                  <p class="text-muted">Show your trips and reviews in the community</p>
                </div>
                <el-switch v-model="privacySettings.showActivities" />
              </div>
            </div>

            <div class="privacy-item mb-4">
              <div class="d-flex justify-content-between">
                <div>
                  <h5>Allow Private Messages</h5>
                  <p class="text-muted">Receive private messages from other users</p>
                </div>
                <el-switch v-model="privacySettings.allowMessages" />
              </div>
            </div>

            <el-button type="primary" @click="savePrivacy">Save Settings</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, watch } from 'vue'
import { ElMessage } from 'element-plus'
const data = inject('username')
const activeTab = ref('1')

// User Information Form
const userForm = reactive({
  avatar: 'https://picsum.photos/100/100',
  nickname: '',
  gender: 'male',
  birthday: '1990-01-01',
  region: [],
  bio: 'A backpacker who loves travel and adventure'
})
watch(() => data.nickname, (newNickname) => {
  userForm.nickname = newNickname
})

// Security Settings Form
const securityForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  phone: '',
  email: ''
})

// Privacy Settings
const privacySettings = reactive({
  profilePublic: true,
  showActivities: true,
  allowMessages: true
})

// Region Options
const regionOptions = [
  {
    value: 'china',
    label: 'China',
    children: [
      { value: 'beijing', label: 'Beijing' },
      { value: 'shanghai', label: 'Shanghai' },
      { value: 'guangdong', label: 'Guangdong' }
    ]
  }
]

// Password Strength Calculation
const passwordStrength = computed(() => {
  if (securityForm.newPassword.length < 8) return 'Weak'
  if (/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(securityForm.newPassword)) {
    return securityForm.newPassword.length > 12 ? 'Strong' : 'Medium'
  }
  return 'Weak'
})

const passwordStrengthType = computed(() => {
  return {
    Weak: 'danger',
    Medium: 'warning',
    Strong: 'success'
  }[passwordStrength.value]
})

// Verification Code Countdown
const isCounting = ref(false)
const countdown = ref(60)

const startCountdown = () => {
  isCounting.value = true
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      isCounting.value = false
      countdown.value = 60
    }
  }, 1000)
}

const handleAvatarSuccess = (res) => {
  userForm.avatar = res.url
  ElMessage.success('Avatar uploaded successfully')
}

const submitUserInfo = () => {
  ElMessage.success('Personal information updated')
}

const submitSecurity = () => {
  ElMessage.success('Security settings updated')
}

const savePrivacy = () => {
  ElMessage.success('Privacy settings saved')
}

const sendSMSCode = () => {
  startCountdown()
  ElMessage.info('Verification code sent')
}

const sendEmailCode = () => {
  startCountdown()
  ElMessage.info('Verification code sent')
}

const handleMenuSelect = (index) => {
  activeTab.value = index
}
</script>

<style scoped>
.settings-page {
  background: #f8f9fa;
  height: 100vh;
  width: 100%;
}

.settings-menu {
  background: white;
  border-right: none;
}

.settings-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }

  :deep(.el-upload:hover) {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
  }
}

.privacy-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
}

.password-strength {
  font-size: 0.9rem;
  color: #666;
}
</style>
