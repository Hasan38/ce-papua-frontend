<script setup lang="ts">
type TabId = 'search' | 'cml'
const activeTab = ref<TabId>('search')
</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper">
    <div class="tabs-inner">
      <div class="tabs is-centered is-4">
        <ul>
          <li :class="[activeTab === 'search' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'search'"
              @click="activeTab = 'search'"
            >Serach Error Code</a>
          </li>
          <li :class="[activeTab === 'cml' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'cml'"
              @click="activeTab = 'cml'"
            >CML</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div
        v-if="activeTab === 'search'"
        class="tab-content is-active"
      >
        <div class="tab-content-inner">
          <div class="center">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">
                  Error Code
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/admin/error_code/search">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-search"
                      />
                      <span>Search Error Code</span>
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

      <div
        v-if="activeTab === 'cml'"
        class="tab-content is-active"
      >
        <div class="tab-content-inner">
          <div class="center">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">
                  CML
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/admin/error_code/cml">
                      <span>Data <small>CML</small></span>
                      <VTag
                        label="v2.0"
                        color="primary"
                        outlined
                        curved
                      />
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
