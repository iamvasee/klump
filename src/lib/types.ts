// ============================================================
// Clyra — Core Type Definitions
// ============================================================

// --- Enums ---

export type EntityType =
  | "private_limited"
  | "public_limited"
  | "llp"
  | "partnership"
  | "trust_private"
  | "trust_public"
  | "huf"
  | "proprietorship";

export type EntityStatus =
  | "active"
  | "struck_off"
  | "under_liquidation"
  | "dormant";

export type RelationshipRole =
  | "director"
  | "managing_director"
  | "partner"
  | "designated_partner"
  | "trustee"
  | "shareholder"
  | "karta"
  | "proprietor"
  | "authorised_signatory"
  | "beneficial_owner"
  | "auditor"
  | "company_secretary";

export type DocumentType =
  | "certificate_of_incorporation"
  | "llp_agreement"
  | "pan_card"
  | "tan_allotment"
  | "gst_certificate"
  | "moa_aoa"
  | "balance_sheet"
  | "itr_acknowledgement"
  | "bank_statement"
  | "kyc_document"
  | "other";

export type AccountType = "current" | "savings" | "cc";

export type UserRole = "admin" | "editor" | "viewer";

export type AuditAction = "create" | "update" | "delete";

// --- Interfaces ---

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  organisation_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Entity {
  id: string;
  organisation_id: string;
  legal_name: string;
  short_name?: string;
  entity_type: EntityType;
  status: EntityStatus;
  date_of_incorporation?: string;
  state_of_incorporation?: string;
  financial_year_end: string;
  nature_of_business?: string;
  // Identifiers
  cin?: string;
  llpin?: string;
  pan?: string;
  tan?: string;
  iec?: string;
  udyam?: string;
  fssai?: string;
  // Address
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  email?: string;
  phone?: string;
  // Metadata
  completeness_score: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Relations (populated via joins)
  gstins?: EntityGstin[];
  bank_accounts?: BankAccount[];
  relationships?: EntityPersonRelationship[];
  documents?: Document[];
}

export interface EntityGstin {
  id: string;
  entity_id: string;
  gstin: string;
  state?: string;
  status: string;
  created_at: string;
}

export interface BankAccount {
  id: string;
  entity_id: string;
  bank_name: string;
  account_holder_name: string;
  branch?: string;
  account_number: string;
  ifsc_code: string;
  iban?: string;
  swift_code?: string;
  account_type: AccountType;
  is_primary: boolean;
  created_at: string;
}

export interface Person {
  id: string;
  organisation_id: string;
  full_name: string;
  date_of_birth?: string;
  gender?: string;
  nationality: string;
  residential_address?: string;
  email?: string;
  phone?: string;
  // Identifiers
  pan?: string;
  aadhaar_last4?: string;
  din?: string;
  dpin?: string;
  passport_number?: string;
  dsc_expiry?: string;
  // Metadata
  completeness_score: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Relations
  relationships?: EntityPersonRelationship[];
  documents?: Document[];
}

export interface EntityPersonRelationship {
  id: string;
  entity_id: string;
  person_id: string;
  role: RelationshipRole;
  shareholding_pct?: number;
  effective_from?: string;
  effective_to?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Populated via joins
  entity?: Entity;
  person?: Person;
}

export interface Document {
  id: string;
  organisation_id: string;
  entity_id?: string;
  person_id?: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  document_type: DocumentType;
  description?: string;
  document_date?: string;
  financial_year?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  organisation_id: string;
  user_id?: string;
  user_name?: string;
  action: AuditAction;
  table_name: string;
  record_id: string;
  record_name?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  created_at: string;
}

// --- Dashboard Types ---

export interface DashboardStats {
  total_entities: number;
  total_people: number;
  total_documents: number;
  incomplete_profiles: number;
  entity_type_breakdown: { type: EntityType; count: number; label: string }[];
  recent_activity: AuditLogEntry[];
}
