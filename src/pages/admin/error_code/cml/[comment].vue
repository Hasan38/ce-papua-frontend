<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { onceImageErrored } from '/@src/utils/via-placeholder'
import type { ErrorCodeCe } from '/@src/models/error_code_ce'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import moment from 'moment'
import { type Rating } from '/@src/models/rating'
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('CML-Detail')

useHead({
  title: 'Error code - CML',
})

const route = useRoute()
const userSession = useUserSession()
const $fetch = useLaravelFetch()
const isLoading = ref(false)
const id = (route.params?.comment as string) ?? ''
const errors = ref<any>({})
const errorData = ref<ErrorCodeCe>()
const modalDelete = ref(false)
const input = ref(0)
const notyf = useNotyf()
const comment = ref('')
interface RatingResponse {
  success: boolean
  data: ErrorCodeCe
}

interface FormEmpresasProps {
  rating?: Rating
}
const props = withDefaults(defineProps<FormEmpresasProps>(), {
  rating: Object,
})
const isRating = ref(props.rating) ?? null
async function getError() {
  isLoading.value = true
  try {
    const { _data: data } = await $fetch.raw<RatingResponse>(`/api/error_code_ce/${id}`, {

      method: 'GET',

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    })
    isLoading.value = false
    errorData.value = data?.data
  }
  catch (error: any) {
    isLoading.value = false
  }
  finally {
    isLoading.value = false
  }
}
watchEffect(getError)

const onPost = async () => {
  if (isLoading.value) return
  isLoading.value = true

  if (input.value == 0) {
    notyf.error('berikan rating')
    return
  }

  await $fetch('/sanctum/csrf-cookie')
  await $fetch.raw('/api/rating', {
    method: 'POST',
    body: {
      error_code_ce_id: id,
      user_id: userSession.user?.id,
      nilai: input.value,
      comment: comment.value,

    },
  }).then(() => {
    getError()
    isLoading.value = false
    notyf.success('data berhasil ditambahkan')
  }).catch((e) => {
    isLoading.value = false
    if (e.status === 422) {
      errors.value = e.data.errors
    }
  })
}

function addDelete(row: any) {
  modalDelete.value = true
  isRating.value = row
}

