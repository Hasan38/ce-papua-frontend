<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import type { Machine, MachineResponse } from '/@src/models/machine'
// import { useNotyf } from '/@src/composable/useNotyf'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useUserSession } from '/@src/stores/userSession'
// the total data will be set by the fetchData function
const total = ref(0)
const $fetch = useLaravelFetch()
const route = useRoute()
const userSession = useUserSession()
const errors = ref<any>({})
const modalDelete = ref(false)
// const url = import.meta.env.VITE_API_BASE_URL
const isLoading = ref(false)
const machineData = ref<Machine[]>()
const router = useRouter()
const next = ref('')
const viewWrapper = useViewWrapper()
const filters = ref('')
viewWrapper.setPageTitle('Machines')
interface FormEmpresasProps {
  machine?: Machine

}
const props = withDefaults(defineProps<FormEmpresasProps>(), {
  machine: Object,
})

const isMachine = ref(props.machine) ?? null

const debouncedFilter = useDebounce(filters, 500)
const currentPage = computed(() => {
  try {
    return Number.parseInt(route.query.page as string) || 1
  }
  catch {
    // do nothing
  }
  return 1
})

async function getMachine() {
  isLoading.value = true
  if (debouncedFilter.value) {
    await $fetch.raw<MachineResponse>('/api/machine', {
      query: {
        q: debouncedFilter.value,
        page: 0,
        limit: 10,
      },
      method: 'GET',

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    }).then((res) => {
      isLoading.value = false
      machineData.value = res._data?.data.data
      total.value = res._data?.data.total ?? 0
      next.value = res._data?.data.next_page_url ?? ''
    }).catch (() => {
      isLoading.value = false
    })
  }
  else {
    await $fetch.raw<MachineResponse>('/api/machine', {
      query: {
        q: debouncedFilter.value,
        page: currentPage.value,
        limit: 10,
      },
      method: 'GET',

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    }).then((res) => {
      isLoading.value = false
      machineData.value = res._data?.data.data
      total.value = res._data?.data.total ?? 0
      next.value = res._data?.data.next_page_url ?? ''
    }).catch (() => {
      isLoading.value = false
    })
  }
}
watchEffect(getMachine)

function addDelete(row: any) {
  modalDelete.value = true
  isMachine.value = row
}

const onDelete = async () => {
  if (isLoading.value) return
  isLoading.value = true

  await $fetch.raw(`/api/machine/${isMachine.value.id}`, { method: 'DELETE' }).then(() => {
    isLoading.value = false
    getMachine()
    modalDelete.value = false
  }).catch((e) => {
    isLoading.value = false
    if (e.status === 422) {
      errors.value = e.data.errors
    }
  })
}

useHead({
  title: 'Data Machines',
})

function addMachine() {
  router.push('/admin/setting/machine/add')
}

</script>

<template>
  <!--
    We use v-model to let VFlexTableWrapper update queryParam
  -->
  <div>
    <div class="list-view-toolbar">
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          >
        </VControl>
      </VField>
      <div class="tabs-inner">
        <VButton
          v-if="userSession.user?.roles[0].name !== 'guest'"
          color="primary"
          class="mr-2"
          rounded
          icon="fas fa-plus"
          @click="addMachine"
        >
          Add
        </VButton>
      </div>
    </div>

    <div class="page-content-inner">
      <!--List-->
      <div class="list-view list-view-v2">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          :class="[machineData?.length !== 0 && 'is-hidden']"
          title="We couldn't find any matching results."
          subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
          larger
        >
          <template #image>
            <img
              class="light-image"
              src="/@src/assets/illustrations/placeholders/search-2.svg"
              alt=""
            >
            <img
              class="dark-image"
              src="/@src/assets/illustrations/placeholders/search-2-dark.svg"
              alt=""
            >
          </template>
        </VPlaceholderPage>

        <!--Active Tab-->
        <div
          id="active-items-tab"
          class="tab-content is-active"
        >
          <div v-if="isLoading" class="list-view-inner">
            <div
              v-for="key in 10"
              :key="key"
              class="list-view-item"
            >
              <VPlaceloadWrap>
                <VPlaceloadAvatar size="medium" />

                <VPlaceloadText
                  last-line-width="60%"
                  class="mx-2"
                />
                <VPlaceload
                  class="mx-2"
                  disabled
                />
                <VPlaceload class="mx-2 h-hidden-tablet-p" />
                <VPlaceload class="mx-2 h-hidden-tablet-p" />
                <VPlaceload class="mx-2" />
              </VPlaceloadWrap>
            </div>
          </div>
          <div v-else class="list-view-inner">
            <TransitionGroup

              name="list-complete"
              tag="div"
            >
              <div
                v-for="item in machineData"
                :key="item.id"
                class="list-view-item"
              >
                <div class="list-view-item-inner">
                  <img
                    src="/images/mesin/mesin.jpg"
                    alt=""
                  >
                  <div class="meta-left">
                    <h3>
                      <span>{{ item.terminal_id }}</span>
                    </h3>
                    <p>
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:map-pin"
                      />
                      <span>{{ item.address }}</span>
                    </p>
                    <span>
                      <span>
                        {{
                          item.customers.name
                        }}
                      </span>
                      <i
                        aria-hidden="true"
                        class="fas fa-circle icon-separator"
                      />
                      <span>

                        {{ item.sn }}

                      </span>
                      <i
                        aria-hidden="true"
                        class="fas fa-circle icon-separator"
                      />
                      <span>
                        {{
                          item.branch }}
                      </span>
                    </span>

                    <div class="icon-list">
                      <span>
                        <i
                          aria-hidden="true"
                          class="lnil lnil-car"
                        />
                        <span>{{ item.area_groups.name }}</span>
                      </span>
                      <span>
                        <i
                          aria-hidden="true"
                          class="lnil lnil-map"
                        />
                        <span>ZONA {{ item.zona }}</span>
                      </span>
                      <span>
                        <i
                          aria-hidden="true"
                          class="lnil lnil-air-flow"
                        />
                        <span>{{ item.pengelola }}</span>
                      </span>
                    </div>
                  </div>
                  <div class="meta-right">
                    <div class="buttons">
                      <VButton light :to="`/admin/setting/machine/${item.id}`">
                        Edit
                      </VButton>
                      <VButton
                        color="primary"
                        raised

                        @click="addDelete(item)"
                      >
                        Delete
                      </VButton>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <VFlexPagination
            v-if="machineData?.length !== 0"
            :current-page.async="currentPage"
            :item-per-page="10"
            :total-items="(total as number) ?? 0"
            :max-links-displayed="4"
            @update:current-page="getMachine"
          />
        </div>
      </div>
    </div>
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
              :subtitle="isMachine.terminal_id"
            />
            <VMessage v-if="errors.message" color="danger">
              {{ errors.message }}
            </VMessage>
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

