<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { useDarkmode } from '/@src/stores/darkmode'
import { useNotyf } from '/@src/composable/useNotyf'
import { useLaravelError } from '/@src/composable/useLaravelError'
import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { useUserSession } from '/@src/stores/userSession'
import { catchFieldError } from '/@src/utils/api/catchFormErrors'

const darkmode = useDarkmode()
const router = useRouter()
const route = useRoute()
const notyf = useNotyf()
const userSession = useUserSession()
const redirect = route.query.redirect as string

const isLoading = ref(false)
const { t } = useI18n()

const $fetch = useLaravelFetch()

const zodSchema = z
  .object({
    email: z
      .string({
        required_error: 'Enter your email first',
      })
      .email('A valid email address should be provided'),

    password: z
      .string({
        required_error: 'Enter your password to sign in',
      })
      .min(5, 'Your password should contains at least 5 characters'),
  })

// Zod has a great infer method that will
// infer the shape of the schema into a TypeScript type

// we need to declare the schema for the form

// we need to declare the schema for the form
type FormInput = z.infer<typeof zodSchema>
const validationSchema = toTypedSchema(zodSchema)
const initialValues = computed<FormInput>(() => ({
  email: '',
  password: '',
}))
// here we create a vee-validate form context that
// will be used in all vuero form components

if (userSession.isLoggedIn) {
  router.push('/admin/dashboard')
}

const { handleSubmit, setFieldError } = useForm({
  validationSchema,
  initialValues,
})

const handleLogin = handleSubmit(async (values) => {
  if (!isLoading.value) {
    isLoading.value = true

    try {
      await $fetch('/sanctum/csrf-cookie')
      const data = await $fetch('/api/login', {
        method: 'POST',
        body: values,
      })
      userSession.setUser(data.data)
      userSession.setToken(data.data.token)

      if (redirect) {
        router.push(redirect)
      }
      else {
        router.push('/admin/dashboard')
      }
      notyf.dismissAll()
      notyf.success(`${t('auth.logged-in')}, ${userSession.user!.name}`)
    }
    catch (err: any) {
      catchFieldError(err, setFieldError)
      notyf.error(useLaravelError(err))
    }
    finally {
      isLoading.value = false
    }
  }
})

useHead({
  title: 'Login - Vuero',
})
</script>

<template>
  <div class="auth-wrapper-inner is-single">
    <!--Fake navigation-->
    <div class="auth-nav">
      <div class="left" />
      <div class="center">
        <RouterLink
          to="/"
          class="header-item"
        >
          <AnimatedLogo
            width="38px"
            height="38px"
          />
        </RouterLink>
      </div>
      <div class="right">
        <label
          class="dark-mode ml-auto"
          tabindex="0"
          role="button"
          @keydown.space.prevent="(e) => (e.target as HTMLLabelElement).click()"
        >
          <input
            data-cy="dark-mode-toggle"
            type="checkbox"
            :checked="!darkmode.isDark"
            @change="darkmode.onChange"
          >
          <span />
        </label>
      </div>
    </div>

    <!--Single Centered Form-->
    <div class="single-form-wrap">
      <div class="inner-wrap">
        <!--Form Title-->
        <div class="auth-head">
          <h2>Welcome Back.</h2>
          <p>Please sign in to your account</p>
          <RouterLink to="/auth/signup-3">
            I do not have an account yet
          </RouterLink>
        </div>

        <!--Form-->
        <div class="form-card">
          <form
            method="post"
            novalidate
            @submit.prevent="handleLogin"
          >
            <div class="login-form">
              <VField id="email" v-slot="{field}">
                <VControl icon="feather:mail">
                  <VInput
                    type="email"
                    placeholder="Email"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                </VControl>
              </VField>
              <VField id="password" v-slot="{ field }">
                <VControl icon="feather:lock">
                  <VInput
                    type="password"
                    placeholder="Password"
                    autocomplete="current-password"
                  />
                  <p v-if="field?.errorMessage" class="help is-danger">
                    {{ field.errorMessage }}
                  </p>
                </VControl>
              </VField>

              <!-- Switch -->
              <VField>
                <VControl class="setting-item">
                  <VCheckbox
                    label="Remember me"
                    color="primary"
                    paddingless
                  />
                </VControl>
              </VField>

              <!-- Submit -->
              <div class="login">
                <VButton
                  :loading="isLoading"
                  type="submit"
                  color="primary"
                  bold
                  fullwidth
                  raised
                >
                  Sign In
                </VButton>
              </div>
            </div>
          </form>
        </div>

        <div class="forgot-link has-text-centered">
          <a>Forgot Password?</a>
        </div>
      </div>
    </div>
  </div>
</template>