const onDelete = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch.raw(`/api/rating/${isRating.value.id}`, { method: 'DELETE' }).then(() => {
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

function dateshow(value: any) {
  // here u modify data
  return moment(value).fromNow() // and set to the view
}
</script>

<template>
  <div>
    <div class="column is-12">
      <VCardAdvanced radius="rounded">
        <template #header-left>
          <RouterLink to="/admin/error_code/cml">
            <VIconWrap
              icon="feather:arrow-left"
              size="medium"
            />
          </RouterLink>
        </template>
        <template #header-right>
          {{ errorData?.machine_type }}
        </template>
        <template #content>
          <p><b>Error Code</b></p>
          <p><b>{{ errorData?.error_code }}</b></p>
          <p><b>Problem Info</b></p><br>
          <VMarkdownPreview :source="errorData?.problem_info" />
          <p><b>Action</b></p>
          <VMarkdownPreview :source="errorData?.action_taken" />
        </template>
        <template #footer-left>
          <VRangeRating
            class="mr-2"
            :model-value="errorData?.ratings_avg_nilai"
            disable
          />
          <span>{{ errorData?.ratings_count }} comments</span>
        </template>
        <template #footer-right>
          <VBlock
            :title="`${errorData?.users.name }`"
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
    <div class="column is-12">
      <div class="dashboard-card is-tickets">
        <div class="card-head">
          <h3 class="dark-inverted">
            <u>comment</u>
          </h3>
        </div>

        <div
          v-for="(item, index) in errorData?.ratings"
          :key="index"
          class="ticket-list"
        >
          <!--Ticket-->
          <VBlock
            :title="`${item.users?.name }`"
            :subtitle="`${item.comment}`"
            :infratitle="`${dateshow(item.created_at)}`"
            m-responsive
            class="is-dark-bordered-12"
          >
            <template #icon>
              <Tippy
                class="has-help-cursor"
                interactive
                :offset="[0, 10]"
                placement="top-start"
              >
                <VAvatar
                  size="medium"
                  picture="/demo/avatars/31.jpg"
                />
              </Tippy>
            </template>
            <template #action>
              <VIconWrap
                v-if="userSession.user?.id === item.user_id || userSession.user?.roles[0]?.name ==='admin'"
                icon="feather:trash"
                @click="addDelete(item)"
              />
            </template>
          </VBlock>
          <VRangeRating

            :model-value="item.nilai"
            disable
          />
          <hr>
        </div>
      </div>
    </div>
    <div class="column is-12 reply-box-wrap">
      <div class="reply-bubble">
        <div class="reply-as">
          <img
            src="/images/avatars/svg/vuero-1.svg"
            alt=""
            @error.once="onceImageErrored(150)"
          >
          <div class="reply-details">
            <span>{{ userSession.user?.name }}</span>
            <span>{{ userSession.user?.email }}</span>
          </div>
        </div>
        <div class="control">
          <VRangeRating v-model="input" size="large" />
          <p v-if="errors?.nilai" class="help has-text-danger">
            {{ errors?.nilai }}
          </p>
        </div>
        <div class="control">
          <textarea
            v-model="comment"
            class="textarea"
            rows="6"
            placeholder="Type your message..."
          />

          <button
            type="button"
            class="button"
            :loading="isLoading"
            @click="onPost()"
          >
            Send Message
          </button>
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
              :subtitle="isRating.comment"
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

.reply-box-wrap {
          position: relative;
          margin-top: 8px;

          .reply-bubble {
            position: relative;
            padding: 20px;
            border: 1px solid var(--fade-grey-dark-5);
            border-radius: var(--radius-large);
            background: var(--white);
            width: 100%;

            &::after,
            &::before {
              bottom: 100%;
              inset-inline-start: 6%;
              border: solid transparent;
              content: ' ';
              height: 0;
              width: 0;
              position: absolute;
              pointer-events: none;
            }

            &::after {
              border-color: rgb(255 255 255 / 0%);
              border-bottom-color: var(--white);
              border-width: 16px;
              margin-inline-start: -16px;
            }

            &::before {
              border-color: rgb(237 237 237 / 0%);
              border-bottom-color: #e0e0e0;
              border-width: 17px;
              margin-inline-start: -17px;
            }

            .reply-as {
              display: flex;
              align-items: center;
              margin-top: 16px;

              img {
                display: block;
                height: 32px;
                width: 32px;
                border-radius: var(--radius-rounded);
              }

              .reply-details {
                margin-inline-start: 12px;

                span {
                  display: block;

                  &:first-child {
                    color: var(--dark-text);
                    font-family: var(--font-alt);
                    font-weight: 600;
                  }

                  &:nth-child(2) {
                    font-family: var(--font);
                    color: var(--light-text);
                  }
                }
              }

              .dropdown {
                margin-inline-start: auto;
              }
            }

            .control {
              position: relative;
              margin-top: 16px;

              .textarea {
                box-shadow: none;
                padding-bottom: 52px;
                border: none;
              }

              .button {
                position: absolute;
                height: 38px;
                bottom: 8px;
                inset-inline-end: 8px;
                background: var(--secondary);
                border-color: var(--secondary);
                color: var(--smoke-white);
                font-weight: 500;

                &:hover,
                &:focus {
                  box-shadow: var(--secondary-box-shadow);
                }
              }
            }

          }
}

/* ==========================================================================
2. Dropdown
========================================================================== */

.is-dark {
    .reply-box-wrap {
            .reply-bubble {
              background-color: var(--dark-sidebar-light-2);
              border-color: var(--dark-sidebar-light-4);

              &::before,
              &::after {
                border-bottom-color: var(--dark-sidebar-light-2) !important;
              }

              .reply-as {
                .reply-details {
                  span {
                    &:first-child {
                      color: var(--dark-dark-text);
                    }
                  }
                }
              }

              .control {
                .button {
                  background: var(--secondary);
                  border-color: var(--secondary);
                  color: var(--smoke-white);
                }
              }
            }

  }

  .dashboard-card {
      @include vuero-card--dark;
    }
}

/* ==========================================================================
4. Media Queries
========================================================================== */

// Media queries
@media (width <= 767px) {
    .reply-box-wrap {
            .reply-bubble {
              background-color: var(--dark-sidebar-light-2);
              border-color: var(--dark-sidebar-light-4);

              &::before,
              &::after {
                border-bottom-color: var(--dark-sidebar-light-2) !important;
              }

              .reply-as {
                .reply-details {
                  span {
                    &:first-child {
                      color: var(--dark-dark-text);
                    }
                  }
                }
              }

              .control {
                .button {
                  background: var(--secondary);
                  border-color: var(--secondary);
                  color: var(--smoke-white);
                }
              }
            }
          }

          .dashboard-card {
      &.is-tickets {
        padding: 30px;

        .ticket-list {
          .media-flex {
            .flex-meta {
              margin-bottom: 1rem;
            }
          }
        }
      }
    }
  }

// Tablet portrait
@media only screen and (device-width >= 768px) and (device-width <= 1024px) and (orientation: portrait) {
    .reply-box-wrap {
      padding-inline-start: 10px !important;
      padding-inline-end: 10px !important;

      .reply-bubble {
        &::after,
        &::before {
          inset-inline-start: 5% !important;
        }
      }
    }

  }

  .dashboard-card {
    @include vuero-s-card;

    height: 100%;

    &.is-company {
      text-align: center;
      padding: 30px;

      .v-avatar {
        display: block;
        margin: 0 auto 10px;

        .button {
          position: absolute;
          bottom: 0;
          inset-inline-end: 0;
          max-width: 35px;
        }
      }

      > h3 {
        color: var(--dark-text);
        font-family: var(--font-alt);
        font-size: 1.2rem;
        font-weight: 600;
      }

      > p {
        font-size: 0.9rem;
      }

      .description {
        padding: 10px 0 0;
      }

      .company-stats {
        display: flex;
        padding-top: 20px;
        margin-top: 20px;
        border-top: 1px solid var(--fade-grey-dark-3);

        .company-stat {
          width: 33.3%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;

          span {
            display: block;
            font-family: var(--font);

            &:first-child {
              text-transform: uppercase;
              font-family: var(--font-alt);
              font-size: 0.75rem;
              color: var(--light-text);
            }

            &:nth-child(2) {
              color: var(--dark-text);
              font-size: 1.4rem;
              font-weight: 600;
            }
          }
        }
      }
    }

    &.is-base-chart {
      padding: 0;
      display: flex;
      flex-direction: column;

      .content-box {
        padding: 30px;

        .revenue-stats {
          display: flex;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-3);

          .revenue-stat {
            margin-inline-end: 30px;
            font-family: var(--font);

            span {
              display: block;

              &:first-child {
                text-transform: uppercase;
                font-family: var(--font-alt);
                font-size: 0.75rem;
                color: var(--light-text);
              }

              &:nth-child(2) {
                color: var(--dark-text);
                font-size: 1.6rem;
                font-weight: 600;
              }

              &.current {
                color: var(--primary);
              }
            }
          }
        }
      }

      .chart-container {
        margin-top: auto;
      }
    }

    &.is-tickets {
      padding: 30px;

      .ticket-list {
        padding: 10px 0;

        .media-flex {
          + .media-flex {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid var(--fade-grey-dark-3);
          }

          .flex-meta {
            span {
              &:nth-child(2) {
                font-size: 1rem;
                margin: 4px 0;
                color: var(--light-text-dark-20);
                max-width: 430px;
              }

              &:nth-child(3) {
                font-size: 0.9rem;
                color: var(--light-text);
              }
            }
          }
        }
      }
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
      }
    }
  }

</style>
