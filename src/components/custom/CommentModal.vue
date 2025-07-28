<template>
  <div class="comment-modal">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900">Add Comment</h2>
      </div>
      <button
        @click="$emit('close')"
        class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <form @submit.prevent="submitComment">
      <div class="mb-6">
        <label for="commentText" class="block text-sm font-semibold text-gray-700 mb-3">
          Share your thoughts
        </label>
        <div class="relative">
          <textarea
            id="commentText"
            v-model="commentText"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            rows="4"
            placeholder="What do you think about this post?"
            required
          ></textarea>
          <div class="absolute bottom-3 right-3 text-xs text-gray-400">
            {{ commentText.length }}/500
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="submitting || !commentText.trim()"
          class="group relative px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
        >
          <span class="relative z-10 flex items-center space-x-2">
            <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>{{ submitting ? 'Posting...' : 'Post Comment' }}</span>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
        </button>
      </div>
    </form>

    <!-- Tips -->
    <div class="mt-6 pt-4 border-t border-gray-100">
      <div class="flex items-start space-x-2 text-xs text-gray-500">
        <svg class="w-4 h-4 mt-0.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Be respectful and constructive in your comments. You'll earn points for engaging with the community!</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import * as api from '../../services/api'

const props = defineProps<{ postId: number }>()
const commentText = ref('')
const submitting = ref(false)

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'submit', payload: { post_id: number, text: string }): void
}>()

watch(commentText, (newValue) => {
  if (newValue.length > 500) {
    commentText.value = newValue.slice(0, 500)
  }
})

const submitComment = async () => {
  if (!commentText.value.trim()) return

  submitting.value = true

  try {
    emit('submit', { post_id: props.postId, text: commentText.value.trim() })
    commentText.value = ''
    emit('close')
  } catch (error) {
    console.error('Error submitting comment:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.comment-modal {
  background: white;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
}
</style>