<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header text-center bg-white">
          <h4>Hồ sơ cá nhân</h4>
        </div>
        <div class="card-body">
          <div v-if="message" class="alert alert-success">{{ message }}</div>
          
          <form @submit.prevent="updateProfile">
            <div class="mb-3">
              <label>Họ tên</label>
              <input type="text" v-model="currentUser.name" class="form-control" required>
            </div>
            <div class="mb-3">
              <label>Email (Không đổi)</label>
              <input type="text" :value="currentUser.email" class="form-control" disabled>
            </div>
             <div class="mb-3">
              <label>Mật khẩu mới (Tùy chọn)</label>
              <input type="password" v-model="newPassword" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary w-100">Lưu thay đổi</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentUser = ref({})
const newPassword = ref('')
const message = ref('')

onMounted(() => {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser')) || {}
})

const updateProfile = () => {
  const users = JSON.parse(localStorage.getItem('users')) || []
  const index = users.findIndex(u => u.email === currentUser.value.email)

  if (index !== -1) {
    // Cập nhật data gốc
    users[index].name = currentUser.value.name
    if (newPassword.value) {
      users[index].password = newPassword.value
    }
    localStorage.setItem('users', JSON.stringify(users))

    // Cập nhật session
    const newSession = { ...currentUser.value }
    localStorage.setItem('currentUser', JSON.stringify(newSession))
    
    // Bắn event cập nhật UI toàn cục
    window.dispatchEvent(new Event('auth-changed'))

    message.value = 'Đã cập nhật thành công!'
  }
}
</script>