<script setup lang="ts">
import { useAreaGroup } from '/@src/services/get-areaGroup'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { useNotyf } from '/@src/composable/useNotyf'
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Tambah User')
useHead({
  title: computed(() => 'Tambah User'),
})

const router = useRouter()
const errors = ref<any>({})
const notyf = useNotyf()
const isLoading = ref(false)
const area_id = ref(0)
const { y } = useWindowScroll()
const isStuck = computed(() => {
  return y.value > 30
})

const zodSchema = z
  .object({
    name: z
      .string({
        required_error: 'masukan nama',
      })
      .min(3, 'masukan nama'),
    email: z
      .string({
        required_error: 'Enter your email first',
      })
      .email('A valid email address should be provided'),
    nip: z
      .string({
        required_error: 'Enter a valid NIP',
      })
      .min(8, 'Your NIP should contains at least 8 characters'),

    address: z
      .string({
        required_error: 'Enter your Address',
      })
      .min(8, 'Your Address should contains at least 8 characters'),
    phone: z
      .string({
        required_error: 'Enter your Phone Number',
      }).min(10, 'Your Phone Number should contains at least 8 characters'),

  })

// we need to declare the schema for the form
const validationSchema = toTypedSchema(zodSchema)

// Set initial values for the form

const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    email: '',
    nip: '',
    address: '',
    phone: '',

  },
})
// here we create a vee-validate form context that
// will be used in all vuero form components

const onSubmit = handleSubmit(async (values) => {
  const $fetch = useLaravelFetch()
  if (area_id.value === 0) {
    notyf.error(`pilih region`)
    return
  }

  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch('/sanctum/csrf-cookie')
    await $fetch.raw('/api/register', {
      method: 'POST',
      body: {
        name: values.name,
        nip: values.nip,
        email: values.email,
        area_id: area_id.value,
        address: values.address,
        phone: values.phone,
        password: 'Hitachi2',

      },
    })
    isLoading.value = false
    router.push('/admin/setting/user')
    notyf.success('user berhasil ditambahkan')
  }
  catch (e: any) {
    isLoading.value = false
    if (e.status === 422) {
      errors.value = e.data.errors
    }
  }
  finally {
    isLoading.value = false
  }
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
        <div class="form-header-inner">
          <div class="left">
            <h3>Tambah User</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton
                icon="lnir lnir-arrow-left rem-100"
                to="/admin/setting/user"
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
              <h3>Isi Data User</h3>
            </div>
          </div>
          <div class="columns is-multiline">
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
            </div>
            <div class="column is-6">
              <VField
                id="name"
                v-slot="{ field }"
                label="nama"
              >
                <VControl icon="feather:slack">
                  <VInput
                    type="text"
                    placeholder="nama"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.name" class="help is-danger">
                    {{ errors?.name }}
                  </p>
                </VControl>
              </VField>
            </div>
            
            <div class="column is-6">
              <VField
                id="email"
                v-slot="{ field }"
                label="email"
              >
                <VControl icon="feather:mail">
                  <VInput
                    type="email"
                    placeholder="email"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.email" class="help is-danger">
                    {{ errors?.email }}
                  </p>
                </VControl>
              </VField>
            </div>
            <div class="column is-6">
              <VField
                id="nip"
                v-slot="{ field }"
                label="NIP"
              >
                <VControl icon="feather:slack">
                  <VInput

                    type="text"
                    placeholder="NIP"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.nip" class="help is-danger">
                    {{ errors?.nip }}
                  </p>
                </VControl>
              </VField>
            </div>

            <div class="column is-6">
              <VField
                id="address"
                v-slot="{ field }"
                label="Alamat"
              >
                <VControl fullwidth>
                  <VTextarea

                    class="textarea"
                    rows="4"
                    placeholder="Alamat..."
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
                id="phone"
                v-slot="{ field }"
                label="no hp"
              >
                <VControl icon="feather:phone">
                  <VInput
                    type="text"
                    placeholder="no hp"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                  <p v-if="errors?.phone" class="help is-danger">
                    {{ errors?.phone }}
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
