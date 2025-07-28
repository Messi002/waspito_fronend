import * as api from './api'

interface User {
  id: number
  name: string
  email: string
  points: number
  badge: string
}

class AuthService {
  private token: string | null = null
  private user: User | null = null

  async login(email: string, password: string): Promise<User | null> {
    try {
      const data = await api.login(email, password)
      this.token = data.access_token
      this.user = data.user
      if (this.token) {
  localStorage.setItem('authToken', this.token)
}
      localStorage.setItem('authUser', JSON.stringify(this.user))
      return this.user
    } catch (error) {
      // Login failed, return null
      return null
    }
  }

  async logout(): Promise<void> {
    await api.logout()
    this.token = null
    this.user = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  getToken(): string | null {
    if (this.token) return this.token
    const storedToken = localStorage.getItem('authToken')
    if (storedToken) {
      this.token = storedToken
      return this.token
    }
    return null
  }

  async getUser(): Promise<User | null> {
    if (this.user) return this.user
    const storedUser = localStorage.getItem('authUser')
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser)
        return this.user
      } catch {
        localStorage.removeItem('authUser')
      }
    }
    try {
      const user = await api.getCurrentUser()
      this.user = user
      localStorage.setItem('authUser', JSON.stringify(user))
      return user
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export default new AuthService()
