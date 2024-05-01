<script setup lang="ts">
type TabId = 'general' | 'machine'
const activeTab = ref<TabId>('general')
</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper">
    <div class="tabs-inner">
      <div class="tabs is-centered is-4">
        <ul>
          <li :class="[activeTab === 'general' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'general'"
              @click="activeTab = 'general'"
            >General</a>
          </li>
          <li :class="[activeTab === 'machine' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'machine'"
              @click="activeTab = 'machine'"
            >Machine</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div
        v-if="activeTab === 'general'"
        class="tab-content is-active"
      >
        <div class="tab-content-inner">
          <div class="center">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">
                  Regional
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/admin/setting/region">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-home"
                      />
                      <span>Region</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/admin/setting/area">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-text-format"
                      />
                      <span>Area Group</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                </ul>
              </div>

              <div class="column is-3">
                <h4 class="column-heading">
                  User
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/admin/setting/user">
                      <span>Data User</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:user"
                      />
                    </RouterLink>
                  </li>
                </ul>
              </div>

              <div class="column is-3">
                <h4 class="column-heading">
                  Customer
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/admin/setting/customer">
                      <span>Data Customer</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                </ul>
              </div>

              <div class="column is-3">
                <a
                  href=""
                  class="column-placeholder"
                >
                  <img
                    class="light-image"
                    src="/images/icons/misc/buoy.svg"
                    alt=""
                  >
                  <img
                    class="dark-image"
                    src="/images/icons/misc/buoy-dark.svg"
                    alt=""
                  >
                  <h3>Support</h3>
                </a>
                <a
                  href=""
                  class="column-placeholder"
                >
                  <img
                    class="light-image"
                    src="/images/icons/misc/docs.svg"
                    alt=""
                  >
                  <img
                    class="dark-image"
                    src="/images/icons/misc/docs-dark.svg"
                    alt=""
                  >
                  <h3>Documentation</h3>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="activeTab === 'machine'"
        class="tab-content is-active"
      >
        <div class="tab-content-inner">
          <div class="center">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">
                  General
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/admin/setting/machine">
                      <span>Data <small>Machine</small></span>
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

              <div class="column is-3">
                <h4 class="column-heading">
                  Error Code
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/admin/error_code/cml">
                      <span>Error Code By TS</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/admin/error_code/cml">
                      <span>CE Papua</span>
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
