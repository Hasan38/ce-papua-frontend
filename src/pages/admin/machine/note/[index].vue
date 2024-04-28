<script setup lang="ts">
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { type Machine } from '/@src/models/machine'
import moment from 'moment'
import { useUserSession } from '/@src/stores/userSession'
import CKE from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useNotyf } from '/@src/composable/useNotyf'
import { type Note } from '/@src/models/note'
const CKEditor = CKE.component
const config = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
}

interface Response {
  success: boolean
  data: Machine
}

interface FormEmpresasProps {
  note?: Note
}
const props = withDefaults(defineProps<FormEmpresasProps>(), {
  note: Object,
})
const isNote = ref(props.note) ?? null
const modalEdit = ref(false)
const modalView = ref(false)
const userSession = useUserSession()
const $fetch = useLaravelFetch()
const filters = ref('')
const route = useRoute()
const isLoading = ref(false)
const errors = ref<any>({})
const notyf = useNotyf()
const debouncedFilter = useDebounce(filters, 500)
const machineData = ref<Machine>()
const modalAdd = ref(false)
const content = ref('')
const modalDelete = ref(false)
const title = ref('')
const id = (route.params?.index as string) ?? ''

async function getNote() {
  await $fetch.raw<Response>('/api/note', {
    query: {
      q: debouncedFilter.value,
      id: id,
    },
    method: 'GET' }).then((res) => {
    machineData.value = res._data?.data
  })
}
watchEffect(getNote)

function dateshow(value: any) {
  // here u modify data
  return moment(value).fromNow() // and set to the view
}

