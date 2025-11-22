<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

const checkAuth = () => {
  user.value = JSON.parse(localStorage.getItem('currentUser'))
}

const logout = () => {
  localStorage.removeItem('currentUser')
  checkAuth()
  router.push('/login')
}

onMounted(() => {
  checkAuth()
  window.addEventListener('auth-changed', checkAuth)
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
    <div class="container">
      <RouterLink class="navbar-brand logo-brand d-flex align-items-center" to="/">
        <span class="logo-icon me-2">🌿</span> SOWN EXPRESS
      </RouterLink>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
             <RouterLink class="nav-link fw-medium" to="/">Trang chủ</RouterLink>
          </li>
          
          <template v-if="!user">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Đăng nhập</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="btn btn-success btn-sm ms-2 rounded-pill px-3 fw-bold" to="/register">Đăng ký</RouterLink>
            </li>
          </template>

          <template v-else>
             <li class="nav-item">
              <RouterLink class="nav-link" to="/create-post">Viết bài</RouterLink>
            </li>
            
            <li class="nav-item dropdown ms-2">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                <img 
                  :src="user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
                  class="rounded-circle border shadow-sm me-2"
                  style="width: 32px; height: 32px; object-fit: cover;"
                >
                <span class="fw-bold text-dark">{{ user.name }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end border-0 shadow">
                <li>
                  <RouterLink class="dropdown-item py-2" to="/profile">
                    Hồ sơ cá nhân
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger py-2" href="#" @click.prevent="logout">
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container py-4">
    <RouterView />
  </div>
</template>

<style scoped>
/* === LOGO STYLE MỚI === */
.logo-brand {
  font-family: 'Segoe UI', sans-serif;
  font-size: 1.8rem;
  font-weight: 800; /* Chữ siêu đậm */
  
  /* Hiệu ứng màu chuyển (Gradient) từ Xanh lá sang Vàng cam */
  background: linear-gradient(45deg, #198754, #ffc107);
  -webkit-background-clip: text; /* Cắt nền theo hình dáng chữ */
  -webkit-text-fill-color: transparent; /* Làm chữ trong suốt để hiện nền */
  
  letter-spacing: -0.5px; /* Thu hẹp khoảng cách chữ cho hiện đại */
  transition: opacity 0.3s;
}

.logo-brand:hover {
  opacity: 0.8; /* Hiệu ứng mờ nhẹ khi di chuột */
}

.logo-icon {
  font-size: 1.8rem;
  /* Icon không bị ảnh hưởng bởi gradient text */
  -webkit-text-fill-color: initial; 
}

/* Link điều hướng */
.nav-link {
  color: #555;
  transition: color 0.2s;
}
.nav-link:hover {
  color: #198754;
}
</style>