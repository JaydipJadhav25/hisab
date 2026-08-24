export type Language = "en" | "mr";
export type TiffinType = "FULL" | "HALF" | "NONE";
export type GroupRole = "ADMIN" | "MEMBER";
export type GroupStatus = "ACTIVE" | "UPCOMING" | "EXPIRED" | "CLOSED";
export type PaymentStatus = "PAID" | "PARTIALLY_PAID" | "PENDING";
export type PaymentMethod = "CASH" | "UPI" | "BANK_TRANSFER" | "OTHER";
export type Duration = "1_WEEK" | "2_WEEKS" | "1_MONTH" | "3_MONTHS" | "CUSTOM";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredLanguage: Language;
  profileImage?: string;
  bio?: string;
  occupation?: string;
}

export interface GroupProvider {
  name: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface GroupPricing {
  full: number;
  half: number;
}

export interface Group {
  id: string;
  name: string;
  ownerId: string;
  provider: GroupProvider;
  pricing: GroupPricing;
  startDate: string;
  endDate: string;
  cutoffTime: string;
  status: GroupStatus;
  inviteCode: string;
  role?: GroupRole;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: User;
  role: GroupRole;
  joinedAt: string;
  status: "ACTIVE" | "REMOVED";
}

export interface DailyTiffinRecord {
  id: string;
  groupId: string;
  userId: string | User;
  date: string;
  type: TiffinType;
  priceAtTime: number;
  status: "CONFIRMED" | "LOCKED" | "ADMIN_OVERRIDDEN";
  confirmedAt: string;
}

export interface TodayOrder {
  date: string;
  summary: Record<TiffinType, number>;
  records: DailyTiffinRecord[];
}

export interface MemberHisab {
  userId: string;
  name: string;
  full: number;
  half: number;
  none: number;
  amount: number;
  paid: number;
  pending: number;
  status: PaymentStatus;
}

export interface Payment {
  id: string;
  groupId: string;
  userId: string;
  amount: number;
  paymentDate: string;
  method: PaymentMethod;
  note?: string;
  recordedBy: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  groupId?: string;
  type: "SELECTION_OPEN" | "ORDER_READY" | "SELECTION_LOCKED" | "HISAB_READY" | "PAYMENT_PENDING";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}
