<template>
    <div class="row justify-content-center mt-5">
        <div class="col-md-6">
            <div class="card shadow-sm">
                <div class="card-body p-4">
                    <h3 class="text-center mb-4 text-success">Đăng Ký Tài Khoản</h3>

                    <div v-if="error" class="alert alert-danger">{{ error }}</div>

                    <form @submit.prevent="handleRegister">
                        <div class="mb-4 text-center">
                            <div class="position-relative d-inline-block">
                                <img 
                                    :src="form.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
                                    class="rounded-circle border shadow-sm"
                                    style="width: 100px; height: 100px; object-fit: cover;"
                                >
                                <label class="btn btn-sm btn-secondary position-absolute bottom-0 end-0 rounded-circle" style="width: 32px; height: 32px; padding: 4px; cursor: pointer;">
                                    📷
                                    <input type="file" class="d-none" @change="handleFileUpload" accept="image/*">
                                </label>
                            </div>
                            <div class="form-text mt-2">Chọn ảnh đại diện (Tùy chọn)</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Họ và tên</label>
                            <input type="text" v-model="form.name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" v-model="form.email" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mật khẩu</label>
                            <input type="password" v-model="form.password" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nhập lại mật khẩu</label>
                            <input type="password" v-model="form.confirmPassword" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-success w-100">Đăng ký</button>
                    </form>
                    
                    <div class="mt-3 text-center">
                        <router-link to="/login" class="text-decoration-none">Đã có tài khoản? Đăng nhập ngay</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
// Thêm trường avatar mặc định là null
const form = reactive({ name: '', email: '', password: '', confirmPassword: '', avatar: null })
const error = ref('')

// Hàm xử lý khi người dùng chọn file ảnh
const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        // Kiểm tra kích thước file (Giới hạn 2MB để tránh đầy LocalStorage)
        if (file.size > 2 * 1024 * 1024) {
            error.value = 'Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.'
            return
        }
        
        // Chuyển file ảnh thành chuỗi Base64 để hiển thị và lưu trữ
        const reader = new FileReader()
        reader.onload = (e) => {
            form.avatar = e.target.result 
            error.value = '' // Xóa lỗi nếu có trước đó
        }
        reader.readAsDataURL(file)
    }
}

const handleRegister = () => {
    error.value = ''

    // 1. Kiểm tra mật khẩu khớp
    if (form.password !== form.confirmPassword) {
        error.value = 'Mật khẩu không khớp'
        return
    }

    // 2. Kiểm tra trùng email
    const users = JSON.parse(localStorage.getItem('users')) || []
    if (users.some(u => u.email === form.email)) {
        error.value = 'Email đã tồn tại!'
        return
    }

    // 3. Tạo user mới
    const newUser = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        password: form.password,
        avatar: form.avatar // Lưu ảnh đại diện vào database giả
    }

    // 4. Lưu vào LocalStorage (kèm xử lý lỗi bộ nhớ đầy)
    try {
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        alert('Đăng ký thành công!')
        router.push('/login')
    } catch (e) {
        console.error(e)
        error.value = 'Lỗi: Bộ nhớ trình duyệt đã đầy hoặc ảnh quá lớn. Hãy thử ảnh nhỏ hơn!'
    }
}
</script>