<template>
  <div class="mobile-subsidebar is-activity">
    <div class="inner">
      <div class="sidebar-title">
        <h3>Settings</h3>
      </div>

      <ul class="submenu">
        <VCollapseLinks>
          <template #header>
            Regional
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
            to="/admin/setting/region"
            class="is-submenu"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:circle"
            />
            Regional
          </RouterLink>
          <RouterLink
            to="/admin/setting/area"
            class="is-submenu"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:circle"
            />
            Area Group
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks>
          <template #header>
            User
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
            to="/admin/setting/user"
            class="is-submenu"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:circle"
            />
            Data User
          </RouterLink>
        </VCollapseLinks>

        <VCollapseLinks>
          <template #header>
            Customer
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
            to="/admin/setting/customer"
            class="is-submenu"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:circle"
            />
            Data Customer
          </RouterLink>
        </VCollapseLinks>
        <VCollapseLinks>
          <template #header>
            Machine
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
            to="/admin/setting/machine"
            class="is-submenu"
          >
            <i
              aria-hidden="true"
              class="iconify"
              data-icon="feather:circle"
            />
            Data Machine
          </RouterLink>
        </VCollapseLinks>
      </ul>
      <div class="bottom-action" />
    </div>
  </div>
</template>
