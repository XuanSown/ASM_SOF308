import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import CreatePost from "../views/CreatePost.vue";
import Profile from "../views/Profile.vue";
import PostDetail from "../views/PostDetail.vue";

import{createRouter, createWebHistory} from 'vue-router'

const router =createRouter ({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        //Các trang này ai cũng vào được không bảo vệ
        {path:'/', name:'home', component:Home},
        {path:'/login', name:'login', component:Login},
        {path: '/register', name:'register', component:Register},

        //Các trang bảo vệ cần đăng nhập mới vào được
        //"requiresAuth : true" user cần đăng nhập 
        {path:'/post/:id', name:'post-detail', component:PostDetail, meta:{requiresAuth:true}},
        {path:'/create-post', name:'create-post', component:CreatePost, meta:{requiresAuth: true}},
        {path:'/profile', name:'profile', component:Profile, meta:{requiresAuth: true}}
    ]
});

//Chặn user chưa đăng nhập
router.beforeEach((to, form, next) => {
    const isLoggedIn = localStorage.getItem('currentUser')

    if(to.meta.requiresAuth && !isLoggedIn) {
        alert('Bạn cần đăng nhập để truy cập trang này!')
        next('/login')
    } else {
        next()
    }
});

export default router

