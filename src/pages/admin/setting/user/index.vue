<script setup lang="ts">
import type { User } from '/@src/models/users'
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useNotyf } from '/@src/composable/useNotyf'
import { useUserSession } from '/@src/stores/userSession'
export interface UserResponse {
  success: boolean
  data: {
    current_page: number
    data: User[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    total: number
  }
}

interface FormEmpresasProps {
  users?: User

}
const props = withDefaults(defineProps<FormEmpresasProps>(), {
  users: Object,
})

const userSession = useUserSession()
const notyf = useNotyf()
const isUser = ref(props.users) ?? null
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Data User')
const route = useRoute()
const userData = ref<User[]>()
const useRes = ref<UserResponse>()
const modalDelete = ref(false)
const currentPage = computed(() => {
  try {
    return Number.parseInt(route.query.page as string) || 1
  }
  catch { 0 }
  return 1
})
const filters = ref('')
const total = ref()
const $fetch = useLaravelFetch()
const isLoading = ref(false)
async function getUser() {
  isLoading.value = true
  try {
    const { _data: data } = await $fetch.raw<UserResponse>('/api/users', {
      query: {
        q: filters.value,
        page: currentPage.value,
        limit: 10,

      },
      method: 'GET',
      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    }) // we know that our api respond with an array of Article
    userData.value = data?.data.data
    useRes.value = data
    total.value = data?.data.total
    isLoading.value = false
  }
  catch (error) {
    isLoading.value = false
    console.error(error)
  }
}

watchEffect(getUser)

useHead({
  title: 'Data User',
})

function onDelete(row: any) {
  isUser.value = row
  modalDelete.value = true
}

const deleteUser = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch.raw(`/api/users/${isUser.value.id}`, { method: 'DELETE' }).then(() => {
      isLoading.value = false
      getUser()
      modalDelete.value = false
    })
  }
  catch ($e: any) {
    isLoading.value = false
    notyf.error($e)
  }
}
</script>

<template>
  <div>
    <div class="datatable-toolbar">
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          >
        </VControl>
      </VField>

      <VButtons>
        <VButton
          v-if="userSession.user?.roles[0].name === 'admin'"
          color="primary"
          to="/admin/setting/user/add"
          icon="fas fa-plus"
          elevated
        >
          Add User
        </VButton>
      </VButtons>
    </div>
    <div class="datatable-wrapper">
      <div class="table-container">
        <table class="table datatable-table is-fullwidth">
          <thead>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Area Group</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr
              v-for="user in userData"
              :key="user.id"
            >
              <td>
                <div class="flex-media">
                  <VAvatar
                    :picture="user.avatar"
                    alt="Avatar"
                  />
                  <div class="meta">
                    <h3>{{ user.name }}</h3>
                    <span>{{ user.nip }}/{{ user.roles[0].name }}</span>
                  </div>
                </div>
              </td>
              <td>{{ user.phone }}</td>
              <td>{{ user.email }}</td>
              <td>
                <div class="flex-media">
                  <div class="meta">
                    <h3>{{ user.area_groups.name }}</h3>
                    <span>{{ user.area_groups.regionals.name }}</span>
                  </div>
                </div>
              </td>
              <td>
                <VButtons v-if="userSession.user?.roles[0].name === 'admin'">
                  <RouterLink
                    :to="`/admin/setting/user/${user.id}`"
                  >
                    <VIconButton
                      color="success"
                      icon="feather:edit"
                      circle
                    />
                  </RouterLink>

                  <VIconButton
                    color="primary"
                    icon="feather:trash"
                    circle
                    @click="onDelete(user)"
                  />
                </VButtons>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <VPlaceholderPage
        v-if="useRes?.data.data.length === 0"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the search terms
            you've entered. Please try different search terms or criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-7.svg"
            alt=""
          >
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-7-dark.svg"
            alt=""
          >
        </template>
      </VPlaceholderPage>
    </div>

    <!--Table Pagination-->
    <VFlexPagination
      v-if="useRes?.data.data.length!! > 0"
      v-model:current-page="currentPage"
      :item-per-page="10"
      :total-items="total"
      :max-links-displayed="5"
      no-router
      class="mt-4"
      @update:current-page="getUser"
    />
    <VModal
      is="form"
      :open="modalDelete"
      title=""
      size="small"
      actions="center"
      @submit.prevent="deleteUser"
      @close="modalDelete = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="field">
            <VPlaceholderSection
              title="Are you sure you want to delete this?"
              :subtitle="isUser.name"
            />
          </div>
        </div>
      </template>
      <template #action>
        <VButton
          color="primary"
          :loading="isLoading"
          type="submit"
        >
          Confirm
        </VButton>
      </template>
    </VModal>
  </div>
