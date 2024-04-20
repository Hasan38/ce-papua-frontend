<script setup lang="ts">
import { useAreaGroup } from '/@src/services/get-areaGroup'
import { useCustomer } from '/@src/services/get-customer'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { useNotyf } from '/@src/composable/useNotyf'
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Edit Machine')
useHead({
  title: computed(() => 'Edit Machine'),
})
const router = useRouter()
const route = useRoute()
const id = (route.params?.edit as string) ?? ''
const errors = ref<any>({})
const notyf = useNotyf()
const isLoading = ref(false)
const area_id = ref(0)
const customer_id = ref(0)
const { y } = useWindowScroll()
const isStuck = computed(() => {
  return y.value > 30
})

const zodSchema = z
  .object({
    customer_type: z
      .string({
        required_error: 'masukan customer type',
      })
      .min(2, 'masukan customer type min 3 karakter'),
    branch: z
      .string({
        required_error: 'masukan nama branch',
      })
      .min(3, 'masukan nama branch min 3 karakter'),
    terminal_id: z
      .string({
        required_error: 'Enter terminal_id/wsid/tid/id machine',
      })
      .min(3, 'Your Terminal ID/WSID/ID/TID should contains at least 3 characters'),
    sn: z
      .string({
        required_error: 'Enter SN Machine',
      })
      .min(3, 'Your SN should contains at least 3 characters'),
    machine_type: z
      .string({
        required_error: 'Enter Machine Type',
      })
      .min(3, 'Your machine type should contains at least 3 characters'),

    address: z
      .string({
        required_error: 'Enter your Machine Address',
      })
      .min(8, 'Your Machine Address should contains at least 8 characters'),
    zona: z
      .string({
        required_error: 'Enter Zona',
      })
      .min(1, 'The Zona should be at least 1'),
    service_status: z
      .string({
        required_error: 'Enter Service Status',
      })
      .min(2, 'Your Service Status should contains at least 2 characters'),
    pengelola: z
      .string({
        required_error: 'Enter Pengelola',
      })
      .min(2, 'Your Pengelola should contains at least 2 characters'),

  })

// we need to declare the schema for the form
const validationSchema = toTypedSchema(zodSchema)

// Set initial values for the form

const { handleSubmit, setFieldValue } = useForm({
  validationSchema,
  initialValues: {
    customer_type: '',
    branch: '',
    terminal_id: '',
    sn: '',
    machine_type: '',
    address: '',
    zona: '',
    service_status: '',
    pengelola: '',

  },
})
// here we create a vee-validate form context that
// will be used in all vuero form components
async function getMachine() {
  const $fetch = useLaravelFetch()
  await $fetch.raw(`/api/machine/${id}`).then((res) => {
    setFieldValue('customer_type', res._data.data.customer_type)
    setFieldValue('branch', res._data.data.branch)
    setFieldValue('terminal_id', res._data.data.terminal_id)
    setFieldValue('sn', res._data.data.sn)
    setFieldValue('machine_type', res._data.data.machine_type)
    setFieldValue('address', res._data.data.address)
    setFieldValue('zona', `${res._data.data.zona}`)
    setFieldValue('service_status', res._data.data.service_status)
    setFieldValue('pengelola', res._data.data.pengelola)
    area_id.value = res._data.data.area_id
    customer_id.value = res._data.data.customer_id
  })
}
watchEffect(getMachine)

