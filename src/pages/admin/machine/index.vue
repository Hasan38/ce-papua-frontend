<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import type { Machine, MachineResponse } from '/@src/models/machine'
// import { useNotyf } from '/@src/composable/useNotyf'
import { useViewWrapper } from '/@src/stores/viewWrapper'
// import { useUserSession } from '/@src/stores/userSession'
// the total data will be set by the fetchData function
const total = ref(0)
// we don't have to set "searchable" parameter
// this will be handled by the fetchData function
// const userSession = useUserSession()
const modalView = ref(false)
// const url = import.meta.env.VITE_API_BASE_URL
// const notyf = useNotyf()

const $fetch = useLaravelFetch()
const machineData = ref<Machine[]>()
const filters = ref('')
const isLoading = ref(false)
const viewWrapper = useViewWrapper()
const route = useRoute()
viewWrapper.setPageTitle('Machine')

interface FormEmpresasProps { machine?: Machine }
const props = withDefaults(defineProps<FormEmpresasProps>(), {
  machine: Object,
})
const isMachine = ref(props.machine) ?? null

const debouncedFilter = useDebounce(filters, 500)

const currentPage = computed(() => {
  try {
    return Number.parseInt(route.query.page as string) || 1
  }
  catch { 0 }
  return 1
})

async function getMachine() {
  isLoading.value = true
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
    }).catch (() => {
      isLoading.value = false
    })
  }
}
watchEffect(getMachine)

function addView(row: any) {
  modalView.value = true
  isMachine.value = row
}

useHead({
  title: 'Data Machines',
})

</script>

<template>
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
                          class="lnil lnil-file-name"
                        />
                        <span>{{ item.notes_count }} Note</span>
                      </span>
                    </div>
                  </div>
                  <div class="meta-right">
                    <div class="buttons">
                      <VButton light :to="`/admin/machine/note/${item.id}`">
                        Notes
                      </VButton>
                      <VButton
                        color="primary"
                        raised

                        @click="addView(item)"
                      >
                        View
                      </VButton>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <VFlexPagination
            v-if="machineData?.length !== 0"
            :current-page="currentPage"
            :item-per-page="10"
            :total-items="(total as number) ?? 0"
            :max-links-displayed="4"
            @update:current-page="getMachine"
          />
        </div>
      </div>
    </div>
    <VModal
      :open="modalView"
      title="Detail"
      size="large"
      actions="center"
      @close="modalView = false"
    >
      <template #content>
        <div class="modal-form">
          <div class="columns is-multiline">
            <div class="column is-6">
              <VField label="customer" class="is-autocomplete-select">
                <VControl icon="feather:slack">
                  <VInput
                    v-model="isMachine.customer_type"
                    type="text"
                    disabled
                  />
                </VControl>
              </VField>
            </div>

            <div class="column is-6">
              <VField

                label="branch"
              >
                <VControl icon="feather:slack">
                  <VInput
                    v-model="isMachine.branch"
                    type="text"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField

                label="terminal id/wsid/tid"
              >
                <VControl icon="feather:slack">
                  <VInput
                    v-model="isMachine.terminal_id"
                    type="text"

                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField

                label="SN"
              >
                <VControl icon="feather:slack">
                  <VInput
                    v-model="isMachine.sn"
                    type="text"
                    placeholder="SN"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField

                label="Machine Type"
              >
                <VControl>
                  <VInput
                    v-model="isMachine.machine_type"
                    type="text"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField

                label="Address"
              >
                <VControl fullwidth>
                  <VTextarea
                    v-model="isMachine.address"
                    class="textarea"
                    rows="4"
                    disabled
                  />
                </VControl>
              </VField>
            </div>

            <div class="column is-6">
              <VField

                label="zona"
              >
                <VControl>
                  <VInput
                    v-model="isMachine.zona"
                    type="text"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField

                label="service status"
              >
                <VControl>
                  <VInput
                    v-model="isMachine.service_status"
                    type="text"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField

                label="pengelola"
              >
                <VControl icon="feather:slack">
                  <VInput
                    v-model="isMachine.pengelola"
                    type="text"
                    placeholder="pengelola"
                    disabled
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </template>
      <template #action />
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
