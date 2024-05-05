<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import type { ErrorCodeCeResponse, ErrorCodeCe } from '/@src/models/error_code_ce'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import CKE from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import moment from 'moment'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('CML')

useHead({
  title: 'Error code - CML',
})
const CKEditor = CKE.component
const config = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
}

const userSession = useUserSession()
const filters = ref('')
const problem_info = ref('')
const action_taken = ref('')
const machine_type = ref('SR7500')
const errorData = ref<ErrorCodeCe[]>()
const isLoading = ref(false)
const total = ref(0)
const notyf = useNotyf()
const route = useRoute()
const errors = ref<any>({})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const input = ref(3)
const $fetch = useLaravelFetch()
const modalPost = ref(false)
const modalEdit = ref(false)
const modalDelete = ref(false)
const errorValue = ref<any>([])
const debouncedFilter = useDebounce(filters, 500)
interface FormEmpresasProps {
  errCe?: ErrorCodeCe
}
const props = withDefaults(defineProps<FormEmpresasProps>(), {
  errCe: Object,
})
const isError = ref(props.errCe) ?? null
const valueSingle = ref()

const currentPage = computed(() => {
  try {
    return Number.parseInt(route.query.page as string) || 1
  }
  catch { 0 }
  return 1
})
async function getError() {
  if (debouncedFilter.value || valueSingle.value) {
    isLoading.value = true
    await $fetch.raw<ErrorCodeCeResponse>('/api/error_code_ce', {
      query: {
        q: debouncedFilter.value,
        model: valueSingle.value,
        page: 0,
      },
      method: 'GET',

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    }).then((res) => {
      isLoading.value = false
      errorData.value = res._data?.data.data
      total.value = res._data?.data.total ?? 0
    }).catch ((e) => {
      isLoading.value = false
      console.log(e)
    })
  }
  else {
    isLoading.value = true
    await $fetch.raw<ErrorCodeCeResponse>('/api/error_code_ce', {
      query: {
        q: debouncedFilter.value,
        model: valueSingle.value,
        page: currentPage.value,
      },
      method: 'GET',

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    }).then((res) => {
      isLoading.value = false
      errorData.value = res._data?.data.data
      total.value = res._data?.data.total ?? 0
    }).catch ((e) => {
      isLoading.value = false
      console.log(e)
    })
  }
}

watchEffect(getError)

// Set initial values for the form

const onPost = async () => {
  const $fetch = useLaravelFetch()
  if (isLoading.value) return
  isLoading.value = true

  await $fetch('/sanctum/csrf-cookie')
  await $fetch.raw('/api/error_code_ce', {
    method: 'POST',
    body: {
      user_id: userSession.user?.id,
      error_code: errorValue.value,
      machine_type: machine_type.value,
      problem_info: problem_info.value,
      action_taken: action_taken.value,

    },
  }).then(() => {
    getError()
    isLoading.value = false
    modalPost.value = false
    notyf.success('data berhasil ditambahkan')
  }).catch((e) => {
    isLoading.value = false
    if (e.status === 422) {
      errors.value = e.data.errors
    }
  })
}

function addEdit(row: any) {
  modalEdit.value = true
  isError.value = row
}
const onEdit = async () => {
  const $fetch = useLaravelFetch()
  if (isLoading.value) return
  isLoading.value = true

  await $fetch('/sanctum/csrf-cookie')
  await $fetch.raw(`/api/error_code_ce/${isError.value.id}`, {
    method: 'PUT',
    body: {
      user_id: userSession.user?.id,
      error_code: isError.value.error_code,
      machine_type: isError.value.machine_type,
      problem_info: isError.value.problem_info,
      action_taken: isError.value.action_taken,

    },
  }).then(() => {
    getError()
    isLoading.value = false
    modalEdit.value = false
    notyf.success('data berhasil di update')
  }).catch((e) => {
    isLoading.value = false
    if (e.status === 422) {
      errors.value = e.data.errors
    }
  })
}

function addDelete(row: any) {
  modalDelete.value = true
  isError.value = row
}

const onDelete = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch.raw(`/api/error_code_ce/${isError.value.id}`, { method: 'DELETE' }).then(() => {
      isLoading.value = false
      getError()
      modalDelete.value = false
    })
  }
  catch ($e: any) {
    isLoading.value = false
    notyf.error($e)
  }
}

