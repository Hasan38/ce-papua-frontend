<script setup lang="ts">
import type { VFlexTableWrapperDataResolver } from '/@src/components/base/VFlexTableWrapper.vue'
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import type { Customer } from '/@src/models/customer'
import { useNotyf } from '/@src/composable/useNotyf'
import { useViewWrapper } from '/@src/stores/viewWrapper'
// the total data will be set by the fetchData function
const total = ref(0)
const componentKey = ref(0)
// we don't have to set "searchable" parameter
// this will be handled by the fetchData function
const modalEdit = ref(false)
const modalAdd = ref(false)
const modalDelete = ref(false)
// const url = import.meta.env.VITE_API_BASE_URL
const isLoading = ref(false)
const errors = ref({})
const name = ref('')
const notyf = useNotyf()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customers')
interface FormEmpresasProps {
  customer?: Customer

}
const props = withDefaults(defineProps<FormEmpresasProps>(), {
  customer: Object,
})

const isCustomer = ref(props.customer) ?? null

const columns = {
  name: {
    label: 'Name',
    media: true,
    grow: true,
    sortable: true,
  },

  actions: {
    label: '',
    align: 'end',
  },
} as const

// this is an example of useXxx function that we can reuse across components.
// it will return writable computeds that works like ref values
// but the values will be sync with the route query params
function useQueryParam() {
  const router = useRouter()
  const route = useRoute()

  // when the params match those value,
  // we don't set their value to the query params
  const defaultSearch = ''
  const defaultSort = ''
  const defaultLimit = 10
  const defaultPage = 1

  const searchTerm = computed({
    get: () => {
      let searchTermQuery: string

      // read "search" from the query params
      if (Array.isArray(route?.query?.search)) {
        searchTermQuery = route.query.search?.[0] ?? defaultSearch
      }
      else {
        searchTermQuery = route.query.search ?? defaultSearch
      }

      return searchTermQuery
    },
    set(value) {
      // update the route query params with our new "search" value.
      // we can use router.replace instead of router.push
      // to not write state to the browser history
      router.push({
        query: {
          search: value === defaultSearch ? undefined : value,
          sort: sort.value === defaultSort ? undefined : sort.value,
          limit: limit.value === defaultLimit ? undefined : limit.value,
          page: page.value === defaultPage ? undefined : page.value,
        },
      })
    },
  })

  const sort = computed({
    get: () => {
      let sortQuery: string

      // read "sort" from the query params
      if (Array.isArray(route?.query?.sort)) {
        sortQuery = route.query.sort?.[0] ?? defaultSort
      }
      else {
        sortQuery = route.query.sort ?? defaultSort
      }

      return sortQuery
    },
    set(value) {
      // update the route query params with our new "sort" value.
      // we can use router.replace instead of router.push
      // to not write state to the browser history
      router.push({
        query: {
          search: searchTerm.value === defaultSearch ? undefined : searchTerm.value,
          sort: value === defaultSort ? undefined : value,
          limit: limit.value === defaultLimit ? undefined : limit.value,
          page: page.value === defaultPage ? undefined : page.value,
        },
      })
    },
  })

  const limit = computed({
    get: () => {
      let limitQuery: number

      // read "limit" from the query params
      if (Array.isArray(route?.query?.limit)) {
        limitQuery = parseInt(route.query.limit[0] ?? `${defaultLimit}`)
      }
      else {
        limitQuery = parseInt(route.query.limit ?? `${defaultLimit}`)
      }

      if (Object.is(limitQuery, NaN)) {
        limitQuery = defaultLimit
      }

      return limitQuery
    },
    set(value) {
      // update the route query params with our new "limit" value.
      // we can use router.replace instead of router.push
      // to not write state to the browser history
      router.push({
        query: {
          search: searchTerm.value === defaultSearch ? undefined : searchTerm.value,
          sort: sort.value === defaultSort ? undefined : sort.value,
          limit: value === defaultLimit ? undefined : value,
          page: page.value === defaultPage ? undefined : page.value,
        },
      })
    },
  })

  const page = computed({
    get: () => {
      let pageQuery: number

      if (Array.isArray(route?.query?.page)) {
        pageQuery = parseInt(route.query.page[0] ?? `${defaultPage}`)
      }
      else {
        pageQuery = parseInt(route.query.page ?? `${defaultPage}`)
      }

      // read "page" from the query params
      if (Object.is(pageQuery, NaN)) {
        pageQuery = defaultPage
      }

      return pageQuery
    },
    set(value) {
      // update the route query params with our new "page" value.
      // we can use router.replace instead of router.push
      // to not write state to the browser history
      router.push({
        query: {
          search: searchTerm.value === defaultSearch ? undefined : searchTerm.value,
          sort: sort.value === defaultSort ? undefined : sort.value,
          limit: limit.value === defaultLimit ? undefined : limit.value,
          page: value === defaultPage ? undefined : value,
        },
      })
    },
  })

  return reactive({
    searchTerm,
    sort,
    limit,
    page,
  })
}
const queryParam = useQueryParam()