const onSubmit = handleSubmit(async (values) => {
  const $fetch = useLaravelFetch()
  if (customer_id.value === 0) {
    notyf.error(`pilih customer`)
    return
  }
  if (area_id.value === 0) {
    notyf.error(`pilih region`)
    return
  }

  if (isLoading.value) return
  isLoading.value = true

  await $fetch('/sanctum/csrf-cookie')
  await $fetch.raw(`/api/machine/${id}`, {
    method: 'PUT',
    body: {
      customer_id: customer_id.value,
      customer_type: values.customer_type,
      area_id: area_id.value,
      branch: values.branch,
      terminal_id: values.terminal_id,
      sn: values.sn,
      machine_type: values.machine_type,
      address: values.address,
      zona: parseInt(values.zona),
      service_status: values.service_status,
      pengelola: values.pengelola,

    },
  }).then(() => {
    isLoading.value = false
    router.push('/admin/setting/machine')
    notyf.success('machine berhasil di ubah')
  }).catch((e) => {
    isLoading.value = false
    if (e.status === 422) {
      errors.value = e.data.errors
    }
  })
})

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
        <VMessage v-if="errors.message" color="danger">
          {{ errors.message }}
        </VMessage>
        <div class="form-header-inner">
          <div class="left">
            <h3>Ubah Mesin</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton
                icon="lnir lnir-arrow-left rem-100"
                to="/admin/setting/machine"
                light
                dark-outlined
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
          <div class="form-section-header">
            <div class="left">
              <h3>Ubah Data Mesin</h3>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-6">
              <VField label="customer" class="is-autocomplete-select">
                <VControl icon="feather:calendar">
                  <Multiselect
                    v-model="customer_id"
                    :options="useCustomer"
                    placeholder="pilih customer"
                  />
                </VControl>
              </VField>
              <p v-if="errors?.customer_id" class="help is-danger">
                {{ errors?.customer_id }}
              </p>
            </div>
            <div class="column is-6">
              <VField
                id="customer_type"
                v-slot="{ field }"
                label="customer type"
              >
                <VControl icon="feather:slack">
                  <VInput
                    type="text"
                    placeholder="nama"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.customer_type" class="help is-danger">
                    {{ errors?.customer_type }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField label="area group" class="is-autocomplete-select">
                <VControl icon="feather:calendar">
                  <Multiselect
                    v-model="area_id"
                    :options="useAreaGroup"
                    placeholder="pilih area group"
                  />
                </VControl>
              </VField>
              <p v-if="errors?.area_id" class="help is-danger">
                {{ errors?.area_id }}
              </p>
            </div>

            <div class="column is-6">
              <VField
                id="branch"
                v-slot="{ field }"
                label="branch"
              >
                <VControl icon="feather:slack">
                  <VInput
                    type="text"
                    placeholder="branch"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.branch" class="help is-danger">
                    {{ errors?.branch }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField
                id="terminal_id"
                v-slot="{ field }"
                label="terminal id/wsid/tid"
              >
                <VControl icon="feather:slack">
                  <VInput
                    type="text"
                    placeholder="wsid"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.terminal_id" class="help is-danger">
                    {{ errors?.terminal_id }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField
                id="sn"
                v-slot="{ field }"
                label="SN"
              >
                <VControl icon="feather:slack">
                  <VInput

                    type="text"
                    placeholder="SN"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.sn" class="help is-danger">
                    {{ errors?.sn }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField
                id="machine_type"
                v-slot="{ field }"
                label="Machine Type"
              >
                <VControl>
                  <VSelect>
                    <VOption value="CRM">
                      CRM
                    </VOption>
                    <VOption value="CRM-ATM">
                      CRM-ATM
                    </VOption>
                    <VOption value="CRM-SR">
                      CRM-SR
                    </VOption>
                    <VOption value="CRM SR7500">
                      CRM SR7500
                    </VOption>

                    <VOption value="TCR">
                      TCR
                    </VOption>
                    <VOption value="TCR-17">
                      TCR-17
                    </VOption>
                    <VOption value="TCR-18">
                      TCR-18
                    </VOption>
                    <VOption value="TCR-18 Light">
                      TCR-18 Light
                    </VOption>
                    <VOption value="TCR-19 Light">
                      TCR-19 Light
                    </VOption>
                    <VOption value="TCR-S">
                      TCR-S
                    </VOption>
                    <VOption value="CRM MS-VS">
                      CRM MS-VS
                    </VOption>
                    <VOption value="CDM">
                      CDM
                    </VOption>
                    <VOption value="CRM SR7500 VS">
                      CRM SR7500 VS
                    </VOption>
                    <VOption value="Cash Sorter">
                      Cash Sorter
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
            </div>
            <div class="column is-6">
              <VField
                id="address"
                v-slot="{ field }"
                label="Address"
              >
                <VControl fullwidth>
                  <VTextarea

                    class="textarea"
                    rows="4"
                    placeholder="Alamat Mesin..."
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="true"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.address" class="help is-danger">
                    {{ errors?.address }}
                  </p>
                </VControl>
              </VField>
            </div>

            <div class="column is-6">
              <VField
                id="zona"
                v-slot="{ field }"
                label="zona"
              >
                <VControl>
                  <VSelect>
                    <VOption value="1">
                      ZONA 1
                    </VOption>
                    <VOption value="2">
                      ZONA 2
                    </VOption>
                    <VOption value="3">
                      ZONA 3
                    </VOption>
                  </VSelect>
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.zona" class="help is-danger">
                    {{ errors?.zona }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField
                id="service_status"
                v-slot="{ field }"
                label="service status"
              >
                <VControl>
                  <VSelect>
                    <VOption value="IW">
                      IW
                    </VOption>
                    <VOption value="MA">
                      MA
                    </VOption>
                    <VOption value="MS">
                      MS
                    </VOption>
                    <VOption value="ON CALL">
                      ON CALL
                    </VOption>
                    <VOption value="#N/A">
                      #N/A
                    </VOption>
                  </VSelect>
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.service_status" class="help is-danger">
                    {{ errors?.service_status }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField
                id="pengelola"
                v-slot="{ field }"
                label="pengelola"
              >
                <VControl icon="feather:slack">
                  <VInput
                    type="text"
                    placeholder="pengelola"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.pengelola" class="help is-danger">
                    {{ errors?.pengelola }}
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
