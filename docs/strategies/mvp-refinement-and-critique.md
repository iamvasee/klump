# Klump — MVP Refinement & Architectural Strategy

This document outlines the strategic shifts, architectural refinements, and critical code reviews performed during the initial build phase of **Klump**.

---

## 1. Brand Identity & Domain Alignment

The application was rebranded from a legacy boilerplate to **Klump**, a premium statutory management and compliance platform.

### Key Shifts:
- **Domain Focus**: Shifted from "Chit Funds" to **Corporate Statutory Compliance**.
- **Terminology**: 
  - Groups → **Entities** (Private Ltd, LLP, Partnership)
  - Members → **People/Stakeholders** (Directors, Partners, Shareholders)
  - Approvals → **Compliance** (Annual filings, Resolutions)
- **Visuals**: Implemented a "billion-dollar SaaS" aesthetic using deep blue/indigo gradients and a refined typography hierarchy.

---

## 2. Architectural Refinements

### Componentization of Profile Menu
- **Shift**: Extracted the user profile dropdown from the global header.
- **Benefit**: Improved maintainability and reduced complexity in the `Header` component.
- **Path**: `src/components/layout/ProfileMenu.tsx`

### Statutory Docs vs. Recurring Filings
- **The Problem**: A single "Document Vault" is insufficient for corporate compliance.
- **The Solution**: Divided documentation into two distinct tracks:
  - **Statutory Docs**: Permanent/One-time certificates (COI, MOA/AOA, PAN Card).
  - **Filings**: Recurring, chronological submissions (GST Returns, ITR, PF/ESI).
- **Data Model**: Implemented a logical `Filing` entity that groups multiple physical proof documents.

---

## 3. Professionals Module

Integrated a new vertical for **Professional Appointments**.
- **Listing**: `/professionals` filters the stakeholder database for individuals with `auditor` or `company_secretary` roles.
- **Cross-Referencing**: Professionals have a dedicated view to see all entities where they hold an appointment.

---

## 4. Code Review & Harsh Critique

### **Critical Findings (Technical Debt)**

#### **I. The "God Component" Pattern**
- **Issue**: `EntityViewContent.tsx` exceeds 600 lines, handling too many concerns (tabs, filtering, data mapping, copy logic).
- **Strategy**: Post-MVP, these must be decomposed into `StatutoryCard`, `FilingsTable`, and `BankingUtility` components.

#### **II. The "Fragile" Data Layer**
- **Issue**: `MockDatabase` is a synchronous in-memory store. State is lost on refresh.
- **Strategy**: Wrap the data layer in an asynchronous service or `react-query` to prepare for the Supabase transition.

#### **III. Typography "Weight"**
- **Issue**: Initial build used excessive `font-black` (900) weights, making the UI feel "clunky."
- **Status**: Resolved. Normalized to `bold` for headers and `semibold` for data labels.

#### **IV. Security & Session**
- **Issue**: Auth is currently a `localStorage` flag without real server-side session validation.
- **Strategy**: Implement `middleware.ts` logic once the Supabase Auth layer is active.

---

## 5. Feature Roadmap (Post-MVP)

1. **Async Persistence**: Transition `mockdb.ts` to Supabase Postgres.
2. **Real PDF Rendering**: Move from `iframe` previews to a more robust `react-pdf` or similar library.
3. **Audit Triggers**: Log every change to an entity's statutory record.
4. **Automated Reminders**: Push notifications for filing deadlines.
