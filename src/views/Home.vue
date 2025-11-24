<template>
  <div class="home-page">
    <div v-if="posts.length === 0" class="text-center py-5 bg-light rounded mb-4">
      <div class="mb-3 display-1 text-muted">📰</div>
      <h4 class="fw-bold">Chưa có tin tức nào</h4>
      <p class="text-muted">Hãy trở thành phóng viên đầu tiên của chúng tôi!</p>
      <router-link to="/create-post" class="btn btn-primary">Đăng bài ngay</router-link>
    </div>

    <div v-else>
      <section class="border-bottom pb-4 mb-4">
        <div class="row g-4">
          <div class="col-lg-8" v-if="featuredPost">
            <article class="card h-100 border-0 shadow-sm main-article">
              <div class="position-relative">
                <img :src="getImage(featuredPost)" class="card-img-top main-img" alt="Featured">
                <div class="card-body">
                  <h2 class="card-title fw-bold display-6">
                    <a href="#" class="text-decoration-none text-dark hover-title">
                      {{ featuredPost.title }}
                    </a>
                  </h2>
                  <p class="card-text text-secondary fs-5">{{ getExcerpt(featuredPost.content, 150) }}</p>
                  <div class="d-flex align-items-center text-muted small mt-3">
                    <span class="fw-bold text-primary me-2">{{ featuredPost.authorName }}</span>
                    <span>• {{ formatDate(featuredPost.date) }}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="col-lg-4">
            <h5 class="fw-bold text-uppercase text-danger border-bottom pb-2 border-danger">Tin đáng chú ý</h5>
            <div class="d-flex flex-column gap-3 mt-3">
              <article v-for="post in topNews" :key="post.id" class="d-flex gap-3 align-items-start border-bottom pb-3">
                <img :src="getImage(post)" class="rounded" width="100" height="70" style="object-fit: cover;">
                <div>
                  <h6 class="fw-bold mb-1">
                    <a href="#" class="text-decoration-none text-dark hover-title">
                      {{ post.title }}
                    </a>
                  </h6>
                  <small class="text-muted">{{ formatDate(post.date) }}</small>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h5 class="fw-bold text-uppercase border-bottom pb-2 mb-3">Mới cập nhật</h5>
        <div class="row g-4">
          <div v-for="post in regularPosts" :key="post.id" class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm news-card">
              <img :src="getImage(post)" class="card-img-top" height="200" style="object-fit: cover;">
              <div class="card-body">
                <h5 class="card-title fw-bold">
                  <a href="#" class="text-decoration-none text-dark hover-title">
                    {{ getExcerpt(post.title, 50) }}
                  </a>
                </h5>
                <p class="card-text text-muted small">{{ getExcerpt(post.content, 80) }}</p>
              </div>
              <div class="card-footer bg-white border-0 pt-0 pb-3">
                <small class="text-muted">{{ post.authorName }} • {{ formatDate(post.date) }}</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <footer class="bg-light text-secondary pt-1 pb-2 mt-5 rounded-top border-top">
      <div class="text-center small text-muted">
          &copy; 2025 <strong>SownExpress</strong>. All rights reserved.
        </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const posts = ref([])

const featuredPost = computed(() => posts.value.length > 0 ? posts.value[0] : null)
const topNews = computed(() => posts.value.slice(1, 4))
const regularPosts = computed(() => posts.value.slice(4))

//HÀM LẤY ẢNH
const getImage = (post) => {
  //ảnh upload
  if (post.image) return post.image
  //ảnh random
  return `https://picsum.photos/seed/${post.id}/800/600`
}

const getExcerpt = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

onMounted(() => {
  const storedPosts = localStorage.getItem('posts')
  if (storedPosts) {
    posts.value = JSON.parse(storedPosts).reverse()
  }
})
</script>

<style scoped>
.hover-title:hover {
  color: #9f224e !important;
  transition: color 0.2s;
}
.news-card:hover {
  transform: translateY(-3px);
  transition: transform 0.3s ease;
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.main-img {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
}
.main-article:hover .main-img {
  opacity: 0.95;
  transition: opacity 0.3s;
}
</style>