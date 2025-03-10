<template>
    <el-dialog v-model="visible" class="auth-dialog" title="User Authentication" width="450px" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <template #header>
            <div class="dialog-header">
                <el-icon class="user-icon">
                    <UserFilled />
                </el-icon>
                <h2>Welcome to Travel Ticketing</h2>
            </div>
        </template>

        <el-tabs v-model="activeTab" stretch class="enhanced-tabs">
            <!-- Login Tab -->
            <el-tab-pane label="Login" name="login">
                <div class="form-container">
                    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @submit.prevent="handleLogin">
                        <el-form-item prop="username" class="enhanced-form-item">
                            <el-input v-model="loginForm.username" placeholder="Username/Email" prefix-icon="User"
                                class="custom-input" />
                        </el-form-item>

                        <el-form-item prop="password" class="enhanced-form-item">
                            <el-input v-model="loginForm.password" type="password" placeholder="Password" prefix-icon="Lock"
                                show-password class="custom-input" />
                            <div class="password-tips">At least 6 characters</div>
                        </el-form-item>

                        <div class="d-flex justify-content-between">
                            <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
                            <el-link type="primary">Forgot Password?</el-link>
                        </div>

                        <el-button type="primary" native-type="submit" class="auth-button login-btn" :loading="loading">
                            Login Now
                        </el-button>
                    </el-form>
                </div>
            </el-tab-pane>

            <!-- Register Tab -->
            <el-tab-pane label="Register" name="register">
                <div class="form-container">
                    <div class="step-indicator">Step 1/2</div>
                    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules"
                        @submit.prevent="handleRegister">
                        <el-form-item prop="username" class="enhanced-form-item">
                            <el-input v-model="registerForm.username" placeholder="Username" prefix-icon="User"
                                class="custom-input" />
                        </el-form-item>

                        <el-form-item prop="email" class="enhanced-form-item">
                            <el-input v-model="registerForm.email" placeholder="Email" prefix-icon="Message"
                                class="custom-input" />
                        </el-form-item>

                        <el-form-item prop="password" class="enhanced-form-item">
                            <el-input v-model="registerForm.password" type="password" placeholder="Password (at least 6 characters)"
                                prefix-icon="Lock" show-password class="custom-input" />
                        </el-form-item>

                        <el-button type="primary" native-type="submit" class="auth-button register-btn"
                            :loading="loading">
                            Register Now
                        </el-button>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>

        <div class="social-login">
            <div class="divider">
                <span class="divider-text">Other login methods</span>
            </div>
            <div class="social-icons">
                <el-icon class="icon wechat">
                    <ChatDotRound />
                </el-icon>
                <el-icon class="icon alipay">
                    <Wallet />
                </el-icon>
                <el-icon class="icon qq">
                    <Comment />
                </el-icon>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { defineExpose, defineEmits } from "vue"
import { ChatDotRound, Wallet, Comment, UserFilled } from '@element-plus/icons-vue'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Adjust according to your Django server address
    timeout: 5000
})
const emit = defineEmits(['success'])
const loginFormRef = ref(null)
const registerFormRef = ref(null)
// Dialog visibility state
const visible = ref(false)
const activeTab = ref('login')
const loading = ref(false)

// Login form data
const loginForm = reactive({
    username: '',
    password: ''
})
const rememberMe = ref(false)

// Register form data
const registerForm = reactive({
    username: '',
    email: '',
    password: '',
})

