<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white"
  >
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 class="text-3xl font-extrabold text-gray-800 text-center">
        Waspito Rewards
      </h2>
      <p class="text-center text-gray-500">
        Sign in to your account
      </p>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
        >
          <span v-if="!loading">Login</span>
          <svg
            v-else
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/AuthService'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await AuthService.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* nothing extra—pure Tailwind for styling */
</style>