// the fetchData function will be called each time one of the parameter changes
const $fetch = useLaravelFetch()
const fetchData: VFlexTableWrapperDataResolver = async ({
  searchTerm,
  limit,
  controller,
}) => {
  // sort will be a string like "name:asc"

  // async fetch data to our server
  const { _data: data } = await $fetch.raw(`/api/customer`, {
    query: {
      // searchTerm will contains the value of the wrapperState.searchInput
      // the update will be debounced to avoid to much requests
      q: searchTerm,
      page: queryParam.page,
      limit: limit,
    },
    // controller is an instance of AbortController,
    // this allow to abort the request when the state
    // is invalidated (before fetchData will be retriggered)
    signal: controller?.signal,
  })

  // our backend send us the count in the headers,
  // but we can also get it from another request

  total.value = data.data?.total

  // the return of the function must be an array
  return data.data?.data
}

function addAdd() {
  errors.value = {}
  name.value = ''
  modalAdd.value = true
}

function addEdit(row: any) {
  errors.value = {}
  modalEdit.value = true
  isCustomer.value = row
}

function addDelete(row: any) {
  modalDelete.value = true
  isCustomer.value = row
}

const onAdd = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch.raw(`/api/customer`, { method: 'POST', body: {
      name: name.value,

    } }).then(() => {
      isLoading.value = false
      componentKey.value += 1
      modalAdd.value = false
    })
  }
  catch ($e: any) {
    isLoading.value = false
    if ($e.status === 422) {
      errors.value = $e.data.errors
    }
  }
}

const onEdit = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch.raw(`/api/customer/${isCustomer.value.id}`, { method: 'PUT', body: {
      name: isCustomer.value.name,
    } }).then(() => {
      isLoading.value = false
      componentKey.value += 1
      modalEdit.value = false
    })
  }
  catch ($e: any) {
    isLoading.value = false
    if ($e.status === 422) {
      errors.value = $e.data.errors
    }
  }
}

const onDelete = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch.raw(`/api/customer/${isCustomer.value.id}`, { method: 'DELETE' }).then(() => {
      isLoading.value = false
      componentKey.value += 1
      modalDelete.value = false
    })
  }
  catch ($e: any) {
    isLoading.value = false
    notyf.error($e)
  }
}

useHead({
  title: 'Data Customer',
})

</script>