<style lang="scss">
@import '/@src/scss/abstracts/all';

.list-view-v2 {
  .list-view-item {
    @include vuero-s-card;

    margin-bottom: 16px;
    padding: 16px;

    &:hover,
    &:focus {
      box-shadow: var(--light-box-shadow);
    }

    .list-view-item-inner {
      display: flex;

      > img {
        display: block;
        min-height: 130px;
        max-height: 130px;
        min-width: 190px;
        max-width: 190px;
        object-fit: cover;
        border-radius: var(--radius);
      }

      .meta-left {
        display: flex;
        flex-direction: column;
        margin-inline-start: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1.1rem;
          line-height: 1.5;

          .rating {
            margin-inline-start: 12px;

            i {
              font-size: 12px;
            }
          }
        }

        p {
          font-size: 0.95rem;
          color: var(--light-text);

          svg {
            height: 12px;
            width: 12px;
          }
        }

        > span {
          display: flex;
          align-items: center;
          margin-top: 10px;
          font-family: var(--font);
          font-size: 0.9rem;
          color: var(--primary);

          .icon-separator {
            font-size: 5px;
            color: var(--light-text);
            padding: 0 10px;
          }
        }

        .icon-list {
          margin-top: auto;
          display: flex;

          > span {
            display: flex;
            align-items: center;
            margin-inline-end: 15px;

            span {
              font-size: 0.85rem;
              font-family: var(--font-alt);
              color: var(--dark-text);
            }

            i {
              font-size: 1.2rem;
              margin-inline-end: 6px;
              color: var(--light-text);
            }
          }
        }
      }

      .meta-right {
        margin-inline-start: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .buttons {
          margin-bottom: 0;
          margin-inline-end: 10px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v2 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }

          > span {
            color: var(--primary);
          }

          .icon-list {
            > span {
              span {
                color: var(--dark-dark-text);
              }
            }
          }
        }

        .meta-right {
          .buttons {
            .button {
              &:first-child {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-8);
                color: var(--dark-dark-text);
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .list-view-v2 {
    .list-view-item {
      padding: 20px;

      .list-view-item-inner {
        flex-direction: column;

        > img {
          width: 100%;
          max-width: 100%;
          min-height: 160px;
          max-height: 160px;
          margin-bottom: 1rem;
        }

        .meta-left {
          margin-inline-start: 0;

          > span {
            margin-bottom: 16px;
          }

          .icon-list {
            flex-wrap: wrap;

            > span {
              flex-direction: column;
              text-align: center;
              margin: 10px;
              width: calc(33.3% - 20px);

              i {
                margin: 0;
              }
            }
          }
        }

        .meta-right {
          margin: 16px 0 0;

          .buttons {
            margin: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .button {
              width: 48%;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .list-view-v2 {
    .list-view-inner {
      display: flex;
      flex-wrap: wrap;

      .list-view-item {
        padding: 20px;
        margin: 10px;
        width: calc(50% - 20px);

        .list-view-item-inner {
          flex-direction: column;
          height: 100%;
          min-height: 450px;

          > img {
            width: 100%;
            max-width: 100%;
            min-height: 160px;
            max-height: 160px;
            margin-bottom: 1rem;
          }

          .meta-left {
            margin-inline-start: 0;

            > span {
              margin-bottom: 16px;
            }

            .icon-list {
              flex-wrap: wrap;

              > span {
                flex-direction: column;
                text-align: center;
                margin: 10px;
                width: calc(33.3% - 20px);

                i {
                  margin: 0;
                }
              }
            }
          }

          .meta-right {
            margin: auto 0 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            .buttons {
              margin: 16px 0 0;
              width: 100%;
              display: flex;
              justify-content: space-between;

              .button {
                width: 48%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
