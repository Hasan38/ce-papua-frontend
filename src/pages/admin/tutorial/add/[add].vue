<script setup lang="ts">
import { useCustomer } from '/@src/services/get-customer-custome'
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { useNotyf } from '/@src/composable/useNotyf'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useUserSession } from '/@src/stores/userSession'
import CKE from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const CKEditor = CKE.component
const route = useRoute()
const router = useRouter()
const userSession = useUserSession()
const config = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
}
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Add Archiev')
useHead({
  title: computed(() => 'Add Archiev'),
})
const type = (route.params?.add as string) ?? 'text'

const machine_type = ref([])
const customer = ref('')
const title = ref('')
const content = ref('')
const link = ref('')

const tagsSlotOptions = [
  {
    value: 'SR7500',
    name: 'SR7500',

  },
  {
    value: 'VS',
    name: 'VS',

  },
  {
    value: 'TCR',
    name: 'TCR',
    image: '/images/icons/stacks/vuejs.svg',
  },
  {
    value: 'ALL',
    name: 'ALL',
  },

]
const errors = ref<any>({})
const notyf = useNotyf()
const isLoading = ref(false)

const { y } = useWindowScroll()
const isStuck = computed(() => {
  return y.value > 30
})

// here we create a vee-validate form context that
// will be used in all vuero form components

const onSubmit = async () => {
  const $fetch = useLaravelFetch()
  if (isLoading.value) return
  isLoading.value = true

  await $fetch('/sanctum/csrf-cookie')
  await $fetch.raw('/api/tutorial', {
    method: 'POST',
    body: {
      user_id: userSession.user?.id,
      type: type,
      machine_type: machine_type.value,
      customer: customer.value,
      title: title.value,
      content: content.value,
      link: link.value,
    },
  }).then(() => {
    isLoading.value = false
    getRouter(type)
    notyf.success('data berhasil ditambahkan')
  }).catch ((e) => {
    isLoading.value = false
    if (e.status === 422) {
      errors.value = e.data.errors
    }
  })
}

function getRouter(types: any) {
  if (types === 'video') {
    return router.push('/admin/tutorial/video')
  }
  else if (types === 'text') {
    return router.push('/admin/tutorial/text')
  }
  else {
    return router.push('/admin/tutorial/text')
  }
}

</script>