<template>
  <!--
    We use v-model to let VFlexTableWrapper update queryParam
  -->
  <div>
    <VFlexTableWrapper
      :key="componentKey"
      v-model:page="queryParam.page"
      v-model:limit="queryParam.limit"
      v-model:searchTerm="queryParam.searchTerm"
      v-model:sort="queryParam.sort"
      :columns="columns"
      :data="fetchData"
      :total="total"
      class="mt-4"
    >
      <!--
      Here we retrieve the internal wrapperState.
      Note that we can not destructure it
    -->
      <template #default="wrapperState">
        <!--Table Pagination-->
        <VFlexPagination
          v-model:current-page="wrapperState.page"
          :item-per-page="wrapperState.limit!!"
          :total-items="total"
          :max-links-displayed="2"
          no-router
        >
          <!-- The controls can be updated anywhere in the slot -->
          <template #before-pagination>
            <VFlex class="mr-4">
              <VField>
                <VControl icon="feather:search">
                  <input
                    v-model="wrapperState.searchInput"
                    type="text"
                    class="input is-rounded"
                    placeholder="Filter..."
                  >
                </VControl>
              </VField>
            </VFlex>
          </template>

          <template #before-navigation>
            <VButton
              color="primary"
              class="mr-2"
              rounded
              icon="fas fa-plus"
              @click="addAdd"
            >
              Add
            </VButton>
            <VFlex class="mr-4">
              <VField>
                <VControl>
                  <div class="select is-rounded">
                    <select v-model="wrapperState.limit">
                      <option :value="1">
                        1 results per page
                      </option>
                      <option :value="10">
                        10 results per page
                      </option>
                      <option :value="15">
                        15 results per page
                      </option>
                      <option :value="25">
                        25 results per page
                      </option>
                      <option :value="50">
                        50 results per page
                      </option>
                    </select>
                  </div>
                </VControl>
              </VField>
            </VFlex>
          </template>
        </VFlexPagination>

        <VFlexTable
          rounded
          clickable
        >
          <template #body>
            <!--
            The wrapperState.loading will be update
            when the fetchData function is running
          -->
            <div v-if="wrapperState.loading" class="flex-list-inner">
              <div
                v-for="key in wrapperState.limit"
                :key="key"
                class="flex-table-item"
              >
                <VFlexTableCell :column="{ grow: true, media: true }">
                  <VPlaceloadAvatar size="medium" />

                  <VPlaceloadText
                    :lines="2"
                    width="60%"
                    last-line-width="20%"
                    class="mx-2"
                  />
                </VFlexTableCell>
                <VFlexTableCell>
                  <VPlaceload width="60%" class="mx-1" />
                </VFlexTableCell>
                <VFlexTableCell>
                  <VPlaceload width="60%" class="mx-1" />
                </VFlexTableCell>
                <VFlexTableCell :column="{ align: 'end' }">
                  <VPlaceload width="45%" class="mx-1" />
                </VFlexTableCell>
              </div>
            </div>

            <!-- This is the empty state -->
            <div v-else-if="wrapperState.data?.length === 0" class="flex-list-inner">
              <VPlaceholderSection
                title="No matches"
                subtitle="There is no data that match your query."
                class="my-6"
              >
                <template #image>
                  <img
                    class="light-image"
                    src="/@src/assets/illustrations/placeholders/search-4.svg"
                    alt=""
                  >
                  <img
                    class="dark-image"
                    src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
                    alt=""
                  >
                </template>
              </VPlaceholderSection>
            </div>
          </template>

          <!-- This is the body cell slot -->
          <template #body-cell="{ row, column }">
            <template v-if="column.key === 'name'">
              <VAvatar
                size="medium"
                picture=""
              />
              <div>
                <span class="dark-text">{{ row?.name }}</span>
              </div>
            </template>

            <template v-if="column.key === 'actions'">
              <VButtons>
                <VIconButton
                  color="success"
                  icon="feather:edit"
                  circle
                  @click="addEdit(row)"
                />
                <VIconButton
                  color="primary"
                  icon="feather:trash"
                  circle
                  @click="addDelete(row)"
                />
              </VButtons>
            </template>
          </template>
        </VFlexTable>

        <!--Table Pagination-->
        <VFlexPagination
          v-model:current-page="wrapperState.page"
          class="mt-5"
          :item-per-page="wrapperState.limit!!"
          :total-items="total!!"
          :max-links-displayed="2"
          no-router
        />
      </template>
    </VFlexTableWrapper>

    <VModal
      is="form"
      :open="modalAdd"
      title=""
      size="small"
      actions="center"
      @submit.prevent="onAdd"
      @close="modalAdd = false"
    >
      <template #content>
        <VField
          label="Customer Name"
        >
          <VControl fullwidth>
            <VInput
              v-model="name"
              placeholder="BANK BCA..."
              autocomplete="off"
              autocapitalize="off"
              spellcheck="true"
            />
            <p v-if="errors?.name" class="help is-danger">
              {{ errors?.name }}
            </p>
          </VControl>
        </VField>
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
    <VModal
      is="form"
      :open="modalEdit"
      title=""
      size="small"
      actions="center"
      @submit.prevent="onEdit"
      @close="modalEdit = false"
    >
      <template #content>
        <VField

          label="Customer Name"
        >
          <VControl fullwidth>
            <VInput
              v-model="isCustomer.name"
              placeholder="Bank BCA..."
              autocomplete="off"
              autocapitalize="off"
              spellcheck="true"
            />
            <p v-if="errors?.name" class="help is-danger">
              {{ errors?.name }}
            </p>
          </VControl>
        </VField>
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
    <VModal
      is="form"
      :open="modalDelete"
      title=""
      size="small"
      actions="center"
      @submit.prevent="onDelete"
      @close="modalDelete = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="field">
            <VPlaceholderSection
              title="Are you sure you want to delete this?"
              :subtitle="isCustomer.name"
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
