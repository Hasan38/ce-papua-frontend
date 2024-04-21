<script setup lang="ts">
type TabId = 'machine' | 'utility'
const activeTab = ref<TabId>('machine')
</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper">
    <div class="tabs-inner">
      <div class="tabs is-centered is-4">
        <ul>
          <li :class="[activeTab === 'machine' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'machine'"
              @click="activeTab = 'machine'"
            >Machine</a>
          </li>

          <li :class="[activeTab === 'utility' && 'is-active']">
            <a
              tabindex="0"
              role="button"
              @keydown.space.prevent="activeTab = 'utility'"
              @click="activeTab = 'utility'"
            >Utility</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div
        id="list-pages-tab"
        class="tab-content"
        :class="[activeTab === 'machine' && 'is-active']"
      >
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">
                  Machine
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/admin/machine">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-list-alt"
                      />
                      <span>List Machine</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/list-view-2">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-list-alt"
                      />
                      <span>List View V2</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/list-view-3">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-list-alt"
                      />
                      <span>List View V3</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/list-view-4">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-list-alt"
                      />
                      <span>List View V4</span>
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
                  Flex Lists
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/layouts/list-flex-1">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-list-alt-1"
                      />
                      <span>Flex List V1</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/list-flex-2">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-list-alt-1"
                      />
                      <span>Flex List V2</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/list-flex-3">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-list-alt-1"
                      />
                      <span>Flex List V3</span>
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
                  Datatables
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/layouts/list-datatable-1">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-layout-alt"
                      />
                      <span>Table List V1</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/list-datatable-2">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-layout-alt"
                      />
                      <span>Table List V2</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/list-datatable-3">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-layout-alt"
                      />
                      <span>Table List V3</span>
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
                  href="https://cssninja.io"
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
                  href="https://docs.cssninja.io/vuero"
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
        id="utility-pages-tab"
        class="tab-content"
        :class="[activeTab === 'utility' && 'is-active']"
      >
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">
                  Utility
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/layouts/utility-account-confirm">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-thunderbolt"
                      />
                      <span>Confirm Account</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/utility-promotion">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-magnet"
                      />
                      <span>Promotion Page</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/utility-invoice">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-calculator-alt"
                      />
                      <span>Invoice</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/status">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-checkmark-circle"
                      />
                      <span>App Status</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/roadmap">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-pyramids"
                      />
                      <span>Roadmap</span>
                      <VTag
                        label="v2.4"
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
                  Onboarding
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/layouts/onboarding-page-1">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-train"
                      />
                      <span>Onboarding V1</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/onboarding-page-2">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-train-alt"
                      />
                      <span>Onboarding V2</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/onboarding-page-3">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-car"
                      />
                      <span>Onboarding V3</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/onboarding-page-4">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-car-alt"
                      />
                      <span>Onboarding V4</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/onboarding-page-5">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-train-alt"
                      />
                      <span>Onboarding V5</span>
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
                  Error
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/error/page-1">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-cross-circle"
                      />
                      <span>Error Page V1</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/error/page-2">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-cross-circle"
                      />
                      <span>Error Page V2</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/error/page-3">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-cross-circle"
                      />
                      <span>Error Page V3</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/error/page-4">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-cross-circle"
                      />
                      <span>Error Page V4</span>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:circle"
                      />
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/error/page-5">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-cross-circle"
                      />
                      <span>Error Page V5</span>
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
                  Placeload
                </h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/layouts/placeload-1">
                      <i
                        aria-hidden="true"
                        class="lnil lnil lnil-reload"
                      />
                      <span>Placeload V1</span>
                      <VTag
                        label="v1.2"
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
                  <li>
                    <RouterLink to="/navbar/layouts/placeload-2">
                      <i
                        aria-hidden="true"
                        class="lnil lnil lnil-reload"
                      />
                      <span>Placeload V2</span>
                      <VTag
                        label="v1.2"
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
                  <li>
                    <RouterLink to="/navbar/layouts/placeload-3">
                      <i
                        aria-hidden="true"
                        class="lnil lnil lnil-reload"
                      />
                      <span>Placeload V3</span>
                      <VTag
                        label="v1.2"
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
                  <li>
                    <RouterLink to="/navbar/layouts/placeload-4">
                      <i
                        aria-hidden="true"
                        class="lnil lnil lnil-reload"
                      />
                      <span>Placeload V4</span>
                      <VTag
                        label="v1.2"
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
@import '/@src/scss/abstracts/mixins';
@import '/@src/scss/layout/navbar';
@import '/@src/scss/layout/responsive';
</style>
