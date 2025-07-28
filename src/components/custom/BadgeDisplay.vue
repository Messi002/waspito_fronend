<template>
  <div class="badge-display flex items-center space-x-2">
    <div
      class="badge px-3 py-1 rounded-full text-sm font-medium"
      :class="getBadgeClass(badge)"
    >
      {{ formatBadgeName(badge) }}
    </div>
    <div class="points text-gray-600">
      {{ points }} points
    </div>
    <div v-if="nextBadge" class="next-badge text-sm text-gray-500">
      Next: {{ formatBadgeName(nextBadge) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  badge?: string
  points?: number
  nextBadge?: string | null
}>()

const badge = computed(() => props.badge ?? 'none')
const points = computed(() => props.points ?? 0)
const nextBadge = computed(() => props.nextBadge ?? null)

function getBadgeClass(badge: string): string {
  const badgeClasses: Record<string, string> = {
    'none': 'bg-gray-200 text-gray-800',
    'beginner-badge': 'bg-blue-100 text-blue-800',
    'top-fan-badge': 'bg-purple-100 text-purple-800',
    'super-fan-badge': 'bg-yellow-100 text-yellow-800'
  }
  return badgeClasses[badge] || 'bg-gray-200 text-gray-800'
}

function formatBadgeName(badge: string): string {
  const badgeNames: Record<string, string> = {
    'none': 'No Badge',
    'beginner-badge': 'Beginner',
    'top-fan-badge': 'Top Fan',
    'super-fan-badge': 'Super Fan'
  }
  return badgeNames[badge] || badge
}
</script>

<style scoped>
.badge-display {
  margin: 0.5rem 0;
}
</style>


<style scoped>
.badge-display {
  margin: 0.5rem 0;
}
</style>
