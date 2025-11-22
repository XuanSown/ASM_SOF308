<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card mt-4">
        <div class="card-header bg-white fw-bold">Viết bài mới</div>
        <div class="card-body">
          <form @submit.prevent="submitPost">
            <div class="mb-3">
              <label class="form-label">Tiêu đề</label>
              <input type="text" v-model="post.title" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Nội dung</label>
              <textarea v-model="post.content" class="form-control" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Đăng bài</button>
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
const post = reactive({ title: '', content: '' })

const submitPost = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  
  // Double check an toàn
  if (!currentUser) {
    router.push('/login')
    return
  }

  const newPost = {
    id: Date.now(),
    ...post,
    authorName: currentUser.name,
    date: new Date().toISOString()
  }

  const posts = JSON.parse(localStorage.getItem('posts')) || []
  posts.push(newPost)
  localStorage.setItem('posts', JSON.stringify(posts))

  router.push('/')
}
</script>