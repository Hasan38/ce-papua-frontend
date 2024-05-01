<script setup lang="ts">
import { useUserSession } from '/@src/stores/userSession'
import { useLaravelError } from '/@src/composable/useLaravelError'
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { useNotyf } from '/@src/composable/useNotyf'

const $fetch = useLaravelFetch()
const notyf = useNotyf()
const userSession = useUserSession()
const router = useRouter()
const isLoading = ref(false)

function logout() {
  if (!isLoading.value) {
    isLoading.value = true

    try {
      $fetch('/sanctum/csrf-cookie')
      $fetch('/api/users/logout', {
        method: 'POST',
      })
      isLoading.value = false
      userSession.logoutUser()
      router.push('/auth/login')
    }
    catch (err: any) {
      notyf.error(useLaravelError(err))
    }
    finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <VDropdown
    right
    spaced
    class="user-dropdown profile-dropdown"
  >
    <template #button="{ toggle }">
      <a
        role="button"
        tabindex="0"
        class="is-trigger dropdown-trigger"
        aria-haspopup="true"
        @keydown.space.prevent="toggle"
        @click="toggle"
      >
        <VAvatar picture="/images/avatars/svg/vuero-1.svg" />
      </a>
    </template>

    <template #content>
      <div class="dropdown-head">
        <VAvatar
          size="large"
          picture="/images/avatars/svg/vuero-1.svg"
        />

        <div class="meta">
          <span>{{ userSession.user?.name ?? 'UNKNOWN' }}</span>
          <span>{{ userSession.user?.roles[0].name }}</span>
        </div>
      </div>

      <a
        href="#"
        role="menuitem"
        class="dropdown-item is-media"
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-user-alt"
          />
        </div>
        <div class="meta">
          <span>Profile</span>
          <span>View your profile</span>
        </div>
      </a>

      <hr class="dropdown-divider">

      <div class="dropdown-item is-button">
        <VButton
          class="logout-button"
          icon="feather:log-out"
          color="primary"
          role="menuitem"
          raised
          fullwidth
          @click="logout"
        >
          Logout
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>
