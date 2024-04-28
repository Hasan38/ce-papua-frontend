<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import type { ErrorCodeCeResponse, ErrorCodeCe } from '/@src/models/error_code_ce'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import CKE from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
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
const optionsSingle = [
  'SR7500',
  'VS-ATM',
  'TCR',
]
const currentPage = computed(() => {
  try {
    return Number.parseInt(route.query.page as string) || 1
  }
  catch { 0 }
  return 1
})
async function getError() {
  isLoading.value = true
  try {
    const { _data: data } = await $fetch.raw<ErrorCodeCeResponse>('/api/error_code_ce', {
      query: {
        q: debouncedFilter.value,
        model: valueSingle.value,
        page: currentPage.value,
      },
      method: 'GET',

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    })
    isLoading.value = false
    errorData.value = data?.data.data
    total.value = data?.data.total ?? 0
  }
  catch (error: any) {
    isLoading.value = false
  }
  finally {
    isLoading.value = false
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
</script>

<template>
  <div>
    <div class="card-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        >
      </VControl>

      <div class="buttons">
        <VField class="h-hidden-mobile">
          <VControl>
            <Multiselect
              v-model="valueSingle"
              :options="optionsSingle"
              :max-height="145"
              placeholder="Select an option"
            />
          </VControl>
        </VField>
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
          <span>Add Problem</span>
        </VButton>
      </div>
    </div>

    <div class="card-grid card-grid-v1">
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
            src="/@src/assets/illustrations/placeholders/search-4.svg"
            alt=""
          >
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
            alt=""
          >
        </template>
      </VPlaceholderPage>

      <!--Card Grid v1-->
      <TransitionGroup
        name="list"
        tag="div"
        class="columns is-multiline"
      >
        <!--Grid item-->
        <div
          v-for="(item, index) in errorData"
          :key="index"
          class="column is-12"
        >
          <VCardAdvanced radius="rounded">
            <template #header-left>
              <p><b>{{ item.error_code }} / {{ item.machine_type }}</b></p>
            </template>
            <template #header-right>
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
            </template>
            <template #content>
              <p><b>Problem Info</b></p>
              <VMarkdownPreview :source="item.problem_info" />
              <p><b>Action</b></p>
              <VMarkdownPreview :source="item.action_taken" />
            </template>
            <template #footer-left>
              <RouterLink :to="`/admin/error_code/cml/${item.id}`">
                <VRangeRating
                  :model-value="item.ratings_avg_nilai"
                  size="medium"
                  class="mr-2"
                  disable
                />
              </RouterLink>
              {{ item.ratings_count }} comments
            </template>
            <template #footer-right>
              <VBlock
                :title="`${item.users.name }`"
                subtitle="Admin"
                center
              >
                <template #icon>
                  <VAvatar
                    picture="/demo/avatars/19.jpg"
                    badge="/images/icons/flags/germany.svg"
                  />
                </template>
              </VBlock>
            </template>
          </VCardAdvanced>
        </div>
      </TransitionGroup>
      <VFlexPagination
        :current-page="currentPage"
        :item-per-page="10"
        :total-items="(total as number) ?? 0"
        :max-links-displayed="5"
        @update:current-page="getError"
      />
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
</template>

<style lang="scss">
.card-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.card-grid-v1 {
  .card-grid-item {
    flex: 1;
    display: inline-block;
    width: 100%;
    background-color: var(--white);
    border-radius: 6px;
    border: 1px solid var(--fade-grey-dark-3);
    transition: all 0.3s; // transition-all test

    .card-grid-item-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--fade-grey-dark-3);

      .left {
        display: flex;
        align-items: center;

        .meta {
          margin-inline-start: 12px;
          line-height: 1.3;

          span {
            display: block;

            &:first-child {
              font-size: 1.1rem;
              font-weight: 600;
              font-family: var(--font-alt);
              color: var(--dark-text);
            }

            &:nth-child(2) {
              font-family: var(--font);
              font-size: 0.85rem;
              color: var(--light-text);
            }
          }
        }
      }

      .right {
        .social-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            width: 32px;
            min-width: 32px;
            border-radius: 50%;
            border: 1px solid var(--fade-grey-dark-3);
            margin: 0 4px;
            color: var(--primary);
            box-shadow: var(--light-box-shadow);
            transition: all 0.3s; // transition-all test

            &:hover {
              color: var(--white);
              background: var(--primary);
              border-color: var(--primary);
              box-shadow: var(--primary-box-shadow);
            }

            i {
              font-size: 12px;
            }
          }
        }
      }
    }

    .card-grid-item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;

      .left {
        flex-grow: 2;
        max-width: 50%;

        .progress-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          span {
            display: block;

            &:first-child {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              font-weight: 600;
              color: var(--dark-text);
            }

            &:nth-child(2) {
              font-size: 0.9rem;
              color: var(--light-text);
            }
          }
        }

        .progress {
          margin-bottom: 0;
        }
      }

      .right {
        .v-button {
          color: var(--light-text);

          &:hover,
          &:focus {
            border-color: var(--primary);
            background: var(--primary);
            color: var(--smoke-white);
            box-shadow: var(--primary-box-shadow);
          }
        }
      }
    }
  }
}

.is-dark {
  .card-grid-v1 {
    .card-grid-item {
      background: var(--dark-sidebar-light-6);
      border-color: var(--dark-sidebar-light-12);

      .card-grid-item-body {
        border-color: var(--dark-sidebar-light-12);

        .left {
          .v-avatar {
            .badge {
              border-color: var(--dark-sidebar-light-6);
            }
          }
        }

        .right {
          .social-links {
            .social-link {
              background: var(--dark-sidebar-light-2);
              border-color: var(--dark-sidebar-light-12);
              color: var(--dark-dark-text);

              &:hover,
              &:focus {
                border-color: var(--primary) !important;
                color: var(--primary) !important;
              }
            }
          }
        }
      }

      .card-grid-item-footer {
        .right {
          .v-button {
            box-shadow: none !important;
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .card-grid-v1 {
    .card-grid-item {
      .card-grid-item-body {
        flex-direction: column;

        .left {
          flex-direction: column;
          text-align: center;

          .meta {
            margin: 5px 0 20px;
          }
        }
      }
    }
  }
}

.ck-editor {
    height: 400px;
   }
</style>
