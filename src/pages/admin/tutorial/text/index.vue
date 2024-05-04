<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { useNotyf } from '/@src/composable/useNotyf'
import type { TutorialResponse, Tutorial } from '/@src/models/tutorial'
import moment from 'moment'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useUserSession } from '/@src/stores/userSession'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Archiev')
useHead({
  title: computed(() => 'Archiev'),
})
const userSession = useUserSession()
const path = ref<any>('text')
const $fetch = useLaravelFetch()
const isLoading = ref(false)
const modalView = ref(false)
const modalDelete = ref(false)
const route = useRoute()
const filters = ref('')
const total = ref(0)
const notyf = useNotyf()
const currentPage = computed(() => {
  try {
    return Number.parseInt(route.query.page as string) || 1
  }
  catch { 0 }
  return 1
})

const response = ref<TutorialResponse>()
const videoData = ref<Tutorial[]>()

interface FormEmpresasProps {
  tutorial?: Tutorial
}
const props = withDefaults(defineProps<FormEmpresasProps>(), {
  tutorial: Object,
})
const isTutor = ref(props.tutorial) ?? null
const debouncedFilter = useDebounce(filters, 500)
async function getVideo() {
  if (debouncedFilter.value) {
    isLoading.value = true
    await $fetch.raw<TutorialResponse>('/api/tutorial', {
      query: {
        q: debouncedFilter.value,
        page: 0,
        type: path.value,
      },
      method: 'GET',

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    }).then((res) => {
      isLoading.value = false
      response.value = res._data
      videoData.value = res._data?.data.data
      total.value = res._data?.data.total ?? 0
    })
      .catch ((e) => {
        isLoading.value = false
        console.log(e)
      })
  }
  else {
    isLoading.value = true
    await $fetch.raw<TutorialResponse>('/api/tutorial', {
      query: {
        q: debouncedFilter.value,
        page: currentPage.value,
        type: path.value,
      },
      method: 'GET',

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    }).then((res) => {
      isLoading.value = false
      response.value = res._data
      videoData.value = res._data?.data.data
      total.value = res._data?.data.total ?? 0
    })
      .catch ((e) => {
        isLoading.value = false
        console.log(e)
      })
  }
}
watchEffect(getVideo)

function dateshow(value: any) {
  // here u modify data
  return moment(value).fromNow() // and set to the view
}

function addView(raw: any) {
  isTutor.value = raw
  modalView.value = true
}

function addDelete(raw: any) {
  isTutor.value = raw
  modalDelete.value = true
}

