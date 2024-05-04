<script setup lang="ts">
type TabId = 'tutorial'
const activeTab = ref<TabId>('tutorial')
</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper">
    <div class="tabs-inner">
      <div class="tabs is-centered is-4">
        <ul>
          <li :class="[activeTab === 'tutorial' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'tutorial'"
              @click="activeTab = 'tutorial'"
            >Tutorial</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div
        v-if="activeTab === 'tutorial'"
        class="tab-content is-active"
      >
        <div class="tab-content-inner">
          <div class="center">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">
                  Tutorial
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/admin/tutorial/text">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-search"
                      />
                      <span>Text & File</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/admin/tutorial/video">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-video-alt-1"
                      />
                      <span>Video</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/layout/navbar';
@import '/@src/scss/layout/responsive';
</style>