function onChange() {
  filters.value = filters.value.toUpperCase()
}

function dateshow(value: any) {
  // here u modify data
  return moment(value).fromNow() // and set to the view
}
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
            @keyup="onChange()"
          >
        </VControl>
      </VField>

      <div class="tabs-inner">
        <div class="tabs">
          <ul>
            <li>
              <VField>
                <VControl>
                  <VSelect v-model="valueSingle" class="is-rounded">
                    <VOption value="">
                      Select a Machine
                    </VOption>
                    <VOption value="SR7500">
                      SR7500
                    </VOption>
                    <VOption value="VS-ATM">
                      VS
                    </VOption>
                    <VOption value="TCR">
                      TCR
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </li>
            <li>
              <VButton
                color="primary"
                raised
                @click="modalPost=true"
              >
                <span class="icon">
                  <i
                    aria-hidden="true"
                    class="fas fa-plus"
                  />
                </span>
                <span>Add</span>
              </VButton>
            </li>
            <li class="tab-naver" />
          </ul>
        </div>
      </div>
    </div>

    <div class="page-content-inner">
      <!--List-->
      <div class="list-view list-view-v2">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          :class="[errorData?.length !== 0 && 'is-hidden']"
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
              v-for="item in errorData"
              :key="item.id"
              class="list-view-item"
            >
              <div class="list-view-item-inner">
                <div class="meta-left">
                  <h3>
                    <span>{{ item.error_code }} - {{ item.machine_type }}</span>
                  </h3>

                  <VMarkdownPreview :source="item.problem_info" />

                  <span>

                    <span>
                      <VRangeRating
                        :model-value="item.ratings_avg_nilai"
                        disable

                        class="is-inline"
                      >
                        <i
                          class="fas fa-star"
                          aria-hidden="true"
                        />
                      </VRangeRating>
                    </span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <span>
                      {{ item.ratings_count }} comments
                    </span>
                  </span>
                  <div class="icon-list">
                    <span v-if="item.users.name ">

                      <span class="mr-1">
                        {{ item.users.name }}
                      </span>
                      <i
                        aria-hidden="true"
                        class="fas fa-circle icon-separator"
                      />
                      <span>
                        {{ dateshow(item.created_at) }}
                      </span>
                    </span>
                  </div>
                </div>
                <div class="meta-right">
                  <VDropdown
                    icon="feather:more-vertical"
                    right
                    spaced
                  >
                    <template #content>
                      <RouterLink
                        :to="`/admin/error_code/cml/${item.id}`"
                        role="menuitem"
                        class="dropdown-item is-media"
                      >
                        <div class="icon">
                          <i class="lnil lnil-comments-alt" aria-hidden="true" />
                        </div>
                        <div class="meta">
                          <span>Comment & Rating</span>
                          <span>Comment</span>
                        </div>
                      </RouterLink>
                      <a
                        v-if="userSession.user?.id === item.user_id || userSession.user?.roles[0]?.name ==='admin'"
                        href="#"
                        role="menuitem"
                        class="dropdown-item is-media"
                        @click="addEdit(item)"
                      >
                        <div class="icon">
                          <i
                            aria-hidden="true"
                            class="lnil lnil-pencil"
                          />
                        </div>
                        <div class="meta">
                          <span>Edit</span>
                          <span>Edit Post</span>
                        </div>
                      </a>

                      <hr class="dropdown-divider">

                      <a
                        v-if="userSession.user?.id === item.user_id || userSession.user?.roles[0]?.name ==='admin'"
                        href="#"
                        role="menuitem"
                        class="dropdown-item is-media"
                        @click="addDelete(item)"
                      >
                        <div class="icon">
                          <i
                            aria-hidden="true"
                            class="lnil lnil-trash-can-alt"
                          />
                        </div>
                        <div class="meta">
                          <span>Remove</span>
                          <span>Remove from view</span>
                        </div>
                      </a>
                    </template>
                  </VDropdown>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <VFlexPagination
          v-if="errorData?.length !== 0"
          :current-page="currentPage"
          :item-per-page="10"
          :total-items="(total as number) ?? 0"
          :max-links-displayed="5"
          @update:current-page="getError"
        />

      <!--Inactive Tab-->
      </div>
      <VModal
        is="form"
        :open="modalPost"
        size="large"
        actions="center"
        title="Post Your Action"
        @submit.prevent="onPost"
        @close="modalPost = false"
      >
        <template #content>
          <VField
            label="Machine Type"
          >
            <VControl>
              <VSelect v-model="machine_type">
                <VOption value="SR7500">
                  SR7500
                </VOption>

                <VOption value="TCR">
                  TCR
                </VOption>
                <VOption value="VS-ATM">
                  SR7500 VS
                </VOption>
              </VSelect>

              <p v-if="errors?.machine_type" class="help has-text-danger">
                {{ errors?.machine_type }}
              </p>
            </VControl>
          </VField>
          <VField v-slot="{ id }" label="Error Code">
            <VControl>
              <Multiselect
                v-model="errorValue"
                :attrs="{ id }"
                mode="tags"
                :searchable="true"
                :create-tag="true"
                :options="errorValue"
                placeholder="Error Code"
              />
              <p v-if="errors?.error_code" class="help has-text-danger">
                {{ errors?.error_code }}
              </p>
            </VControl>
          </VField>
          <VField

            label="Problem Info"
          >
            <VControl fullwidth>
              <CKEditor
                v-model="problem_info"
                :editor="ClassicEditor"
                class="ck-editor"
                :config="config"
              />

              <p v-if="errors?.problem_info" class="help has-text-danger">
                {{ errors?.problem_info }}
              </p>
            </VControl>
          </VField>
          <VField label="Detail Action">
            <VControl fullwidth>
              <CKEditor
                v-model="action_taken"
                :editor="ClassicEditor"
                :config="config"
              />

              <p v-if="errors?.action_taken" class="help has-text-danger">
                {{ errors?.action_taken }}
              </p>
            </VControl>
          </VField>
        </template>
        <template #action>
          <VButton
            type="submit"
            color="primary"
            :loading="isLoading"
            raised
          >
            Simpan
          </VButton>
        </template>
      </VModal>
      <VModal
        is="form"
        :open="modalEdit"
        size="large"
        actions="center"
        title="Post Your Action"
        @submit.prevent="onEdit"
        @close="modalEdit = false"
      >
        <template #content>
          <VField
            label="Machine Type"
          >
            <VControl>
              <VSelect v-model="isError.machine_type">
                <VOption value="SR7500">
                  SR7500
                </VOption>

                <VOption value="TCR">
                  TCR
                </VOption>
                <VOption value="VS-ATM">
                  SR7500 VS
                </VOption>
              </VSelect>

              <p v-if="errors?.machine_type" class="help has-text-danger">
                {{ errors?.machine_type }}
              </p>
            </VControl>
          </VField>
          <VField v-slot="{ id }" label="Error Code">
            <VControl>
              <Multiselect
                v-model="isError.error_code"
                :attrs="{ id }"
                mode="tags"
                :searchable="true"
                :create-tag="true"
                :options="isError.error_code"
                placeholder="Error Code"
              />
              <p v-if="errors?.error_code" class="help has-text-danger">
                {{ errors?.error_code }}
              </p>
            </VControl>
          </VField>
          <VField

            label="Problem Info"
          >
            <VControl fullwidth>
              <CKEditor
                v-model="isError.problem_info"
                :editor="ClassicEditor"
                class="ck-editor"
                :config="config"
              />

              <p v-if="errors?.problem_info" class="help has-text-danger">
                {{ errors?.problem_info }}
              </p>
            </VControl>
          </VField>
          <VField label="Detail Action">
            <VControl fullwidth>
              <CKEditor
                v-model="isError.action_taken"
                :editor="ClassicEditor"
                :config="config"
              />

              <p v-if="errors?.action_taken" class="help has-text-danger">
                {{ errors?.action_taken }}
              </p>
            </VControl>
          </VField>
        </template>
        <template #action>
          <VButton
            type="submit"
            color="primary"
            :loading="isLoading"
            raised
          >
            Simpan
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
                :subtitle="`${isError.error_code}`"
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