const onDelete = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch.raw(`/api/tutorial/${isTutor.value.id}`, { method: 'DELETE' }).then(() => {
      isLoading.value = false
      getVideo()
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
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          >
        </VControl>
      </VField>

      <div class="buttons">
        <VButton
          color="primary"
          raised
          :to="`/admin/tutorial/add/${path}`"
        >
          <span class="icon">
            <i
              aria-hidden="true"
              class="fas fa-plus"
            />
          </span>
          <span>Add Archiev</span>
        </VButton>
      </div>
    </div>

    <div class="tile-grid tile-grid-v3">
      <div v-if="isLoading" class="card-grid card-grid-v2">
        <div class="columns is-multiline">
          <!--Grid item-->
          <div
            v-for="key in 30"
            :key="key"
            class="column is-4"
          >
            <div class="tile-grid-item">
              <div class="tile-grid-item-inner placeload-wrap is-flex">
                <VPlaceloadAvatar size="medium" />
                <VPlaceloadText
                  width="80%"
                  last-line-width="60%"
                  class="mx-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="card-grid card-grid-v2">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          :class="[videoData?.length !== 0 && 'is-hidden']"
          title="We couldn't find any matching results."
          subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
          larger
        >
          <template #image>
            <img
              class="light-image"
              src="/@src/assets/illustrations/placeholders/search-3.svg"
              alt=""
            >
            <img
              class="dark-image"
              src="/@src/assets/illustrations/placeholders/search-3-dark.svg"
              alt=""
            >
          </template>
        </VPlaceholderPage>

        <!--Card Grid v2-->
        <TransitionGroup
          name="list"
          tag="div"
          class="columns is-multiline"
        >
          <!--Grid Item-->
          <div
            v-for="(item, key) in videoData"
            :key="key"
            class="column is-4"
          >
            <div class="card-grid-item">
              <div class="card">
                <header class="card-header">
                  <div class="card-header-title">
                    <VAvatar
                      size="small"
                      :picture="item.users.avatar"
                    />
                    <div class="meta">
                      <span class="dark-inverted">{{ item.users.name }}</span>
                      <span>updated {{ dateshow(item.created_at) }}</span>
                    </div>
                  </div>
                  <div class="card-header-icon">
                    <VDropdown
                      v-if="userSession.user?.roles[0]?.name ==='admin'"
                      icon="feather:more-vertical"
                      class="play-button-right"
                      spaced
                      right
                    >
                      <template #content>
                        <RouterLink
                          role="menuitem"
                          href="#"
                          class="dropdown-item is-media"
                          :to="`/admin/tutorial/edit/${item.id}`"
                        >
                          <div class="icon">
                            <i
                              aria-hidden="true"
                              class="lnil lnil-pencil"
                            />
                          </div>
                          <div class="meta">
                            <span>Edit</span>
                            <span>Edit this video</span>
                          </div>
                        </RouterLink>

                        <hr class="dropdown-divider">
                        <a
                          role="menuitem"
                          href="#"
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
                            <span>Delete</span>
                            <span>Delete this video</span>
                          </div>
                        </a>
                      </template>
                    </VDropdown>
                  </div>
                </header>

                <div class="card-content">
                  <div class="card-content-flex">
                    <div class="card-info">
                      <h3
                        class="dark-inverted"
                        role="button"
                        tabIndex="0"
                        @keypress="addView(item)"
                        @click="addView(item)"
                      >
                        {{ item.title }}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
      <VFlexPagination
        v-if="videoData?.length !== 0"
        :current-page="currentPage"
        :item-per-page="8"
        :total-items="(total as number) ?? 0"
        :max-links-displayed="5"
        @update:current-page="getVideo"
      />
    </div>

    <VModal
      :open="modalView"
      size="big"
      actions="center"
      :title="`${isTutor.title}`"
      @close="modalView = false"
    >
      <template #content>
        <VMarkdownPreview v-if="isTutor.title" :source="isTutor.title" />
        <VMarkdownPreview v-if="isTutor.content" :source="isTutor.content" />

        <VPlyr
          v-if="isTutor.link"
          ratio="4by3"
          :source="`${isTutor.link}`"
          :embed="true"
        />
      </template>
      <template #action />
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
              :subtitle="`${isTutor.title}`"
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

.card-grid-v2 {
  .card-grid-item {
    .card {
      border: 1px solid var(--fade-grey-dark-4);
      box-shadow: none;
      border-radius: var(--radius-large);

      .card-header {
        box-shadow: none;
        border-bottom: 1px solid var(--fade-grey-dark-4);

        .card-header-title {
          display: flex;
          align-items: center;

          .meta {
            margin-inline-start: 10px;
            line-height: 1.2;

            span {
              display: block;
              font-weight: 400;

              &:first-child {
                font-family: var(--font-alt);
                font-size: 0.95rem;
                color: var(--dark-text);
                font-weight: 600;
              }

              &:nth-child(2) {
                font-size: 0.9rem;
                color: var(--light-text);
              }
            }
          }
        }
      }

      .card-image {
        img {
          object-fit: cover;
        }
      }

      .card-content {
        border-top: 1px solid var(--fade-grey-dark-4);
        padding: 1rem;

        .card-content-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .card-info {
            h3 {
              font-family: var(--font-alt);
              font-size: 1rem;
              color: var(--dark-text);
              font-weight: 600;
            }

            p {
              font-size: 0.9rem;

              svg {
                position: relative;
                top: 0;
                height: 14px;
                width: 14px;
                margin-inline-end: 4px;
              }
            }
          }
        }
      }

      .card-footer {
        a {
          font-family: var(--font);
          color: var(--light-text);
          padding: 1rem 0.75rem;
          transition: all 0.3s; // transition-all test

          &:hover {
            background: var(--fade-grey-light-4);
            color: var(--primary);
          }
        }
      }
    }
  }
}

.is-dark {
  .card-grid-v2 {
    .card-grid-item {
      border-color: var(--dark-sidebar-light-12);

      .card {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);

        .card-header {
          border-color: var(--dark-sidebar-light-12);
        }

        .card-content {
          border-color: var(--dark-sidebar-light-12);

          .avatar-stack {
            .avatar {
              border-color: var(--dark-sidebar-light-6);
            }
          }
        }

        .card-footer {
          border-color: var(--dark-sidebar-light-12);

          a {
            border-color: var(--dark-sidebar-light-12);

            &:hover,
            &:focus {
              background: var(--dark-sidebar-light-2);
              color: var(--primary);
            }
          }
        }
      }
    }
  }
}
</style>
