<template>
  <div class="row">
    <div class="col-md-8 mx-auto">
      <h3 class="mb-4 fw-bold text-secondary border-bottom pb-2">Bảng tin</h3>
      
      <!-- Trạng thái khi chưa có bài viết nào -->
      <div v-if="posts.length === 0" class="text-center py-5 text-muted">
        <p class="fs-4">Chưa có bài viết nào.</p>
        <p>Hãy là người đầu tiên chia sẻ câu chuyện của bạn!</p>
      </div>
      
      <!-- Danh sách bài viết -->
      <div v-for="post in posts" :key="post.id" class="card mb-4 shadow-sm">
        <div class="card-body">
          <!-- Header bài viết: Avatar + Tên + Ngày -->
          <div class="d-flex align-items-center mb-3">
            <div class="avatar-placeholder me-2">
              {{ getInitials(post.authorName) }}
            </div>
            <div>
              <h6 class="mb-0 fw-bold">{{ post.authorName }}</h6>
              <small class="text-muted" style="font-size: 0.8rem;">
                {{ formatDate(post.date) }}
              </small>
            </div>
          </div>

          <!-- Nội dung bài viết -->
          <h4 class="card-title fw-bold">{{ post.title }}</h4>
          <p class="card-text" style="white-space: pre-line;">{{ post.content }}</p>
          
          <!-- Footer bài viết: Các nút tương tác (Demo) -->
          <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
            <button class="btn btn-light text-primary btn-sm">
               Thích
            </button>
            <button class="btn btn-light text-muted btn-sm">
               Bình luận
            </button>
            <button class="btn btn-light text-muted btn-sm">
               Chia sẻ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])

// Hàm lấy chữ cái đầu của tên để làm Avatar (VD: Nguyen Van A -> N)
const getInitials = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?'
}

// Hàm format ngày tháng cho đẹp
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('vi-VN')
}

onMounted(() => {
  // Lấy dữ liệu từ LocalStorage
  const storedPosts = localStorage.getItem('posts')
  if (storedPosts) {
    // Parse JSON và đảo ngược mảng để bài mới nhất lên đầu
    posts.value = JSON.parse(storedPosts).reverse()
  }
})
</script>

<style scoped>
.avatar-placeholder {
  width: 40px;
  height: 40px;
  background-color: #42b883; /* Màu xanh Vue */
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>