</template>

<style lang="scss" scoped>
.is-navbar {
  .datatable-toolbar {
    padding-top: 30px;
  }
}

.datatable-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &.is-reversed {
    flex-direction: row-reverse;
  }

  .field {
    margin-bottom: 0;

    .control {
      .button {
        color: var(--light-text);

        &:hover,
        &:focus {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--primary--color-invert);
        }
      }
    }
  }

  .buttons {
    margin-left: auto;
    margin-bottom: 0;

    .v-button {
      margin-bottom: 0;
    }
  }
}

.is-dark {
  .datatable-toolbar {
    .field {
      .control {
        .button {
          background: var(--dark-sidebar) !important;
          color: var(--light-text);

          &:hover,
          &:focus {
            background: var(--primary) !important;
            border-color: var(--primary) !important;
            color: var(--smoke-white) !important;
          }
        }
      }
    }
  }
}

.datatable-wrapper {
  width: 100%;

  .datatable-container {
    background: var(--white);
    border: none !important;
    overflow-x: auto;

    .table,
    table {
      width: 100%;
    }

    &::-webkit-scrollbar {
      height: 8px !important;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px !important;
      background: rgb(0 0 0 / 20%) !important;
    }
  }
}

.datatable-table {
  border: 1px solid var(--fade-grey);
  border-collapse: collapse;
  border-radius: 0.75rem;

  th {
    padding: 16px 20px;
    font-family: var(--font-alt);
    font-size: 0.8rem;
    color: var(--dark-text);
    text-transform: uppercase;
    border: 1px solid var(--fade-grey);
    font-weight: 600;

    &:last-child {
      text-align: right;
    }
  }

  td {
    font-family: var(--font);
    vertical-align: middle;
    padding: 12px 20px;
    border-bottom: 1px solid var(--fade-grey);

    &:last-child {
      text-align: right;
    }

    &.datatables-empty {
      opacity: 0;
    }
  }

  .light-text {
    color: var(--light-text);
  }

  .flex-media {
    display: flex;
    align-items: center;

    .meta {
      margin-left: 10px;
      line-height: 1.3;

      span {
        display: block;
        font-size: 0.8rem;
        color: var(--light-text);
        font-family: var(--font);

        &:first-child {
          font-family: var(--font-alt);
          color: var(--dark-text);
        }
      }
    }
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
  }

  .checkbox {
    padding: 0;
  }

  .product-photo {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .file-icon {
    width: 46px;
    height: 46px;
    object-fit: contain;
  }

  .drinks-icon {
    display: block;
    max-width: 48px;
    border-radius: var(--radius-rounded);
    border: 1px solid var(--fade-grey);
  }

  .negative-icon,
  .positive-icon {
    svg {
      height: 16px;
      width: 16px;
    }
  }

  .positive-icon {
    .iconify {
      color: var(--success);

      * {
        stroke-width: 4px;
      }
    }
  }

  .negative-icon {
    &.is-danger {
      .iconify {
        color: var(--danger) !important;
      }
    }

    .iconify {
      color: var(--light-text);

      * {
        stroke-width: 4px;
      }
    }
  }

  .price {
    color: var(--dark-text);
    font-weight: 500;

    &::before {
      content: '$';
    }

    &.price-free {
      color: var(--light-text);
    }
  }

  .status {
    display: flex;
    align-items: center;

    &.is-available {
      i {
        color: var(--success);
      }
    }

    &.is-busy {
      i {
        color: var(--danger);
      }
    }

    &.is-offline {
      i {
        color: var(--light-text);
      }
    }

    i {
      margin-right: 8px;
      font-size: 8px;
    }

    span {
      font-family: var(--font);
      font-size: 0.9rem;
      color: var(--light-text);
    }
  }
}

.is-dark {
  .datatable-wrapper {
    .datatable-container {
      border-color: var(--dark-sidebar-light-12);
      background: var(--dark-sidebar-light-6);
    }
  }

  .datatable-table {
    border-color: var(--dark-sidebar-light-12);

    th,
    td {
      border-color: var(--dark-sidebar-light-12);
      color: var(--dark-dark-text);
    }

    .drinks-icon {
      border-color: var(--dark-sidebar-light-12);
    }
  }
}
</style>
