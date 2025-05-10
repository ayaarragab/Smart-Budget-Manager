// API service for making authenticated requests to the backend

// Define the base URL for API requests - adjust this to match your backend URL
const API_BASE_URL = "/api" // This will be proxied through Next.js

// Helper function to get the auth token
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Helper function to check if a response is an empty result (not an error)
const isEmptyResult = (response: Response) => {
  return (
    response.ok &&
    (response.url.includes("/GetAll") ||
      response.url.includes("/GetByWalletId") ||
      response.url.includes("/GetByUserId") ||
      response.url.includes("/GetById"))
  )
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  // Check if the response is a 404 Not Found
  if (response.status === 404) {
    console.warn(`API endpoint not found: ${response.url}`)

    // For collection endpoints, return an empty array instead of throwing an error
    if (
      response.url.includes("/GetAll") ||
      response.url.includes("/GetByWalletId") ||
      response.url.includes("/GetByUserId")
    ) {
      console.warn(`Returning empty array for missing endpoint: ${response.url}`)
      return { data: [] }
    }

    return Promise.reject(`API endpoint not found: ${response.url}. Please check your backend server configuration.`)
  }

  // Check the content type to see if it's JSON
  const contentType = response.headers.get("content-type")

  if (contentType && contentType.includes("application/json")) {
    try {
      const data = await response.json()
      console.log("API Response:", data)

      // If the response is successful but contains no data, return an empty array or object
      // instead of treating it as an error
      if (response.ok) {
        // For endpoints that return collections, normalize empty results to empty arrays
        if (
          response.url.includes("/GetAll") ||
          response.url.includes("/GetByWalletId") ||
          response.url.includes("/GetByUserId")
        ) {
          // If data is null or undefined, return an empty array
          if (!data) {
            console.warn("Normalizing empty result to empty array")
            return { data: [] }
          }
        }
        return data
      }

      // For actual errors, reject with error message
      const errorMessage = data.message || response.statusText
      return Promise.reject(errorMessage)
    } catch (error) {
      console.error("Error parsing JSON response:", error)
      return Promise.reject("Failed to parse server response. Please try again.")
    }
  } else {
    // Not a JSON response, likely HTML
    const text = await response.text()
    console.warn("Received non-JSON response:", text.substring(0, 200) + "...")

    // Check if it's a CORS error or other common issues
    if (text.includes("CORS") || text.includes("Cross-Origin")) {
      return Promise.reject("CORS error: The server doesn't allow requests from this origin.")
    } else if (text.includes("<!DOCTYPE html>")) {
      return Promise.reject(
        "Received HTML instead of JSON. The API endpoint might be incorrect or the server returned an error page.",
      )
    } else {
      return Promise.reject("The server returned an invalid response format.")
    }
  }
}

// Generic fetch function with authentication
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    console.log(`Making API request to: ${endpoint}`, {
      method: options.method || "GET",
      body: options.body ? JSON.parse(options.body as string) : undefined,
    })

    // Use the full URL if it's an absolute URL, otherwise append to base URL
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers,
    })

    return handleResponse(response)
  } catch (error) {
    // Network errors are actual errors, not empty results
    console.error(`API request failed for ${endpoint}:`, error)

    // Check for network errors
    if (error instanceof TypeError && error.message.includes("NetworkError")) {
      throw new Error("Network error: Please check your internet connection.")
    } else if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error("Failed to connect to the server. Please try again later.")
    }

    throw error
  }
}

// Direct API call without going through the proxy (for debugging)
const directApiCall = async (fullUrl: string, options: RequestInit = {}) => {
  try {
    console.log(`Making direct API call to: ${fullUrl}`)

    const response = await fetch(fullUrl, options)
    return handleResponse(response)
  } catch (error) {
    console.error(`Direct API call failed for ${fullUrl}:`, error)
    throw error
  }
}

