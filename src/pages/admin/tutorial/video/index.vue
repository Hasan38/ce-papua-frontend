<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { useNotyf } from '/@src/composable/useNotyf'
import type { TutorialResponse, Tutorial } from '/@src/models/tutorial'
import moment from 'moment'
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Archiev Videos')
useHead({
  title: computed(() => 'Archiev Video'),
})
const path = ref<any>('video')
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
  isLoading.value = true
  try {
    const { _data: data } = await $fetch.raw<TutorialResponse>('/api/tutorial', {
      query: {
        q: debouncedFilter.value,
        page: currentPage.value,
        type: path.value,
      },
      method: 'GET',

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    })
    isLoading.value = false
    response.value = data
    videoData.value = data?.data.data
    total.value = data?.data.total ?? 0
  }
  catch (error: any) {
    isLoading.value = false
  }
  finally {
    isLoading.value = false
  }
}
watchEffect(getVideo)

function dateshow(value: any) {
  // here u modify data
  return moment(value).fromNow() // and set to the view
}

function viewVideo(raw: any) {
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
  <div class="lifestyle-dashboard lifestyle-dashboard-v5">
    <div class="dashboard-title is-main">
      <div class="left">
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
      <div class="right">
        <div class="members">
          <div class="members-list">
            <VAvatar
              size="small"
              squared
            >
              <template #avatar>
                <button class="avatar is-fake is-squared">
                  <RouterLink :to="`/admin/tutorial/add/${path}`">
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:plus"
                    />
                  </RouterLink>
                </button>
              </template>
            </VAvatar>
          </div>
        </div>
      </div>
    </div>

    <!--Media Feed-->
    <div class="media-feed">
      <!--Group-->
      <div class="feed-group">
        <h4 class="group-title">
          videos
        </h4>

        <div class="group-content">
          <div v-if="isLoading" class="columns is-multiline">
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
          <div class="columns is-multiline">
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
            <!--Media item-->
            <div
              v-for="item in videoData"
              :key="item.id"
              class="column is-3"
            >
              <div
                v-background="{
                  src: 'https://logowik.com/content/uploads/images/hitachi7389.jpg',
                  placeholder: 'https://via.placeholder.com/800x600',
                }"
                class="media-feed-item has-background-image"
              >
                <button class="play-button" @click="viewVideo(item)">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:play"
                  />
                </button>

                <VDropdown
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

                <!--Bottom Overlay-->
                <div class="item-overlay" />
                <!-- Overlay content -->
                <div class="overlay-layer">
                  <div class="overlay-content">
                    <div class="inner-content">
                      <a
                        class="media-title"
                        href="#"
                        @click="viewVideo(item)"
                      >
                        {{ item.title }}
                      </a>
                      <div class="media-meta">
                        <a class="meta-item is-hoverable">{{ item.users.name }}</a>
                        <span class="separator">|</span>

                        <a class="meta-item is-hoverable">{{ dateshow(item.created_at) }} </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
      </div>
    </div>
    <VModal
      :open="modalView"
      size="large"
      actions="center"
      :title="`${isTutor.title}`"
      @close="modalView = false"
    >
      <template #content>
        <VPlyr
          ratio="4by3"
          :source="`${isTutor.link}`"
          poster="https://logowik.com/content/uploads/images/hitachi7389.jpg"
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
@import '/@src/scss/abstracts/all';

