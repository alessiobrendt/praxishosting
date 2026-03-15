import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const dummyUser = {
    email: 'admin@example.com',
    password: 'password',
    token: 'auth-token',
  }

  const login = (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      if (email === dummyUser.email && password === dummyUser.password) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('token', dummyUser.token)
        }
        router.replace('/')
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token')
    }
    router.replace('/auth/sign-in')
  }

  const isAuthenticated = computed(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('token')
    }
    return false
  })

  return {
    login,
    logout,
    isAuthenticated,
    loading,
    error,
  }
}