<template>
  <form
    method="post"
    novalidate
    class="form-layout is-stacked"
    @submit.prevent="onSubmit"
  >
    <div class="form-outer">
      <div
        :class="[isStuck && 'is-stuck']"
        class="form-header stuck-header"
      >
        <div class="form-header-inner">
          <div class="left">
            <h3>Add {{ type }} Tutorial</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton
                icon="lnir lnir-arrow-left rem-100"
                light
                dark-outlined
                @click="getRouter(type)"
              >
                Cancel
              </VButton>
              <VButton
                type="submit"
                color="primary"
                raised
                :loading="isLoading"
              >
                Simpan
              </VButton>
            </div>
          </div>
        </div>
      </div>
      <div class="form-body">
        <div class="form-section">
          <div class="columns is-multiline">
            <div class="column is-6">
              <VField
                label="machine type"
              >
                <VControl>
                  <Multiselect
                    v-model="machine_type"
                    mode="tags"
                    placeholder="Select Type"
                    track-by="name"
                    label="name"
                    :search="true"
                    :options="tagsSlotOptions"
                    :max-height="145"
                  />

                  <p v-if="errors?.machine_type" class="help is-danger">
                    {{ errors?.machine_type }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField label="customer" class="is-autocomplete-select">
                <VControl icon="feather:calendar">
                  <Multiselect
                    v-model="customer"
                    :options="useCustomer"
                    placeholder="pilih customer"
                  />
                  <p v-if="errors?.customer" class="help is-danger">
                    {{ errors?.customer }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField

                label="Title"
              >
                <VControl fullwidth>
                  <VTextarea
                    v-model="title"
                    class="textarea"
                    rows="4"
                    placeholder="title/judul..."
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="true"
                  />

                  <p v-if="errors?.title" class="help is-danger">
                    {{ errors?.title }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div v-if="type !== 'video'" class="column is-12">
              <VField

                label="content"
              >
                <VControl fullwidth>
                  <CKEditor
                    v-model="content"
                    :editor="ClassicEditor"
                    class="ck-editor"
                    :config="config"
                  />

                  <p v-if="errors?.content" class="help has-text-danger">
                    {{ errors?.content }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VMessage closable>
                play video dari gdrive silahkan baca  <a href="https://sangsoonam.github.io/2019/07/27/how-to-embed-a-google-drive-video.html" target="_blank">panduan</a>.
              </VMessage>
              <VField

                label="Link"
              >
                <VControl fullwidth>
                  <VTextarea
                    v-model="link"
                    class="textarea"
                    rows="4"
                    placeholder="Link..."
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="true"
                  />

                  <p v-if="errors?.link" class="help is-danger">
                    {{ errors?.link }}
                  </p>
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.is-navbar {
  .form-layout {
    margin-top: 30px;
  }
}

.form-layout {
  max-width: 740px;
  margin: 0 auto;

  &.is-stacked {
    .form-outer {
      .form-body {
        padding: 0;

        .form-section {
          padding: 40px;
          border-bottom: 1px solid var(--fade-grey-dark-4);

          &.is-grey {
            background: #fafafa;
          }

          .form-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--fade-grey-dark-4);
            padding-bottom: 20px;
            margin-bottom: 30px;

            .left {
              h3 {
                font-family: var(--font-alt);
                font-weight: 600;
                color: var(--dark-text);
              }
            }
          }

          .form-section-inner {
            &.is-horizontal {
              max-width: 540px;
            }

            .field {
              &.is-horizontal {
                .field-label {
                  padding-top: 0.75em;
                }
              }
            }
          }

          .columns {
            .column {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
          }

          .field {
            .control {
              .checkbox {
                padding: 0;
                padding-inline-end: 10px;
                font-size: 0.9rem;
              }
            }
          }

          .participants {
            display: flex;
            padding-bottom: 10px;

            .v-avatar {
              margin-inline-end: 8px;
            }

            .add-participant {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 40px;
              width: 40px;
              min-width: 40px;
              border-radius: var(--radius-rounded);
              border: 1.6px dashed var(--light-text);
              color: var(--light-text);
              padding: 0;
              background: none;
              margin-inline-start: 4px;
              cursor: pointer;
              transition:
                color 0.3s,
                background-color 0.3s,
                border-color 0.3s,
                height 0.3s,
                width 0.3s;

              &:hover,
              &:focus {
                border: 1.6px solid var(--primary);
                color: var(--primary);
              }

              &:focus-visible {
                outline-offset: var(--accessibility-focus-outline-offset);
                outline-width: var(--accessibility-focus-outline-width);
                outline-style: var(--accessibility-focus-outline-style);
                outline-color: var(--accessibility-focus-outline-color);
              }

              svg {
                height: 16px;
                width: 16px;
              }
            }
          }

          .color-codes {
            display: flex;
            align-items: center;
            height: 38px;

            .color-code {
              height: 14px;
              width: 14px;
              border-radius: var(--radius-rounded);
              background: var(--white);
              margin-inline-end: 10px;
              border: 3px solid var(--light-text);
              cursor: pointer;
              opacity: 0.6;
              transition:
                color 0.3s,
                background-color 0.3s,
                border-color 0.3s,
                height 0.3s,
                width 0.3s;

              &:hover,
              &:focus {
                opacity: 1;
              }

              &:focus-visible {
                outline-offset: var(--accessibility-focus-outline-offset);
                outline-width: var(--accessibility-focus-outline-width);
                outline-style: var(--accessibility-focus-outline-style);
                outline-color: var(--accessibility-focus-outline-color);
              }

              &.is-primary {
                border-color: var(--primary);

                &.is-active {
                  background: var(--primary);
                }
              }

              &.is-secondary {
                border-color: var(--secondary);

                &.is-active {
                  background: var(--secondary);
                }
              }

              &.is-info {
                border-color: var(--info);

                &.is-active {
                  background: var(--info);
                }
              }

              &.is-success {
                border-color: var(--success);

                &.is-active {
                  background: var(--success);
                }
              }

              &.is-purple {
                border-color: var(--purple);

                &.is-active {
                  background: var(--purple);
                }
              }
            }
          }

          .add-link {
            display: inline-block;
            padding: 4px 0;
            font-family: var(--font);
            font-weight: 500;
            font-size: 0.9rem;
            color: var(--primary);
          }
        }
      }
    }
  }
}

.is-dark {
  .form-layout {
    &.is-stacked {
      .form-outer {
        .form-body {
          .form-section {
            border-color: var(--dark-sidebar-light-12);

            &.is-grey {
              background: var(--dark-sidebar-light-4);
            }

            .form-section-header {
              border-color: var(--dark-sidebar-light-12);

              .left {
                h3 {
                  color: var(--dark-dark-text);
                }
              }
            }

            .form-section-inner {
              .add-link {
                color: var(--primary);
              }

              .color-codes {
                .color-code {
                  background: var(--dark-sidebar-light-6);

                  &.is-primary {
                    border-color: var(--primary);
                  }
                }
              }

              .participants {
                .add-participant {
                  &:hover {
                    border: 1.6px solid var(--primary);
                    color: var(--primary);
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

@media only screen and (width <= 767px) {
  .form-layout {
    &.is-stacked {
      .form-outer {
        .form-body {
          .is-vhidden {
            display: none !important;
          }
        }
      }

      .v-calendar-combo {
        margin: 0 !important;

        .column {
          padding-top: 0 !important;
          padding-bottom: 0 !important;

          &:first-child {
            padding-inline-start: 0 !important;
          }

          &:last-child {
            padding-inline-end: 0 !important;
          }
        }
      }
    }
  }
}
</style>