// Validation rules
const loginRules = {
    username: [
        { required: true, message: 'Please enter username or email', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Please enter password', trigger: 'blur' },
        { min: 6, message: 'Password length cannot be less than 6 characters', trigger: 'blur' }
    ]
}

const registerRules = {
    username: [
        { required: true, message: 'Please enter username', trigger: 'blur' },
        { min: 3, max: 20, message: 'Length must be between 3 and 20 characters', trigger: 'blur' }
    ],
    email: [
        { required: true, message: 'Please enter email', trigger: 'blur' },
        { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Please enter password', trigger: 'blur' },
        { min: 6, message: 'Password length cannot be less than 6 characters', trigger: 'blur' }
    ],
}

// Open dialog
const open = () => {
    visible.value = true
}

// Handle login
const handleLogin = async () => {
    try {
        // Form validation
        await loginFormRef.value.validate()
        loading.value = true
        // API call for login
        const response = await api.post('login/', {
            username: loginForm.username,
            password: loginForm.password
        })

        if (response.data.code == 0) {
            ElMessage.success('Login successful')
            setTimeout(() => {
                ElMessage.success(`Welcome back, ${response.data.data.username}!`)
            }, 3000);
            
            visible.value = false
            emit('success', {
                type: 'login',
                user: {
                    username: response.data.data.username,
                    email: response.data.data.email
                }
            })
        }
        else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        let message = 'Login failed'
        if (error.response) {
            message = error.response.data.error || message
        }
        ElMessage.error(message)
    } finally {
        loading.value = false
    }
}

// Handle registration
const handleRegister = async () => {
    try {
        // Form validation
        await registerFormRef.value.validate()
        loading.value = true
        // Send registration request
        const response = await api.post('register/', {
            username: registerForm.username,
            email: registerForm.email,
            password: registerForm.password,
        })
        console.log(response)
        ElMessage.success('Registration successful')
        // Auto-fill login form
        loginForm.username = registerForm.username
        loginForm.password = registerForm.password
        activeTab.value = 'login' // Switch to login tab
    } catch (error) {
        let message = 'Registration failed'
        if (error.response) {
            // Handle Django field-level errors
            const errors = error.response.data
            message = Object.values(errors).join(' ') || message
        }
        ElMessage.error(message)
    } finally {
        loading.value = false
    }
}

defineExpose({ open })
</script>


<style scoped lang="scss">
.auth-dialog {
    :deep(.el-dialog) {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    :deep(.el-dialog__header) {
        background: linear-gradient(135deg, #409EFF 0%, #6a5af9 100%);
        margin: 0;
        padding: 20px;
    }

    .dialog-header {
        display: flex;
        align-items: center;
        color: white;

        .user-icon {
            font-size: 28px;
            margin-right: 12px;
        }

        h2 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
        }
    }

    .enhanced-tabs {
        :deep(.el-tabs__nav-wrap)::after {
            height: 1px !important;
        }

        :deep(.el-tabs__item) {
            font-size: 16px;
            height: 50px;
            transition: all 0.3s;

            &.is-active {
                color: #409EFF;
                font-weight: 600;
            }
        }

        :deep(.el-tabs__active-bar) {
            background-color: #409EFF;
            height: 3px;
        }
    }

    .form-container {
        padding: 20px 30px;
    }

    .enhanced-form-item {
        :deep(.el-form-item__content) {
            position: relative;
        }

        .custom-input {
            :deep(.el-input__inner) {
                height: 46px;
                border-radius: 8px;
                padding-left: 40px;
                transition: all 0.3s;
                color: #606266;

                &:focus {
                    border-color: #409EFF;
                    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
                }
            }

            :deep(.el-input__prefix) {
                left: 10px;
                display: flex;
                align-items: center;

                .el-icon {
                    font-size: 18px;
                    color: #999;
                }
            }
        }

        .password-tips {
            font-size: 12px;
            color: #999;
            margin-top: 6px;
        }
    }

    .auth-button {
        width: 100%;
        height: 46px;
        border-radius: 8px;
        font-size: 16px;
        transition: all 0.3s;

        &.login-btn {
            background: linear-gradient(135deg, #409EFF 0%, #6a5af9 100%);
            border: none;

            &:hover {
                opacity: 0.9;
                transform: translateY(-2px);
            }
        }

        &.register-btn {
            background: linear-gradient(135deg, #67C23A 0%, #85ce61 100%);
            border: none;
        }
    }

    .social-login {
        padding: 15px 30px 25px;

        .divider {
            position: relative;
            height: 1px;
            background: #eee;
            margin: 20px 0;

            &-text {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 0 15px;
                color: #999;
                font-size: 12px;
            }
        }

        .social-icons {
            display: flex;
            justify-content: center;
            gap: 25px;

            .icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;

                &.wechat {
                    color: #09b83e;
                    background: rgba(9, 184, 62, 0.1);

                    &:hover {
                        background: rgba(9, 184, 62, 0.2);
                    }
                }

                &.alipay {
                    color: #1677ff;
                    background: rgba(22, 119, 255, 0.1);

                    &:hover {
                        background: rgba(22, 119, 255, 0.2);
                    }
                }

                &.qq {
                    color: #ff5722;
                    background: rgba(255, 87, 34, 0.1);

                    &:hover {
                        background: rgba(255, 87, 34, 0.2);
                    }
                }
            }
        }
    }

    .step-indicator {
        text-align: right;
        color: #999;
        font-size: 12px;
        margin-bottom: 15px;
    }
}
</style>