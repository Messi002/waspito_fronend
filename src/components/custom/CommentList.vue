<template>
  <div class="comment-list">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900">Comments</h3>
      </div>
      <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        {{ showComments.length }} {{ showComments.length === 1 ? 'comment' : 'comments' }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="showComments.length === 0" class="text-center py-8">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h4 class="text-sm font-medium text-gray-900 mb-1">No comments yet</h4>
      <p class="text-xs text-gray-500">Be the first to share your thoughts!</p>
    </div>

    <!-- Comments List -->
    <div v-else class="space-y-4">
      <div
        v-for="comment in showComments"
        :key="comment.id"
        class="group relative bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
      >
        <!-- Comment Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <!-- User Avatar -->
            <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-xs font-bold text-white">
                {{ comment.user.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <!-- User Info -->
            <div>
              <div class="font-semibold text-gray-900 text-sm">{{ comment.user.name }}</div>
              <div class="text-xs text-gray-500 flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatDate(comment.created_at) }}
              </div>
            </div>
          </div>
          
          <!-- Delete Button -->
          <button
            v-if="canEdit(comment.user.id)"
            @click="deleteComment(comment.id)"
            class="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete comment"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Comment Text -->
        <div class="text-gray-700 text-sm leading-relaxed mb-3 ml-11">
          {{ comment.text }}
        </div>

        <!-- Like Button -->
        <div class="ml-11">
          <LikeButton
            :comment-id="comment.id"
            :initial-liked="comment.liked"
            :like-count="comment.like_count"
            @like-toggled="handleLikeToggled"
            class="inline-flex"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import LikeButton from './LikeButton.vue'
import * as api from '../../services/api'

interface Comment {
  id: number
  text: string
  created_at: string
  user: {
    id: number
    name: string
  }
  liked: boolean
  like_count: number
  current_user_like_id: number | null
}

const props = defineProps<{
  postId: number
  currentUserId: number
  comments?: Comment[]
}>()

const emit = defineEmits<{
  (e: 'comment-deleted', commentId: number): void
  (e: 'like-toggled', commentId: number, liked: boolean): void
}>()

const localComments = ref<Comment[]>([])

const showComments = computed(() => props.comments ?? localComments.value)

// Add a new comment to the UI
function addComment(newComment: Comment) {
  console.log('addComment: localComments.value before unshift', localComments.value, typeof localComments.value, Array.isArray(localComments.value))
  localComments.value.unshift(newComment)
}

defineExpose({ addComment })

onMounted(() => {
  if (!props.comments) {
    fetchComments()
  } else {
    localComments.value = props.comments
  }
})

const fetchComments = async () => {
  try {
    const response = await api.getCommentsForPost(props.postId)
    console.log('Fetched comments for post', props.postId, response)
    localComments.value = response
  } catch (error) {
    console.error('Error fetching comments:', error)
  }
}

const deleteComment = async (commentId: number) => {
  try {
    await api.deleteCommentForPost(props.postId, commentId)
    emit('comment-deleted', commentId)
    localComments.value = localComments.value.filter(c => c.id !== commentId)
  } catch (error) {
    console.error('Error deleting comment:', error)
  }
}

const canEdit = (userId: number) => {
  return userId === props.currentUserId
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return 'Today'
  } else if (diffDays === 2) {
    return 'Yesterday'
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

const handleLikeToggled = async (commentId: number, liked: boolean) => {
  try {
    const comment = showComments.value.find(c => c.id === commentId)
    if (liked) {
      await api.likeComment(commentId)
    } else {
      if (comment && comment.current_user_like_id) {
        await api.unlikeComment(commentId, comment.current_user_like_id)
      } else {
        console.warn('No like id found for unlike')
      }
    }
    await fetchComments()
    emit('like-toggled', commentId, liked)
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}
</script>

<style scoped>
.comment-list {
  margin-top: 1rem;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: #a5b4fc #f3f4f6;
}
.comment-list::-webkit-scrollbar {
  width: 6px;
}
.comment-list::-webkit-scrollbar-thumb {
  background: #a5b4fc;
  border-radius: 4px;
}
.comment-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}
</style>