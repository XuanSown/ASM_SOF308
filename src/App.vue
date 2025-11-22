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
  // Lắng nghe sự kiện đăng nhập/đăng xuất từ các component con
  window.addEventListener('auth-changed', checkAuth)
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold text-success" to="/">SownPolyBlog</RouterLink>
      
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
             <RouterLink class="nav-link" to="/">Trang chủ</RouterLink>
          </li>
          
          <!-- Chưa đăng nhập -->
          <template v-if="!user">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Đăng nhập</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="btn btn-success btn-sm ms-2" to="/register">Đăng ký</RouterLink>
            </li>
          </template>

          <!-- Đã đăng nhập -->
          <template v-else>
             <li class="nav-item">
              <RouterLink class="nav-link" to="/create-post">Viết bài</RouterLink>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                {{ user.name }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><RouterLink class="dropdown-item" to="/profile">Hồ sơ</RouterLink></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" @click="logout">Đăng xuất</a></li>
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