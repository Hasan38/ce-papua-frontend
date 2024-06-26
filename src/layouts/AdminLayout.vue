<script setup lang="ts">
import type { VAvatarProps, VAvatarColor } from '/@src/components/base/VAvatar.vue'
import type { UserPopover } from '/@src/models/users'
import { popovers } from '/@src/data/users/userPopovers'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { usePanels } from '/@src/stores/panels'

export type NavbarTheme = 'default' | 'colored' | 'fade'
export type SubnavId =
  | 'closed'
  | 'home'
  | 'machines'
  | 'error_codes'
  | 'tutorials'
  | 'settings'
  | 'search'

const props = withDefaults(
  defineProps<{
    theme?: NavbarTheme
    nowrap?: boolean
  }>(),
  {
    theme: 'default',
  },
)

const viewWrapper = useViewWrapper()
const panels = usePanels()
const route = useRoute()
const filter = ref('')
const isMobileSidebarOpen = ref(false)
const activeMobileSubsidebar = ref('dashboard')
const activeSubnav = ref<SubnavId>('closed')

const filteredUsers = computed(() => {
  if (!filter.value) {
    return []
  }

  return Object.values(popovers).filter((user) => {
    return (
      user.fullName.match(new RegExp(filter.value, 'i'))
      || user.position.match(new RegExp(filter.value, 'i'))
    )
  })
})

function toggleSubnav(subnav: SubnavId) {
  if (activeSubnav.value === subnav) {
    activeSubnav.value = 'closed'
  }
  else {
    activeSubnav.value = subnav
  }
}

function getAvatarData(user: UserPopover): VAvatarProps {
  return {
    picture: user.avatar,
    initials: user.initials,
    color: user.color as VAvatarColor,
  }
}

watch(
  () => route.fullPath,
  () => {
    activeSubnav.value = 'closed'
    isMobileSidebarOpen.value = false
  },
)
</script>

