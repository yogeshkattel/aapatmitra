export type LoginResponse  = {
  success: boolean,
  source: string,
  data: {
    accessToken: string,
    refreshTOken: string,
    existingUser: {
      id: number,
      userId: string,
      email: string,
      fullName: string,
      userType: string
    }
  }
}
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response  = await fetch('127.0.0.1:8000/auth/login', {
    method: 'POST',
    body: JSON.stringify({email, password})
  })
  return response.json()
}