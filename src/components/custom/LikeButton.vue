<template>
  <button
    @click="toggleLike"
    :disabled="toggling"
    class="flex items-center space-x-1 text-sm"
    :class="{
      'text-red-600': liked,
      'text-gray-500 hover:text-red-600': !liked && !toggling,
      'text-gray-400': toggling
    }"
  >
    <svg
      v-if="liked"
      class="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clip-rule="evenodd"
      ></path>
    </svg>
    <svg
      v-else
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      ></path>
    </svg>
    <span>{{ likeCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as api from '../../services/api'

const props = defineProps({
  commentId: {
    type: Number,
    required: true
  },
  initialLiked: {
    type: Boolean,
    default: false
  },
  likeCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['like-toggled'])

const liked = ref(props.initialLiked)
const likeCount = ref(props.likeCount)
const toggling = ref(false)

const toggleLike = async () => {
  toggling.value = true
  try {
    if (!liked.value) {
      await api.likeComment(props.commentId)
      liked.value = true
      likeCount.value += 1
    } else {
      liked.value = false
      likeCount.value -= 1
    }
    emit('like-toggled', props.commentId, liked.value)
  } catch (error) {
    console.error('Error toggling like:', error)
  } finally {
    toggling.value = false
  }
}
</script>

<style scoped>
</style>