<template>
  <div class="navbar-layout">
    <div class="app-overlay" />

    <!-- Mobile navigation -->
    <MobileNavbar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #brand>
        <RouterLink
          to="/"
          class="navbar-item is-brand"
        >
          <AnimatedLogo
            width="38px"
            height="38px"
          />
        </RouterLink>

        <div class="brand-end">
          <NotificationsMobileDropdown />
          <UserProfileDropdown />
        </div>
      </template>
    </MobileNavbar>

    <!-- Mobile sidebar links -->
    <MobileSidebar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #links>
        <li>
          <RouterLink
            :class="[
              (route.path.startsWith('/admin/dashboard')) &&
                'is-active',
            ]"
            tabindex="0"
            role="button"
            to="/admin/dashboard"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:activity"
            />
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :class="[
              (route.path.startsWith('/admin/machine')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            role="button"
            to="/admin/machine"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:airplay"
            />
          </RouterLink>
        </li>
        <li
          :class="[activeMobileSubsidebar === 'error_codes' && 'is-active']"
          class="centered-link centered-link-toggle"
          tabindex="0"
          role="button"
          @keydown.space.prevent="activeMobileSubsidebar = 'error_codes'"
          @click="activeMobileSubsidebar = 'error_codes'"
        >
          <a>
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:x-circle"
            />
          </a>
        </li>
        <li
          :class="[activeMobileSubsidebar === 'tutorials' && 'is-active']"
          class="centered-link centered-link-toggle"
          tabindex="0"
          role="button"
          @keydown.space.prevent="activeMobileSubsidebar = 'tutorials'"
          @click="activeMobileSubsidebar = 'tutorials'"
        >
          <a>
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:archive"
            />
          </a>
        </li>
        <li
          :class="[activeMobileSubsidebar === 'settings' && 'is-active']"
          class="centered-link centered-link-toggle"
          tabindex="0"
          role="button"
          @keydown.space.prevent="activeMobileSubsidebar = 'settings'"
          @click="activeMobileSubsidebar = 'settings'"
        >
          <a>
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:cpu"
            />
          </a>
        </li>
      </template>

      <template #bottom-links>
        <li>
          <a
            tabindex="0"
            role="button"
            @keydown.space.prevent="panels.setActive('search')"
            @click="panels.setActive('search')"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:search"
            />
          </a>
        </li>
        <li>
          <a href="#">
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:settings"
            />
          </a>
        </li>
      </template>
    </MobileSidebar>

    <!-- Mobile subsidebar links -->
    <Transition name="slide-x">
      <ErrorCodesMobileSubsidebar
        v-if="isMobileSidebarOpen && activeMobileSubsidebar === 'error_codes'"
      />
      <TutorialsMobileSubsidebar
        v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'tutorials'"
      />
      <SettingsMobileSubsidebar
        v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'settings'"
      />
    </Transition>

    <!-- Desktop navigation -->
    <Navbar :theme="props.theme">
      <!-- Custom navbar title -->
      <template #title>
        <RouterLink
          to="/"
          class="brand"
        >
          <AnimatedLogo
            width="38px"
            height="38px"
          />
        </RouterLink>

        <div class="separator" />

        <ProjectsQuickDropdown />
        <h1 class="title is-5">
          {{ viewWrapper.pageTitle }}
        </h1>
      </template>

      <!-- Custom navbar toolbar -->
      <template #toolbar>
        <Toolbar class="desktop-toolbar">
          <ToolbarNotification />
        </Toolbar>

        <UserProfileDropdown right />
      </template>

      <!-- Custom navbar links -->
      <template #links>
        <div
          class="centered-links"
          :class="[activeSubnav === 'search' && 'is-hidden']"
        >
          <RouterLink
            :class="[
              (route.path.startsWith('/admin/dashboard')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            role="button"
            to="/admin/dashboard"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:activity"
            />
            <span>Dashboards</span>
          </RouterLink>
          <RouterLink
            :class="[
              (route.path.startsWith('/admin/machine')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            role="button"
            to="/admin/machine"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:airplay"
            />
            <span>Machine</span>
          </RouterLink>
          <a
            :class="[activeSubnav === 'error_codes' && 'is-active']"
            class="centered-link centered-link-toggle"
            tabindex="0"
            role="button"
            @keydown.space.prevent="toggleSubnav('error_codes')"
            @click="toggleSubnav('error_codes')"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:x-circle"
            />
            <span>Error Code</span>
          </a>
          <a
            :class="[activeSubnav === 'tutorials' && 'is-active']"
            class="centered-link centered-link-toggle"
            tabindex="0"
            role="button"
            @keydown.space.prevent="toggleSubnav('tutorials')"
            @click="toggleSubnav('tutorials')"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:archive"
            />
            <span>Archiev</span>
          </a>
          <a
            :class="[activeSubnav === 'settings' && 'is-active']"
            class="centered-link centered-link-toggle"
            tabindex="0"
            role="button"
            @keydown.space.prevent="toggleSubnav('settings')"
            @click="toggleSubnav('settings')"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:cpu"
            />
            <span>Settings</span>
          </a>
          <a
            class="centered-link centered-link-search"
            tabindex="0"
            role="button"
            @keydown.space.prevent="toggleSubnav('search')"
            @click="toggleSubnav('search')"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:search"
            />
            <span>Search</span>
          </a>
        </div>

        <div
          class="centered-search"
          :class="[activeSubnav !== 'search' && 'is-hidden']"
        >
          <div class="field">
            <div class="control has-icon">
              <input
                v-model="filter"
                type="text"
                class="input is-rounded search-input"
                placeholder="Search records..."
              >
              <div class="form-icon">
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:search"
                />
              </div>
              <div
                class="form-icon is-right"
                tabindex="0"
                role="button"
                @keydown.space.prevent="toggleSubnav('search')"
                @click="toggleSubnav('search')"
              >
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:x"
                />
              </div>
              <div
                v-if="filteredUsers.length > 0"
                class="search-results has-slimscroll is-active"
              >
                <div
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="search-result"
                >
                  <VAvatar v-bind="getAvatarData(user)" />
                  <div class="meta">
                    <span>{{ user.username }}</span>
                    <span>{{ user.position }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Custom navbar sub navigation -->
      <template #subnav>
        <div
          :class="[
            !(activeSubnav === 'closed' || activeSubnav === 'search') && 'is-active',
          ]"
          class="navbar-subnavbar"
        >
          <DashboardsSubnav :class="[activeSubnav === 'home' && 'is-active']" />
          <ErrorCodesSubnav :class="[activeSubnav === 'error_codes' && 'is-active']" />
          <TutorialsSubnav :class="[activeSubnav === 'tutorials' && 'is-active']" />
          <SettingsSubnav :class="[activeSubnav === 'settings' && 'is-active']" />
        </div>
      </template>
    </Navbar>

    <LanguagesPanel />
    <TaskPanel />

    <VViewWrapper top-nav>
      <VPageContentWrapper>
        <template v-if="props.nowrap">
          <slot />
        </template>
        <VPageContent
          v-else
          class="is-relative"
        >
          <div class="is-navbar-lg">
            <div class="page-title has-text-centered">
              <!-- Mobile Page Title -->
              <div class="title-wrap">
                <h1 class="title is-4">
                  {{ viewWrapper.pageTitle }}
                </h1>
              </div>

              <Toolbar class="mobile-toolbar">
                <ToolbarNotification />
              </Toolbar>
            </div>

            <slot />
          </div>
        </VPageContent>
      </VPageContentWrapper>
    </VViewWrapper>
  </div>
</template>