.lifestyle-dashboard-v5 {
  .dashboard-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    font-family: var(--font);

    &.is-main {
      margin-bottom: 30px;

      h2 {
        font-size: 1.8rem;
      }
    }

    h2 {
      font-family: var(--font-alt);
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--dark-text);
    }

    .members {
      h4 {
        font-family: var(--font);
        color: var(--light-text);
        padding: 0 0.35rem;
        margin-bottom: 0.75rem;
      }

      .members-list {
        display: flex;

        .v-avatar {
          margin: 0 0.35rem;

          button {
            border: none;
            background: var(--primary);
            box-shadow: var(--primary-box-shadow);
            color: var(--white);
            cursor: pointer;

            svg {
              stroke: var(--white);
              height: 16px;
              width: 16px;
            }
          }
        }
      }
    }
  }

  .media-feed {
    .feed-group {
      + .feed-group {
        margin-top: 3.5rem;
      }

      .group-title {
        font-family: var(--font);
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--light-text);
        text-transform: uppercase;
        margin-bottom: 1rem;
      }

      .group-content {
        .media-feed-item {
          position: relative;

          @include vuero-r-card;

          padding: 1.5rem;
          min-height: 220px;
          overflow: hidden;

          &.is-big {
            min-height: 380px;

            .item-duration {
              top: 40px;
              inset-inline-end: 40px;
            }

            .play-button {
              top: 40px;
              inset-inline-start: 40px;
              height: 60px;
              width: 60px;
              border-radius: 1rem;

              svg {
                height: 26px;
                width: 26px;
              }
            }

            .play-button-right {
              top: 40px;
              inset-inline-end: 10px;
              height: 60px;
              width: 60px;
              border-radius: 1rem;

              svg {
                height: 26px;
                width: 26px;
              }
            }

            .overlay-layer {
              .overlay-content {
                .inner-content {
                  padding: 40px;

                  .media-title {
                    font-size: 2.5rem;
                    line-height: 43px;
                  }

                }
              }

            }
          }

          .play-button {
            position: absolute;
            top: 20px;
            inset-inline-start: 20px;
            background: var(--white);
            height: 40px;
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            border-radius: 0.75rem;
            z-index: 3;
            cursor: pointer;
            box-shadow: var(--light-box-shadow);

            &:hover,
            &:focus {
              svg,
              svg * {
                stroke: var(--primary);
                fill: var(--primary);
              }
            }

            svg,
            svg * {
              position: relative;
              inset-inline-start: 2px;
              height: 15px;
              width: 15px;
              fill: var(--dark-text);
              stroke: var(--dark-text);
              transition:
                color 0.3s,
                background-color 0.3s,
                border-color 0.3s,
                height 0.3s,
                width 0.3s;
            }
          }

          .play-button-right {
            position: absolute;
            top: 20px;
            inset-inline-end: 10px;
            background: var(--white);
            height: 40px;
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            border-radius: 0.75rem;
            z-index: 3;
            cursor: pointer;
            box-shadow: var(--light-box-shadow);

            &:hover,
            &:focus {
              svg,
              svg * {
                stroke: var(--primary);
                fill: var(--primary);
              }
            }

          }

          .item-duration {
            position: absolute;
            top: 20px;
            inset-inline-end: 20px;
            background: var(--primary);
            box-shadow: var(--primary-box-shadow);
            font-family: var(--font);
            font-weight: 500;
            color: var(--white);
            height: 2.75em;
            padding-inline-start: 1rem;
            padding-inline-end: 1rem;
            border-radius: 0.5rem;
            line-height: 2.7;
            z-index: 3;
          }

          .overlay-layer {
            position: absolute;
            top: 0;
            inset-inline-start: 0;
            height: 100%;
            width: 100%;
            z-index: 2;

            .overlay-content {
              position: relative;
              height: 100%;
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;

              .inner-content {
                padding: 20px;
                color: var(--white);

                .media-title {
                  font-family: var(--font-alt);
                  font-size: 1.3rem;
                  font-weight: bolder;
                  line-height: 24px;
                  color: var(--smoke-white);
                  margin-bottom: 6px;
                }

                .media-meta {
                  display: flex;
                  align-items: center;

                  img {
                    display: block;
                    height: 30px;
                    width: 30px;
                    min-width: 30px;
                    border-radius: 50%;
                    margin-inline-end: 6px;
                  }

                  .meta-item {
                    display: block;
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: var(--smoke-white-dark-8);
                    transition: color 0.3s;

                    &.is-hoverable:hover {
                      color: var(--primary);
                    }
                  }

                  .separator {
                    padding: 0 10px;
                    font-size: 0.8rem;

                    // color: var(--smoke-white-dark-10);
                    opacity: 0.6;
                    text-align: center;
                    color: var(--smoke-white);
                  }
                }
              }
            }
          }

          .item-overlay {
            position: absolute;
            top: 0;
            inset-inline-start: 0;
            height: 100%;
            width: 100%;
            background: linear-gradient(to top, #161616, rgb(255 0 0 / 0%));
            z-index: 0;
          }

        }
      }
    }
  }
}

.is-dark {
  .lifestyle-dashboard-v5 {
    .dashboard-title {
      .members {
        .members-list {
          .h-avatar {
            button {
              background: var(--primary) !important;
            }

            .avatar {
              &.is-fake {
                background: var(--dark-sidebar-light-2);
              }
            }
          }
        }
      }
    }

    .media-feed {
      .feed-group {
        .group-content {
          .media-feed-item {
            @include vuero-card--dark;

            .item-duration {
              background: var(--primary) !important;
              color: var(--white) !important;
              box-shadow: var(--primary-box-shadow) !important;
            }

            .play-button {
            position: absolute;
            top: 20px;
            inset-inline-start: 20px;
            background: var(--white);
            height: 40px;
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            border-radius: 0.75rem;
            z-index: 3;
            cursor: pointer;
            box-shadow: var(--light-box-shadow);

            &:hover,
            &:focus {
              svg,
              svg * {
                stroke: var(--primary);
                fill: var(--primary);
              }
            }

            svg,
            svg * {
              position: relative;
              inset-inline-start: 2px;
              height: 15px;
              width: 15px;
              fill: var(--primary);
              stroke: var(--dark-text);
              transition:
                color 0.3s,
                background-color 0.3s,
                border-color 0.3s,
                height 0.3s,
                width 0.3s;
            }
          }

          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .lifestyle-dashboard-v5 {
    .media-feed {
      .feed-group {
        .group-content {
          > .columns {
            display: flex;

            .column {
              min-width: 50%;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .lifestyle-dashboard-v5 {
    .media-feed {
      .feed-group {
        .group-content {
          .media-feed-item {
            .overlay-layer {
              .overlay-content {
                .inner-content {
                  .media-title {
                    font-size: 1.1rem;
                  }

                  .media-meta {
                    img {
                      height: 24px;
                      width: 24px;
                      min-width: 24px;
                    }

                    .separator {
                      padding: 0 5px;
                    }
                  }
                }
              }
            }

          }
        }
      }
    }
  }
}
</style>
