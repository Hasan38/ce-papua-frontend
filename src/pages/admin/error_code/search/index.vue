<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import type { ErrorResponse, ErrorCode } from '/@src/models/error_code'
import { toTypedSchema } from '@vee-validate/zod'
import { useUserSession } from '/@src/stores/userSession'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { useNotyf } from '/@src/composable/useNotyf'

const $fetch = useLaravelFetch()
const code = ref('')
const userSession = useUserSession()
const model = ref('SR7500')
const isLoading = ref(false)
const errorData = ref<ErrorCode[]>()
const errors = ref({})
const modalPost = ref(false)
const errorValue = ref<any>([])
const notyf = useNotyf()

interface FormEmpresasProps {
  errorcode?: ErrorCode

}
const props = withDefaults(defineProps<FormEmpresasProps>(), {
  errorcode: Object,
})

const isError = ref(props.errorcode) ?? null

async function getError() {
  isLoading.value = true
  try {
    const { _data: data } = await $fetch.raw<ErrorResponse>('/api/error_code', {
      query: {
        code: code.value,
        model: model.value,
      },

      // controller is an instance of AbortController,
      // this allow to abort the request when the state
      // is invalidated (before fetchData will be retriggered)

    })
    isLoading.value = false
    errorData.value = data?.data.error
  }
  catch (error: any) {
    isLoading.value = false
    if (error.status === 422) {
      errors.value = error.data.errors
    }
  }
  finally {
    isLoading.value = false
  }
}

const modalView = ref(false)
function onRowClick(row: any) {
  modalView.value = true
  isError.value = row
}

function addPost(row: any) {
  modalPost.value = true
  isError.value = row
  errorValue.value = [`${code.value}`, `${row.Code}`]
}

const zodSchema = z
  .object({
    machine_type: z
      .string({
        required_error: 'pilih tipe mesin',
      })
      .min(2, 'type mesin min 3 karakter'),
    problem_info: z
      .string({
        required_error: 'isi problem',
      })
      .min(3, 'isi problem min 3 karakter'),
    action_taken: z
      .string({
        required_error: 'isi detail action',
      })
      .min(3, 'action taken should contains at least 3 characters'),

  })

// we need to declare the schema for the form
const validationSchema = toTypedSchema(zodSchema)

// Set initial values for the form

const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    machine_type: '',
    problem_info: '',
    action_taken: '',

  },
})

const onPost = handleSubmit(async (values) => {
  const $fetch = useLaravelFetch()
  if (!errorValue.value) {
    notyf.error(`masukan error code`)
    return
  }

  if (isLoading.value) return
  isLoading.value = true

  await $fetch('/sanctum/csrf-cookie')
  await $fetch.raw('/api/error_code_ce', {
    method: 'POST',
    body: {
      user_id: userSession.user?.id,
      error_code: errorValue.value,
      machine_type: values.machine_type,
      problem_info: values.problem_info,
      action_taken: values.action_taken,

    },
  }).then(() => {
    isLoading.value = false
    modalPost.value = false
    notyf.success('data berhasil ditambahkan')
  }).catch((e) => {
    isLoading.value = false
    if (e.status === 422) {
      errors.value = e.data.errors
    }
  })
})
</script>

