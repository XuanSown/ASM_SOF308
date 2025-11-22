<template>
    <div class="row justify-content-center mt-5">
        <div class="col-md-6">
            <div class="card shadow-sm">
                <div class="card-body p-4">
                    <h3 class="text-center mb-4 text-success">Đăng Ký Tài Khoản</h3>

                    <div v-if="error" class="alert alert-danger">{{ error }}</div>

                    <form @submit.prevent="handleRegister">
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
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const error = ref('')

const handleRegister = () => {
    error.value = ''

    if (form.password !== form.confirmPassword) {
        error.value = 'Mật khẩu không khớp'
        return
    }

    //Lấy dữ liệu cũ có trùng lặp hay không
    const users = JSON.parse(localStorage.getItem('users')) || []
    if (users.some(u => u.email === form.email)) {
        error.value = 'Email đã tồn tại!'
        return
    }

    //Lưu user mới
    const newUser = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        password: form.password
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    alert('Đăng ký thành công!')
    router.push('/login')
}
</script>