const onAdd = async () => {
  if (isLoading.value) return
  isLoading.value = true

  await $fetch('/sanctum/csrf-cookie')
  await $fetch.raw('/api/note', {
    method: 'POST',
    body: {
      user_id: userSession.user?.id,
      title: title.value,
      machine_id: id,
      content: content.value,

    },
  }).then(() => {
    getNote()
    isLoading.value = false
    modalAdd.value = false
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
  isNote.value = row
}

const onEdit = async () => {
  if (isLoading.value) return
  isLoading.value = true

  await $fetch('/sanctum/csrf-cookie')
  await $fetch.raw(`/api/note/${isNote.value.id}`, {
    method: 'PUT',
    body: {
      user_id: userSession.user?.id,
      title: isNote.value.title,
      machine_id: id,
      content: isNote.value.content,

    },
  }).then(() => {
    getNote()
    isLoading.value = false
    modalEdit.value = false
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
  isNote.value = row
}

const onDelete = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch.raw(`/api/note/${isNote.value.id}`, { method: 'DELETE' }).then(() => {
      isLoading.value = false
      getNote()
      modalDelete.value = false
    })
  }
  catch ($e: any) {
    isLoading.value = false
    notyf.error($e)
  }
}

function addView(row: any) {
  modalView.value = true
  isNote.value = row
}
</script>

<template>
  <div>
    <div class="tile-grid-toolbar">
      <VBreadcrumb
        :items="[
          {
            label: 'Back',
            icon: 'feather:arrow-left',
            // use external links
            to: '/admin/machine',
          },
          {
            label: `[ ${machineData?.terminal_id ?? '404'} ]`,

          }

        ]"
        separator="arrow"
        with-icons
      />
    </div>
    <div class="tile-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        >
      </VControl>
      <div class="buttons">
        <VButton
          color="primary"
          raised
          @click="modalAdd = true"
        >
          <span class="icon">
            <i
              aria-hidden="true"
              class="fas fa-plus"
            />
          </span>
          <span>Add Note</span>
        </VButton>
      </div>
    </div>

    <div class="tile-grid tile-grid-v2">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        :class="[machineData?.notes?.length !== 0 && 'is-hidden']"
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

      <!--Tile Grid v1-->
      <TransitionGroup
        name="list"
        tag="div"
        class="columns is-multiline"
      >
        <!--Grid item-->
        <div
          v-for="item in machineData?.notes"
          :key="item.id"
          class="column is-6"
        >
          <div class="tile-grid-item">
            <div class="tile-grid-item-inner">
              <div class="meta">
                <span class="dark-inverted">{{ item.title }}</span>
                <span>
                  <span >{{ item.users?.name }}</span>
                  <i
                    aria-hidden="true"
                    class="fas fa-circle icon-separator"
                  />
                  <span>{{ dateshow(item.created_at) }}</span>
                </span>
              </div>
              <VDropdown
                icon="feather:more-vertical"
                spaced
                right
              >
                <template #content>
                  <a
                    role="menuitem"
                    href="#"
                    class="dropdown-item is-media"
                    @click="addView(item)"
                  >
                    <div class="icon">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-eye"
                      />
                    </div>
                    <div class="meta">
                      <span>View</span>
                      <span>View this note</span>
                    </div>
                  </a>
                  <a
                    role="menuitem"
                    href="#"
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
                      <span>Edit this note</span>
                    </div>
                  </a>

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
                      <span>Delete this note</span>
                    </div>
                  </a>
                </template>
              </VDropdown>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <VModal
      is="form"
      :open="modalAdd"
      size="large"
      actions="center"
      title="Add Note"
      @submit.prevent="onAdd"
      @close="modalAdd = false"
    >
      <template #content>
        <VField

          label="Title"
        >
          <VControl fullwidth>
            <VTextarea
              v-model="title"
              class="textarea"
              rows="4"
              placeholder="Contoh IP Param, MK, dll..."
              autocomplete="off"
              autocapitalize="off"
              spellcheck="true"
            />

            <p v-if="errors?.title" class="help is-danger">
              {{ errors?.title }}
            </p>
          </VControl>
        </VField>

        <VField

          label="Content"
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
      title="Edit Note"
      @submit.prevent="onEdit"
      @close="modalEdit = false"
    >
      <template #content>
        <VField

          label="Title"
        >
          <VControl fullwidth>
            <VTextarea
              v-model="isNote.title"
              class="textarea"
              rows="4"
              placeholder="Contoh IP Param, MK, dll..."
              autocomplete="off"
              autocapitalize="off"
              spellcheck="true"
            />

            <p v-if="errors?.title" class="help is-danger">
              {{ errors?.title }}
            </p>
          </VControl>
        </VField>

        <VField

          label="Content"
        >
          <VControl fullwidth>
            <CKEditor
              v-model="isNote.content"
              :editor="ClassicEditor"
              class="ck-editor"
              :config="config"
            />

            <p v-if="errors?.content" class="help has-text-danger">
              {{ errors?.content }}
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
              :subtitle="`${isNote.title}`"
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
    <VModal
      :open="modalView"
      size="large"
      actions="center"
      :title="`${isNote.title}`"
      @close="modalView = false"
    >
      <template #content>
        <VField label="Title">
          <VFlexItem flex-grow="1">
            <VMarkdownPreview :source="isNote.title" />
          </VFlexItem>
        </VField>
        <VField label="Content">
          <VFlexItem flex-grow="1">
            <VMarkdownPreview :source="isNote.content" />
          </VFlexItem>
        </VField>
      </template>
      <template #action />
    </VModal>
  </div>
</template>

  <style lang="scss">
  @import '/@src/scss/abstracts/all';

  .tile-grid {
    .columns {
      margin-inline-start: -0.5rem !important;
      margin-inline-end: -0.5rem !important;
      margin-top: -0.5rem !important;
    }

    .column {
      padding: 0.5rem !important;
    }
  }

  .tile-grid-v2 {
    .tile-grid-item {
      @include vuero-s-card;

      border-radius: 14px;
      padding: 16px;
      cursor: pointer;

      &:hover,
      &:focus {
        border-color: var(--primary);
        box-shadow: var(--light-box-shadow);
      }

      .tile-grid-item-inner {
        display: flex;
        align-items: center;

        > img {
          display: block;
          width: 50px;
          height: 50px;
          min-width: 50px;
        }

        .meta {
          margin-inline-start: 10px;
          line-height: 1.4;

          span {
            display: block;
            font-family: var(--font);

            &:first-child {
              color: var(--dark-text);
              font-family: var(--font-alt);
              font-weight: 600;
              font-size: 1rem;
            }

            &:nth-child(2) {
              display: flex;
              align-items: center;

              span {
                display: inline-block;
                color: var(--light-text);
                font-size: 0.8rem;
                font-weight: 400;
              }

              .icon-separator {
                position: relative;
                font-size: 4px;
                color: var(--light-text);
                padding: 0 6px;
              }
            }
          }
        }

        .dropdown {
          margin-inline-start: auto;
        }
      }
    }
  }

  .is-dark {
    .tile-grid {
      .tile-grid-item {
        @include vuero-card--dark;
      }
    }

    .tile-grid-v2 {
      .tile-grid-item {
        @include vuero-card--dark;

        &:hover,
        &:focus {
          border-color: var(--primary) !important;
        }
      }
    }
  }
  </style>
