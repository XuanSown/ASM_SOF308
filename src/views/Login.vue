<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="text-center mb-4 text-primary">Đăng Nhập</h3>
          
          <div v-if="error" class="alert alert-danger">{{ error }}</div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" v-model="email" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <input type="password" v-model="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
          </form>
          
          <div class="mt-3 text-center">
            <router-link to="/register">Chưa có tài khoản? Đăng ký ngay</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem('users')) || []
  const user = users.find(u => u.email === email.value && u.password === password.value)

  if (user) {
    // Lưu session (bỏ password ra cho an toàn)
    const { password, ...userInfo } = user
    localStorage.setItem('currentUser', JSON.stringify(userInfo))
    
    // Bắn event để App.vue cập nhật lại Navbar
    window.dispatchEvent(new Event('auth-changed'))
    
    router.push('/')
  } else {
    error.value = 'Email hoặc mật khẩu sai!'
  }
}
</script>