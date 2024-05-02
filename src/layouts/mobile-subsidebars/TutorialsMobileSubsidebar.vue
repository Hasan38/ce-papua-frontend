<template>
  <div class="mobile-subsidebar is-activity">
    <div class="inner">
      <div class="sidebar-title">
        <h3>Archiev</h3>
      </div>

      <ul class="submenu">
        <VCollapseLinks>
          <template #header>
            Tutorial
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
            to="/admin/tutorial/text"
            class="is-submenu"
          >
            <i
              aria-hidden="true"
              class="lnil lnil-analytics-alt-1"
            />
            <span>Text</span>
          </RouterLink>
          <RouterLink
            to="/admin/tutorial/video"
            class="is-submenu"
          >
            <i
              aria-hidden="true"
              class="lnil lnil-analytics-alt-1"
            />
            <span>Video</span>
          </RouterLink>
        </VCollapseLinks>
      </ul>
    </div>
  </div>
</template>
