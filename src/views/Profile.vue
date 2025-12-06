<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-header text-center bg-white border-0 pt-4">
          <div class="position-relative d-inline-block mb-3">
             <img 
                :src="currentUser.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
                class="rounded-circle border shadow-sm"
                style="width: 120px; height: 120px; object-fit: cover;"
            >
            <label class="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle shadow-sm" style="width: 35px; height: 35px; padding: 6px; cursor: pointer;" title="Đổi ảnh đại diện">
                +
                <input type="file" class="d-none" @change="handleAvatarChange" accept="image/*">
            </label>
          </div>
          
          <h4 class="fw-bold">{{ currentUser.name }}</h4>
          <p class="text-muted small">{{ currentUser.email }}</p>
        </div>

        <div class="card-body px-4 pb-4">
          <div v-if="message" class="alert alert-success text-center">{{ message }}</div>
          <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
          
          <form @submit.prevent="updateProfile">
            <div class="mb-3">
              <label class="fw-bold text-secondary">Họ tên</label>
              <input type="text" v-model="currentUser.name" class="form-control" required>
            </div>
            
            <div class="mb-3">
              <label class="fw-bold text-secondary">Email (Không đổi)</label>
              <input type="text" :value="currentUser.email" class="form-control" disabled>
            </div>

             <div class="mb-4">
              <label class="fw-bold text-secondary">Mật khẩu mới (Để trống nếu không đổi)</label>
              <input type="password" v-model="newPassword" class="form-control" placeholder="******">
            </div>
            
            <button type="submit" class="btn btn-primary w-100 fw-bold">Lưu thay đổi</button>
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
const error = ref('')

onMounted(() => {
  // Lấy thông tin user đang đăng nhập
  currentUser.value = JSON.parse(localStorage.getItem('currentUser')) || {}
})

// Xử lý khi chọn file ảnh mới
const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        // Kiểm tra dung lượng ảnh (Giới hạn 2MB)
        if (file.size > 2 * 1024 * 1024) {
            error.value = 'Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.'
            return
        }

        // Đọc file và chuyển thành Base64 để hiển thị preview
        const reader = new FileReader()
        reader.onload = (e) => {
            currentUser.value.avatar = e.target.result
            error.value = '' // Xóa thông báo lỗi nếu có
        }
        reader.readAsDataURL(file)
    }
}

const updateProfile = () => {
  if(!confirm('Bạn có chắc chắn muốn cập nhật hồ sơ?')) {
    return
  }
  message.value = ''
  error.value = ''
  
  // 1. Tìm user trong danh sách "Database giả" ở LocalStorage
  const users = JSON.parse(localStorage.getItem('users')) || []
  const index = users.findIndex(u => u.email === currentUser.value.email)

  if (index !== -1) {
    // 2. Cập nhật thông tin mới vào mảng users gốc
    users[index].name = currentUser.value.name
    users[index].avatar = currentUser.value.avatar // Lưu avatar mới
    
    if (newPassword.value) {
      users[index].password = newPassword.value
    }

    try {
        // Lưu lại mảng users
        localStorage.setItem('users', JSON.stringify(users))

        // 3. Cập nhật lại Session hiện tại (để Navbar cập nhật theo)
        const newSession = { ...currentUser.value }
        // Xóa password khỏi session để bảo mật (tùy chọn)
        delete newSession.password 
        
        localStorage.setItem('currentUser', JSON.stringify(newSession))
        
        // 4. Bắn sự kiện để các component khác (như Navbar) cập nhật UI
        window.dispatchEvent(new Event('auth-changed'))

        message.value = 'Đã cập nhật hồ sơ thành công!'
        newPassword.value = '' // Reset ô mật khẩu
    } catch (e) {
        console.error(e)
        error.value = 'Lỗi: Bộ nhớ trình duyệt đầy hoặc ảnh quá lớn.'
    }
  } else {
    error.value = 'Không tìm thấy tài khoản người dùng!'
  }
}
</script>