// Define TypeScript interfaces for the backend DTOs

// Auth DTOs
export interface LoginDto {
  userName: string
  password: string
}

export interface RegisterDto {
  userName: string
  email: string
  password: string
  confirmPassword: string
}

// Budget DTO
export interface BudgetDto {
  id?: number
  name: string
  amount: number
  userId: string
  startDate: string | Date
  endDate: string | Date
}

// Category DTO
export interface CategoryDto {
  id?: number
  name: string
  userId: string
}

// Transaction DTO
export enum TransactionType {
  Expense = 0,
  Income = 1,
}

export interface TransactionDto {
  id?: number
  amount: number
  categoryId: number
  date: Date
  walletId: number
  type: TransactionType
  description: string
}

// Wallet DTO
export enum WalletType {
  Bank = 0,
  Cash = 1,
  Card = 2,
}

export interface WalletDto {
  id?: number
  name: string
  type: WalletType
  userId: string
}

// Report DTO
export interface ReportDto {
  id?: number
  desctiption: string // Note: This matches the typo in the backend DTO
  from: Date
  to: Date
  userId: string
}
