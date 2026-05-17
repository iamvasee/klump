// ============================================================
// Clyra — Constants & Enum Labels
// ============================================================

import { EntityType, EntityStatus, RelationshipRole, DocumentType, AccountType } from "./types";

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  private_limited: "Private Limited",
  public_limited: "Public Limited",
  llp: "LLP",
  partnership: "Partnership Firm",
  trust_private: "Private Trust",
  trust_public: "Public Trust",
  huf: "HUF",
  proprietorship: "Proprietorship",
};

export const ENTITY_STATUS_LABELS: Record<EntityStatus, string> = {
  active: "Active",
  struck_off: "Struck Off",
  under_liquidation: "Under Liquidation",
  dormant: "Dormant",
};

export const ENTITY_STATUS_COLORS: Record<EntityStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  struck_off: "bg-red-500/15 text-red-400 border-red-500/20",
  under_liquidation: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  dormant: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

export const RELATIONSHIP_ROLE_LABELS: Record<RelationshipRole, string> = {
  director: "Director",
  managing_director: "Managing Director",
  partner: "Partner",
  designated_partner: "Designated Partner",
  trustee: "Trustee",
  shareholder: "Shareholder",
  karta: "Karta",
  proprietor: "Proprietor",
  authorised_signatory: "Authorised Signatory",
  beneficial_owner: "Beneficial Owner",
  auditor: "Statutory Auditor",
  company_secretary: "Company Secretary",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  certificate_of_incorporation: "Certificate of Incorporation",
  llp_agreement: "LLP Agreement",
  pan_card: "PAN Card",
  tan_allotment: "TAN Allotment Letter",
  gst_certificate: "GST Certificate",
  moa_aoa: "MOA / AOA",
  balance_sheet: "Balance Sheet",
  itr_acknowledgement: "ITR Acknowledgement",
  bank_statement: "Bank Statement",
  kyc_document: "KYC Document",
  other: "Other",
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  current: "Current",
  savings: "Savings",
  cc: "Cash Credit",
};

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const;

export const FINANCIAL_YEAR_OPTIONS = [
  { value: "march_31", label: "April – March (Default)" },
  { value: "december_31", label: "January – December" },
  { value: "june_30", label: "July – June" },
] as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Entities", href: "/entities", icon: "Building2" },
  { label: "People", href: "/people", icon: "Users" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;