<template>
  <div>
    <form
      method="post"
      novalidate
      class="form-layout is-stacked"
      @submit.prevent="getError"
    >
      <div class="form-outer">
        <div class="form-body">
          <div class="form-section">
            <div class="columns is-multiline">
              <div class="column is-6">
                <VField label="Masukan Error Code">
                  <VControl expanded>
                    <VInput
                      v-model="code"
                      type="text"
                      class="input is-rounded"
                      placeholder="Masukan error code"
                    />
                    <p v-if="errors?.code" class="help is-danger">
                      {{ errors?.code }}
                    </p>
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField label="Type Mesin">
                  <VControl class="has-icons-left mr-2" icon="lnil lnil-basketball">
                    <VSelect v-model="model">
                      <VOption value="SR7500">
                        SR7500
                      </VOption>
                      <VOption value="VS-ATM">
                        VS-ATM
                      </VOption>
                      <VOption value="TCR">
                        TCR
                      </VOption>
                    </VSelect>
                    <p v-if="errors?.model" class="help is-danger">
                      {{ errors?.model }}
                    </p>
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
        </div>
        <div

          class="form-header stuck-header"
        >
          <div class="form-header-inner">
            <div class="right">
              <div class="buttons">
                <VButton
                  type="submit"
                  color="primary"
                  rounded
                  :loading="isLoading"
                >
                  Search
                </VButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div class="page-content-inner mt-3">
      <!--List-->
      <div class="list-view list-view-v3">
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

        <!--Active Tab-->

        <div class="list-view-inner">
          <TransitionGroup
            name="list-complete"
            tag="div"
          >
            <!--Item-->
            <div
              v-for="item in errorData"
              :key="item.ID"
              class="list-view-item"
            >
              <div class="list-view-item-inner">
                <div class="meta-left">
                  <h4>
                    {{ item.Title }}
                  </h4>
                  <span>
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:map-pin"
                    />
                    <span>{{ item.Code }}</span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:clock"
                    />
                    <span>{{ item.Unit }}</span>
                    <i
                      aria-hidden="true"
                      class="fas fa-circle icon-separator"
                    />
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:check-circle"
                    />
                    <span>{{ item.Model }}</span>
                  </span>
                </div>
                <div class="meta-right">
                  <VIconButton
                    icon="feather:eye"
                    class="hint--bubble hint--primary hint--top mr-1"
                    data-hint="View"
                    light
                    circle
                    @click="onRowClick(item)"
                  />

                  <VIconButton
                    icon="feather:share-2"
                    class="hint--bubble hint--primary hint--top"
                    data-hint="Post"
                    light
                    circle
                    @click="addPost(item)"
                  />
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <VModal
      :open="modalView"
      size="large"
      actions="center"
      :title="`${isError.Code}/${isError.Model}`"
      @close="modalView = false"
    >
      <template #content>
        <VField label="Title">
          <VFlexItem flex-grow="1">
            <VMarkdownPreview :source="isError.Title" />
          </VFlexItem>
        </VField>
        <VField label="Content">
          <VFlexItem flex-grow="1">
            <VMarkdownPreview :source="isError.Contents" />
          </VFlexItem>
        </VField>
        <VField label="Detail">
          <VFlexItem flex-grow="1">
            <VMarkdownPreview :source="isError.Detail" />
          </VFlexItem>
        </VField>

        <div class="timeline-wrapper">
          <div class="timeline-header" />
          <div class="timeline-wrapper-inner">
            <div class="timeline-container">
              <!--Timeline item-->
              <div v-if="isError.MAP1" class="timeline-item is-unread">
                <div class="date">
                  <span>Step 1</span>
                </div>
                <div class="dot is-info" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP1 }}
                        </p>
                        <span>step 1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP2" class="timeline-item is-unread">
                <div class="date">
                  <span>Step 2</span>
                </div>
                <div class="dot is-danger" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP2 }}
                        </p>
                        <span>step 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP3" class="timeline-item">
                <div class="date">
                  <span>Step 3</span>
                </div>
                <div class="dot is-success" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP3 }}
                        </p>
                        <span>step 3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP4" class="timeline-item">
                <div class="date">
                  <span>Step 4</span>
                </div>
                <div class="dot is-purple" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP4 }}
                        </p>
                        <span>step 4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP5" class="timeline-item">
                <div class="date">
                  <span>Step 5</span>
                </div>
                <div class="dot is-warning" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP5 }}
                        </p>
                        <span>step 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP6" class="timeline-item">
                <div class="date">
                  <span>Step 6</span>
                </div>
                <div class="dot is-info" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP6 }}
                        </p>
                        <span>step 6</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP7" class="timeline-item">
                <div class="date">
                  <span>Step 7</span>
                </div>
                <div class="dot is-danger" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP7 }}
                        </p>
                        <span>step 7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP8" class="timeline-item">
                <div class="date">
                  <span>Step 8</span>
                </div>
                <div class="dot is-purple" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP8 }}
                        </p>
                        <span>step 8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isError.MAP9" class="timeline-item is-unread">
                <div class="date">
                  <span>Step 9</span>
                </div>
                <div class="dot is-info" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP9 }}
                        </p>
                        <span>step 9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP10" class="timeline-item is-unread">
                <div class="date">
                  <span>Step 10</span>
                </div>
                <div class="dot is-danger" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP10 }}
                        </p>
                        <span>step 10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP11" class="timeline-item">
                <div class="date">
                  <span>Step 11</span>
                </div>
                <div class="dot is-success" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP11 }}
                        </p>
                        <span>step 11</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP12" class="timeline-item">
                <div class="date">
                  <span>Step 12</span>
                </div>
                <div class="dot is-purple" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP12 }}
                        </p>
                        <span>step 12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP13" class="timeline-item">
                <div class="date">
                  <span>Step 13</span>
                </div>
                <div class="dot is-warning" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP13 }}
                        </p>
                        <span>step 13</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP14" class="timeline-item">
                <div class="date">
                  <span>Step 14</span>
                </div>
                <div class="dot is-info" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP14 }}
                        </p>
                        <span>step 14</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP15" class="timeline-item">
                <div class="date">
                  <span>Step 15</span>
                </div>
                <div class="dot is-danger" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP15 }}
                        </p>
                        <span>step 15</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP16" class="timeline-item">
                <div class="date">
                  <span>Step 16</span>
                </div>
                <div class="dot is-purple" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP16 }}
                        </p>
                        <span>step 16</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="isError.MAP17" class="timeline-item is-unread">
                <div class="date">
                  <span>Step 17</span>
                </div>
                <div class="dot is-info" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP17 }}
                        </p>
                        <span>step 17</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP18" class="timeline-item is-unread">
                <div class="date">
                  <span>Step 18</span>
                </div>
                <div class="dot is-danger" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP18 }}
                        </p>
                        <span>step 18</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP19" class="timeline-item">
                <div class="date">
                  <span>Step 19</span>
                </div>
                <div class="dot is-success" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP19 }}
                        </p>
                        <span>step 19</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--Timeline item-->
              <div v-if="isError.MAP20" class="timeline-item">
                <div class="date">
                  <span>Step 20</span>
                </div>
                <div class="dot is-purple" />
                <div class="content-wrap">
                  <div class="content-box">
                    <div class="status" />

                    <div class="box-text">
                      <div class="meta-text">
                        <p>
                          {{ isError.MAP20 }}
                        </p>
                        <span>step 20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #action />
    </VModal>
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
          id="machine_type"
          v-slot="{ field }"
          label="Machine Type"
        >
          <VControl>
            <VSelect>
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
            <p v-if="field?.errorMessage" class="help is-danger">
              {{ field.errorMessage }}
            </p>
            <p v-if="errors?.machine_type" class="help is-danger">
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
            <p v-if="errors?.error_code" class="help is-danger">
              {{ errors?.error_code }}
            </p>
          </VControl>
        </VField>
        <VField
          id="problem_info"
          v-slot="{ field }"
          label="Problem Info"
        >
          <VControl fullwidth>
            <VTextarea

              class="textarea"
              rows="4"
              placeholder="Problem Info..."
              autocomplete="off"
              autocapitalize="off"
              spellcheck="true"
            />
            <p v-if="field?.errorMessage" class="help is-danger">
              {{ field.errorMessage }}
            </p>
            <p v-if="errors?.problem_info" class="help is-danger">
              {{ errors?.problem_info }}
            </p>
          </VControl>
        </VField>
        <VField
          id="action_taken"
          v-slot="{ field }"
          label="Detail Action"
        >
          <VControl fullwidth>
            <VTextarea

              class="textarea"
              rows="4"
              placeholder="Detail Action..."
              autocomplete="off"
              autocapitalize="off"
              spellcheck="true"
            />
            <p v-if="field?.errorMessage" class="help is-danger">
              {{ field.errorMessage }}
            </p>
            <p v-if="errors?.action_taken" class="help is-danger">
              {{ errors?.action_taken }}
            </p>
          </VControl>
        </VField>
      </template>
      <template #action>
        <VButton
          type="submit"
          color="primary"
          raised
          :loading="isLoading"
        >
          Simpan
        </VButton>
      </template>
    </VModal>
  </div>
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

  .timeline-wrapper {
    .timeline-wrapper-inner {
      .timeline-container {
        .timeline-item {
          &::before {
            background: var(--dark-sidebar-light-20);
          }

          .content-wrap {
            @include vuero-card--dark;

            .content-box {
              .status {
                background: var(--dark-sidebar-light-20);
              }

              .box-text {
                .meta-text {
                  p {
                    span {
                      color: var(--dark-dark-text);
                    }

                    a {
                      color: var(--primary);
                    }
                  }
                }
              }
            }
          }
        }
      }

      .load-more-wrap {
        .button {
          background: var(--dark-sidebar-light-2) !important;
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

  .timeline-wrapper {
    .timeline-wrapper-inner {
      padding-top: 0;

      .timeline-container {
        .timeline-item {
          flex-direction: column;

          &::before {
            display: none;
          }

          .dot {
            display: none;
          }

          .date {
            align-self: end;
            margin-bottom: 4px;
          }

          .content-wrap {
            .content-box {
              .box-end {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}

.list-view-v3 {
  .list-view-item {
    @include vuero-r-card;

    margin-bottom: 16px;
    padding: 16px;

    .list-view-item-inner {
      display: flex;
      align-items: center;

      > img {
        width: 100%;
        max-width: 60px;
        min-width: 60px;
        max-height: 60px;
        min-height: 60px;
        border-radius: var(--radius-rounded);
        border: 1px solid var(--fade-grey);
      }

      .meta-left {
        margin-inline-start: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 500;
          font-size: 1.1rem;
          line-height: 1;
        }

        > span:not(.tag) {
          font-size: 0.9rem;
          color: var(--light-text);

          svg {
            position: relative;
            top: 1px;
            height: 12px;
            width: 12px;
          }

          .icon-separator {
            position: relative;
            top: -3px;
            font-size: 5px;
            color: var(--light-text);
            padding: 0 8px;
          }

          .iconify {
            margin-inline-end: 0.25rem;
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
  .list-view-v3 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        > img {
          border-color: var(--dark-sidebar-light-12);
        }

        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }
        }

        .meta-right {
          .buttons {
            .button {
              &:nth-child(2) {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-8);
                color: var(--dark-dark-text);
                transition:
                  color 0.3s,
                  background-color 0.3s,
                  border-color 0.3s,
                  height 0.3s,
                  width 0.3s;

                &:hover,
                &:focus {
                  border-color: var(--primary);
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

@media only screen and (width <= 767px) {
  .list-view-v3 {
    .list-view-item {
      position: relative;
      padding: 20px;

      .list-view-item-inner {
        flex-direction: column;

        > img {
          margin-bottom: 1rem;
        }

        .meta-left {
          margin-inline-start: 0;

          h3 {
            text-align: center;
            margin-bottom: 6px;
          }

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
          width: 100%;

          .buttons {
            margin: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .button {
              width: 100%;
              margin: 10px 0;

              &:first-child {
                width: 100%;
                max-width: 240px;
                margin: 10px auto;
              }

              &:nth-child(2) {
                position: absolute;
                top: 10px;
                inset-inline-end: 10px;
                max-width: 35px;
              }
            }
          }
        }
      }
    }
  }
}

.timeline-wrapper {
  max-width: 940px;
  margin: 0 auto;

  .timeline-wrapper-inner {
    padding-top: 30px;

    .timeline-container {
      .timeline-item {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        &::before {
          content: '';
          position: absolute;
          top: 46px;
          inset-inline-start: 111px;
          height: 100%;
          width: 2px;
          background: var(--placeholder);
          z-index: 0;
        }

        &:last-child {
          &::before {
            display: none;
          }
        }

        &.is-unread {
          .content-wrap {
            .content-box {
              .status {
                background: var(--red) !important;
              }
            }
          }
        }

        .date {
          width: 80px;
          font-family: var(--font);
          text-align: inset-inline-end;

          span {
            font-size: 0.9rem;
            color: var(--light-text);
          }
        }

        .dot {
          position: relative;
          height: 14px;
          width: 14px;
          border-radius: var(--radius-rounded);
          border: 2.6px solid var(--primary);
          margin: 0 25px;
          z-index: 1;

          &.is-info {
            border-color: var(--info);
          }

          &.is-success {
            border-color: var(--success);
          }

          &.is-warning {
            border-color: var(--warning);
          }

          &.is-danger {
            border-color: var(--danger);
          }

          &.is-purple {
            border-color: var(--purple);
          }
        }

        .content-wrap {
          @include vuero-s-card;

          flex-grow: 2;

          .content-box {
            display: flex;
            align-items: center;

            .status {
              height: 8px;
              width: 8px;
              min-width: 8px;
              border-radius: var(--radius-rounded);
              background: var(--light-text-light-15);
              margin: 0 16px 0 0;
            }

            .box-text {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-inline-start: 12px;
              flex-grow: 2;

              .meta-text {
                line-height: 1.2;

                p {
                  color: var(--light-text-dark-10);

                  span {
                    font-family: var(--font-alt);
                    color: var(--dark-text);
                    font-weight: 600;
                  }

                  a {
                    color: var(--primary);
                  }

                  .tag {
                    position: relative;
                    top: -1px;
                    font-weight: 500;
                    line-height: 1.8;
                    height: 1.8em;
                    margin: 0 2px;
                  }
                }

                > span {
                  color: var(--light-text);
                  font-size: 0.9rem;
                }
              }
            }

            .box-end {
              margin-inline-start: auto;

              .v-avatar {
                margin: 0 2px;
              }
            }
          }

          .meta-content {
            padding-inline-start: 78px;
          }
        }
      }
    }

    .load-more-wrap {
      padding: 40px 0;

      .button {
        min-width: 240px;
        min-height: 50px;
        text-transform: uppercase;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--light-text);
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .timeline-wrapper {
    .timeline-wrapper-inner {
      padding-top: 0;

      .timeline-container {
        .timeline-item {
          flex-direction: column;

          &::before {
            display: none;
          }

          .dot {
            display: none;
          }

          .date {
            align-self: end;
            margin-bottom: 4px;
          }

          .content-wrap {
            .content-box {
              .box-end {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
