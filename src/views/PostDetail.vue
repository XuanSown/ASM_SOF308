<template>
    <div class="container mt-4">
        <div v-if="post">
            <div class="card shadow-sm border-0 mb-4">
                <img v-if="post.image" :src="post.image" class="card-img-top"
                    style="max-width: 500px; object-fit: cover;">
                <div class="card-body p-4">
                    <h1 class="fw-bold mb-3">{{ post.title }}</h1>
                    <div class="d-flex align-items-center text-muted mb-4">
                        <span class="fw-bold text-primary me-3">{{ post.authorName }}</span>
                        <span>{{ formatDate(post.date) }}</span>
                    </div>
                    <div class="post-content lh-lg fs-5">{{ post.content }}
                    </div>
                </div>
            </div>
            <!-- Form bình luận -->
            <div class="card shadow-sm border-0 mb-5">
                <div class="card-body p-4">
                    <h4 class="fw-bold mb-4">Bình luận {{ comments.length }}</h4>

                    <!-- Form người bình luận -->
                    <div class="mb-4 d-flex gap-3">
                        <img :src="form.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"
                            class="rounded-circle border" width="50" height="50" style="object-fit: cover;">
                        <div class="flex-grow-1">
                            <textarea v-model="newComment" class="form-control mb-2" rows="2"
                                placeholder="Viết bình luận của bạn..."></textarea>
                            <button @click="submitComment" class="btn btn-primary btn-sm px-4 fw-bold">Gửi</button>
                        </div>
                    </div>
                    <!-- Danh sách bình luận -->
                    <div v-if="comments.length > 0">
                        <div v-for="(comment, index) in index" :key="index" class="d-fex gap-3 mb-3 border-bottom pb-3">
                            <img :src="comment.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"
                                class="rounded-circle border" width="45" height="45" style="object-fit: cover;">
                            <div>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="fw-bold">{{ comment.authorName }}</span>
                                    <small class="text-muted" style="font-size: 0.8rem;">{{ formatDate(comment.date)
                                        }}</small>
                                </div>
                                <p class="mb-0 mt-1">{{ comment.content }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center text-muted py-3">
                        Chưa có bình luận nào!
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center py-5">
            <h3>Không tìm thấy bài viết!</h3>
            <router-link to="/" class="btn btn-secondary mt-3">Quay lại trang chủ</router-link>
        </div>
    </div>
</template>

<script setup> 
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';

const route = useRoute();
const post = ref(null);
const comments = ref([]);
const newComment = ref('');
const currentUser = ref({})

// Lấy dữ liệu bài viết dựa trên ID từ route
onMounted(() => {
    currentUser.value = JSON.parse(localStorage.getItem('currentUser'))

    //Lấy bài viết theo ID
    const postId = route.params.id
    // Lấy danh sách bài viết từ localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || []
    post.value = posts.find(p => p.id === postId)

    if(post.value) {
        comments.value = post.value.comments || []
    }
})

const submitComment = () => {
    if(!newComment.value.trim()) return

    const commentData = {
        authorName: currentUser.value.name,
        avatar: currentUser.value.avatar,
        content: newComment.value,
        date: new Date().toISOString()
    }

    comments.value.unshift(commentData)

    // Cập nhật lại bài viết trong localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const index = posts.findIndex( p => p.id === post.value.id) // Tìm vị trí bài viết hiện tại

    if(index !== -1) {
        if(!posts[index].comments) posts[index].comments = [] // Khởi tạo mảng comments nếu chưa có
        posts[index].comments = comments.value // Cập nhật bình luận mới
        localStorage.setItem('posts', JSON.stringify(posts))
    }

    newComment.value = ''
}

const formatDate = (dateString) => {
    if(!dateString) return '' // Trả về chuỗi rỗng nếu không có ngày tháng
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}
</script>
<style scoped>
.post-content {
    white-space: pre-line;
    text-align: justify;
}
</style>