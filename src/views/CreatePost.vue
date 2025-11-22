<template>
  <div class="row justify-content-center">
    <div class="col-md-9 col-lg-7">
      <div class="text-center mb-4 mt-3">
        <h2 class="fw-bold text-primary">Gửi bài viết mới</h2>
        <p class="text-muted">Chia sẻ câu chuyện, tin tức nóng hổi của bạn</p>
      </div>

      <div class="card shadow-sm border-0">
        <div class="card-body p-4">
          <form @submit.prevent="submitPost">
            <div class="mb-4">
              <label class="form-label fw-bold text-secondary">Tiêu đề bài viết</label>
              <input 
                type="text" 
                v-model="post.title" 
                class="form-control form-control-lg" 
                placeholder="Tiêu đề hấp dẫn..." 
                required
              >
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold text-secondary">Ảnh bìa (Tùy chọn)</label>
              
              <input 
                type="file" 
                class="form-control" 
                @change="handleFileUpload" 
                accept="image/*"
              >
              
              <div v-if="post.image" class="mt-3 position-relative d-inline-block">
                <img :src="post.image" class="img-thumbnail rounded" style="max-height: 200px">
                <button 
                  type="button"
                  @click="removeImage" 
                  class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                  title="Xóa ảnh"
                >✕</button>
              </div>
              
              <div v-else class="form-text text-muted">
                💡 Nếu không chọn ảnh, hệ thống sẽ tự động tạo một ảnh ngẫu nhiên đẹp mắt.
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold text-secondary">Nội dung chi tiết</label>
              <textarea 
                v-model="post.content" 
                class="form-control" 
                rows="8" 
                placeholder="Nội dung chính..." 
                required
              ></textarea>
            </div>

            <div class="d-flex gap-2 justify-content-end pt-2 border-top">
              <router-link to="/" class="btn btn-light px-4">Hủy bỏ</router-link>
              <button type="submit" class="btn btn-primary px-4 fw-bold shadow-sm">
                Đăng bài ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const post = reactive({ title: '', content: '', image: null })

// Xử lý khi người dùng chọn file
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Dùng FileReader để đọc file thành chuỗi Base64 (để lưu được vào LocalStorage)
    const reader = new FileReader()
    reader.onload = (e) => {
      post.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Xóa ảnh đã chọn
const removeImage = () => {
  post.image = null
}

const submitPost = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  
  if (!currentUser) {
    alert('Vui lòng đăng nhập để viết bài!')
    router.push('/login')
    return
  }

  const newPost = {
    id: Date.now(),
    title: post.title,
    content: post.content,
    image: post.image, // Lưu ảnh (chuỗi base64 hoặc null)
    authorName: currentUser.name,
    date: new Date().toISOString()
  }

  const posts = JSON.parse(localStorage.getItem('posts')) || []
  posts.push(newPost)
  
  try {
    localStorage.setItem('posts', JSON.stringify(posts))
    router.push('/')
  } catch (e) {
    // Lỗi này xảy ra nếu ảnh quá nặng (>5MB)
    alert('Ảnh của bạn quá lớn so với bộ nhớ trình duyệt. Vui lòng chọn ảnh nhỏ hơn!')
  }
}
</script>