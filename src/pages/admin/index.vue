<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Main Dashboard')

useHead({
  title: 'Main Dashboard',
})
</script>

<template>
  <div class="page-content-inner">
    <Dashboard />
  </div>
</template>