// API service object with methods for each endpoint
export const apiService = {
  // Test connection to diagnose issues
  testConnection: () =>
    directApiCall("http://localhost:5089/api/Auth/Register", {
      method: "OPTIONS",
    }),

  // Auth endpoints
  auth: {
    login: (credentials: { userName: string; password: string }) =>
      fetchWithAuth("/Auth/Login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (userData: { userName: string; email: string; password: string; confirmPassword: string }) =>
      fetchWithAuth("/Auth/Register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
  },

  // Uncomment and restore the Categories endpoints
  categories: {
    getAll: () => fetchWithAuth("/Categories/GetAll"),
    getById: (id: number) => fetchWithAuth(`/Categories/GetById/${id}`),
    add: (category: any) =>
      fetchWithAuth("/Categories/Add", {
        method: "POST",
        body: JSON.stringify(category),
      }),
    update: (category: any) =>
      fetchWithAuth("/Categories/Update", {
        method: "PUT",
        body: JSON.stringify(category),
      }),
    delete: (id: number) =>
      fetchWithAuth(`/Categories/Delete/${id}`, {
        method: "DELETE",
      }),
  },

  // Budgets endpoints
  budgets: {
    getAll: () => fetchWithAuth("/Budgets/GetAll"),
    getById: (id: number) => fetchWithAuth(`/Budgets/GetById/${id}`),
    add: (budget: any) =>
      fetchWithAuth("/Budgets/Add", {
        method: "POST",
        body: JSON.stringify(budget),
      }),
    update: (budget: any) =>
      fetchWithAuth("/Budgets/Update", {
        method: "PUT",
        body: JSON.stringify(budget),
      }),
    delete: (id: number) =>
      fetchWithAuth(`/Budgets/Delete/${id}`, {
        method: "DELETE",
      }),
  },

  // Wallets endpoints
  wallets: {
    getAll: () => fetchWithAuth("/Wallets/GetAll"),
    getById: (id: number) => fetchWithAuth(`/Wallets/GetById/${id}`),
    add: (wallet: any) =>
      fetchWithAuth("/Wallets/Add", {
        method: "POST",
        body: JSON.stringify(wallet),
      }),
    update: (id: number, wallet: any) =>
      fetchWithAuth(`/Wallets/Update/${id}`, {
        method: "PUT",
        body: JSON.stringify(wallet),
      }),
    delete: (id: number) =>
      fetchWithAuth(`/Wallets/Delete/${id}`, {
        method: "DELETE",
      }),
  },

  // Transactions endpoints
  transactions: {
    getAll: () => fetchWithAuth("/Transactions/GetAll"),
    getById: (id: number) => fetchWithAuth(`/Transactions/GetById/${id}`),
    getByWalletId: (walletId: number) => fetchWithAuth(`/Transactions/GetByWalletId/${walletId}`),
    add: (transaction: any) =>
      fetchWithAuth("/Transactions/Add", {
        method: "POST",
        body: JSON.stringify({
          ...transaction,
          categoryId: transaction.categoryId !== undefined ? transaction.categoryId : 0, // Ensure categoryId is included
        }),
      }),
    update: (id: number, transaction: any) =>
      fetchWithAuth(`/Transactions/Update/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...transaction,
          categoryId: transaction.categoryId !== undefined ? transaction.categoryId : 0, // Ensure categoryId is included
        }),
      }),
    delete: (id: number) =>
      fetchWithAuth(`/Transactions/Delete/${id}`, {
        method: "DELETE",
      }),
  },

  // Reports endpoints
  reports: {
    getAll: () => fetchWithAuth("/Report/GetAll"),
    getById: (id: number) => fetchWithAuth(`/Report/GetById/${id}`),
    getByUserId: (userId: string) => fetchWithAuth(`/Report/GetByUserId/${userId}`),
    add: (report: any) =>
      fetchWithAuth("/Report/Add", {
        method: "POST",
        body: JSON.stringify(report),
      }),
    update: (id: number, report: any) =>
      fetchWithAuth(`/Report/Update/${id}`, {
        method: "PUT",
        body: JSON.stringify(report),
      }),
    delete: (id: number) =>
      fetchWithAuth(`/Report/Delete/${id}`, {
        method: "DELETE",
      }),
  },
}
