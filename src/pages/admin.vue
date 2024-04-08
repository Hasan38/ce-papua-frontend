<route lang="yaml">
    meta:
      requiresAuth: true
    </route>

<template>
  <AdminLayout>
    <!-- Content Wrapper -->
    <RouterView v-slot="{ Component }">
      <Transition
        name="fade-fast"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </AdminLayout>
</template>
