import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as api from '../services/api'

interface User {
  id: number
  name: string
  email: string
  points: number
  badge: string
  next_badge?: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User|null>(null)
  const loading = ref(false)
  const error = ref<string|null>(null)

  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      user.value = await api.getProfile()
    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch profile'
    } finally {
      loading.value = false
    }
  }

  return { user, loading, error, fetchProfile }
})
