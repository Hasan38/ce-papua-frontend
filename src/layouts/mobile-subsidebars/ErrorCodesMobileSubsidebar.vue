<template>
  <div class="mobile-subsidebar">
    <div class="inner">
      <div class="sidebar-title">
        <h3>EC</h3>
      </div>

      <ul
        class="submenu"
        data-simplebar
      >
        <VCollapseLinks>
          <template #header>
            Error Code
            <i
              aria-hidden="true"
              class="iconify rtl-hidden"
              data-icon="feather:chevron-right"
            />
            <i
              aria-hidden="true"
              class="iconify ltr-hidden"
              data-icon="feather:chevron-left"
            />
          </template>

          <RouterLink
            to="/admin/error_code/search"
            class="is-submenu"
          >
            <i
              aria-hidden="true"
              class="lnil lnil-search"
            />
            <span>Search EC</span>
          </RouterLink>
        </VCollapseLinks>

        <VCollapseLinks>
          <template #header>
            CML
            <i
              aria-hidden="true"
              class="iconify rtl-hidden"
              data-icon="feather:chevron-right"
            />
            <i
              aria-hidden="true"
              class="iconify ltr-hidden"
              data-icon="feather:chevron-left"
            />
          </template>

          <RouterLink
            to="/admin/error_code/cml"
            class="is-submenu"
          >
            <i
              aria-hidden="true"
              class="lnil lnil-analytics-alt-1"
            />
            <span>Data CML</span>
          </RouterLink>
        </VCollapseLinks>
      </ul>
    </div>
  </div>
</template>
