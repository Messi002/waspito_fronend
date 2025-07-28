<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            
            <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Waspito Rewards
            </h1>
          </div>
          <button
            @click="handleLogout"
            class="group relative px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- User Profile Card -->
      <div v-if="userStore.user" class="mb-8">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-32 relative">
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="absolute -bottom-12 left-8">
              <div class="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                <span class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {{ userStore.user.name.charAt(0) }}
                </span>
              </div>
            </div>
          </div>
          <div class="pt-16 pb-8 px-8">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start">
              <div class="mb-6 lg:mb-0">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ userStore.user?.name }}</h2>
                <p class="text-gray-600 mb-4 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ userStore.user?.email }}
                </p>
                <BadgeDisplay
                  :badge="userStore.user?.badge || 'none'"
                  :points="userStore.user?.points"
                  :next-badge="getNextBadge(userStore.user?.badge || 'none')"
                />
              </div>
              
              <!-- Stats Cards -->
              <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div class="text-2xl font-bold text-blue-600">{{ userStore.user?.points || 0 }}</div>
                  <div class="text-sm text-blue-600/80 font-medium">Total Points</div>
                </div>
                
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 col-span-2 lg:col-span-1">
                  <div class="text-2xl font-bold text-purple-600">{{ userStore.user?.badge || 'Starter' }}</div>
                  <div class="text-sm text-purple-600/80 font-medium">Current Badge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Posts Section -->
      <div class="posts-section">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900 flex items-center">
            <svg class="w-8 h-8 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Community Posts
          </h2>
          <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {{ posts.length }} posts
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loadingPosts" class="flex justify-center items-center py-16">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 bg-indigo-100 rounded-full"></div>
            </div>
          </div>
          <span class="ml-4 text-gray-600 font-medium">Loading posts...</span>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="posts.length === 0" class="text-center py-16">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p class="text-gray-600 max-w-md mx-auto">Be the first to share something with the community! Posts will appear here once they're available.</p>
        </div>
        
        <!-- Posts Grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="post in posts"
            :key="post.id"
            class="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {{ post.title }}
                </h3>
                <div class="w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <p class="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{{ post.body }}</p>
              
              <CommentList
                :ref="el => setCommentListRef(el, post.id)"
                :key="commentsKey"
                :post-id="post.id"
                :current-user-id="userStore.user?.id || 0"
                @comment-deleted="handleCommentDeleted"
                @like-toggled="handleLikeToggled"
                class="mb-4"
              />
              
              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  @click="openCommentModal(post.id)"
                  class="group/btn flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Add Comment</span>
                </button>
                <button
                  @click="togglePostLike(post)"
                  :aria-pressed="post.liked"
                  class="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                  :class="post.liked ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
                >
                  <svg
                    class="w-5 h-5 mr-1 transition-colors"
                    :class="post.liked ? 'text-pink-500' : 'text-gray-400'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      v-if="post.liked"
                      fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clip-rule="evenodd"
                    />
                    <path
                      v-else
                      fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656zM10 15.243l5.657-5.657a2 2 0 10-2.828-2.828L10 8.757l-2.829-2.829a2 2 0 10-2.828 2.828L10 15.243z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ post.like_count || 0 }}</span>
                  <span class="sr-only">{{ post.liked ? 'Unlike' : 'Like' }} post</span>
                </button>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    2h ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Comment Modal -->
    <VueFinalModal
      v-model="showCommentModal"
      class="fixed inset-0 flex items-center justify-center"
      content-class="z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full mx-4 overflow-hidden"
      overlay-class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    >
      <CommentModal
        v-if="selectedPostId"
        :post-id="selectedPostId"
        @close="closeCommentModal"
        @submit="handleCommentSubmit"
      />
    </VueFinalModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VueFinalModal } from 'vue-final-modal'
import AuthService from '../../services/AuthService'
import * as api from '../../services/api'
import BadgeDisplay from './BadgeDisplay.vue'
import CommentList from './CommentList.vue'
import CommentModal from './CommentModal.vue'

interface User {
  id: number
  name: string
  email: string
  points: number
  badge: string
}

interface Post {
  id: number
  title: string
  body: string
  like_count: number
  liked: boolean
  current_user_like_id: number | null
}

import { useUserStore } from '../../stores/user'
const userStore = useUserStore()
const posts = ref<Post[]>([])
const loadingPosts = ref(true)
const showCommentModal = ref(false)
const selectedPostId = ref<number | null>(null)

const router = useRouter()

onMounted(async () => {
  if (!AuthService.isAuthenticated()) {
    router.push('/login')
    return
  }
  await userStore.fetchProfile()
  fetchPosts()
})

const handleLogout = () => {
  AuthService.logout()
  router.push('/login')
}

const fetchPosts = async () => {
  try {
    const response = await api.getPosts()
    posts.value = response
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loadingPosts.value = false
  }
}

const getNextBadge = (currentBadge: string) => {
  const badgeProgression = [
    'none',
    'beginner-badge',
    'top-fan-badge',
    'super-fan-badge'
  ]
  
  const currentIndex = badgeProgression.indexOf(currentBadge)
  if (currentIndex >= 0 && currentIndex < badgeProgression.length - 1) {
    return badgeProgression[currentIndex + 1]
  }
  
  return null
}

const openCommentModal = (postId: number) => {
  selectedPostId.value = postId
  showCommentModal.value = true
}

const closeCommentModal = () => {
  showCommentModal.value = false
  selectedPostId.value = null
}

const commentsKey = ref(0);
const commentListRefs: Record<number, any> = {};
function setCommentListRef(el: any, postId: number) {
  if (el) commentListRefs[postId] = el;
}



const handleCommentSubmit = async (commentData: { post_id: number; text: string }) => {
  try {
    const newComment = await api.createComment(commentData)
    closeCommentModal()
    const commentListRef = commentListRefs[commentData.post_id]
    if (commentListRef && commentListRef.addComment) {
      commentListRef.addComment(newComment)
    }
    await userStore.fetchProfile();
  } catch (error) {
    console.error('Error submitting comment:', error)
  }
}

const handleCommentDeleted = async (commentId: number) => {
  try {
    await api.deleteComment(commentId)
  } catch (error) {
    console.error('Error deleting comment:', error)
  }
}

const handleLikeToggled = async (commentId: number, liked: boolean) => {
  await fetchPosts()
}
async function togglePostLike(post: Post) {
  if (!userStore.user) return;
  try {
    if (!post.liked) {
      const res = await api.likePost(post.id);
      post.liked = true;
      post.like_count = res.like_count;
      post.current_user_like_id = res.like_id;
    } else if (post.current_user_like_id) {
      const res = await api.unlikePost(post.id, post.current_user_like_id);
      post.liked = false;
      post.like_count = res.like_count;
      post.current_user_like_id = null;
    }
    await userStore.fetchProfile();
  } catch (e) {
    console.error('Failed to toggle like:', e);
  }
  await fetchPosts();
}

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;  
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>