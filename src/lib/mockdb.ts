import { Entity, Person, EntityPersonRelationship, Document, AuditLogEntry, UserProfile, Organisation, BankAccount, EntityGstin, Filing } from "./types";

// --- Mock Initial Data ---

export const MOCK_ORGANISATION: Organisation = {
  id: "org_1",
  name: "Acme Group",
  slug: "acme-group",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_USER: UserProfile = {
  id: "user_1",
  organisation_id: "org_1",
  full_name: "John Doe",
  email: "john@example.com",
  role: "admin",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const ent1_bank_accounts: BankAccount[] = [
  {
    id: "bank_1",
    entity_id: "ent_1",
    bank_name: "HDFC Bank",
    account_holder_name: "Acme Private Limited",
    branch: "Mumbai Main",
    account_number: "50100234567890",
    ifsc_code: "HDFC0000001",
    swift_code: "HDFCINBB",
    iban: "IN64HDFC000000150100234567890",
    account_type: "current",
    is_primary: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "bank_2",
    entity_id: "ent_1",
    bank_name: "ICICI Bank",
    account_holder_name: "Acme Private Limited",
    branch: "Andheri East",
    account_number: "000405001234",
    ifsc_code: "ICIC0000004",
    swift_code: "ICICINBB",
    account_type: "current",
    is_primary: false,
    created_at: new Date().toISOString(),
  }
];

const ent1_gstins: EntityGstin[] = [
  {
    id: "gst_1",
    entity_id: "ent_1",
    gstin: "27ABCDE1234F1Z5",
    state: "Maharashtra",
    status: "active",
    created_at: new Date().toISOString(),
  }
];

const ent1_documents: Document[] = [
  {
    id: "doc_1",
    organisation_id: "org_1",
    entity_id: "ent_1",
    file_name: "Certificate_of_Incorporation.pdf",
    file_path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    document_type: "certificate_of_incorporation",
    document_date: "2010-05-15",
    created_at: new Date().toISOString(),
  },
  {
    id: "doc_2",
    organisation_id: "org_1",
    entity_id: "ent_1",
    file_name: "PAN_Card_Acme.pdf",
    file_path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    document_type: "pan_card",
    created_at: new Date().toISOString(),
  }
];

const ent1_filings: Filing[] = [
  {
    id: "fil_1",
    entity_id: "ent_1",
    name: "GSTR-3B Aug 2024",
    filing_type: "gst_return",
    financial_year: "2024-25",
    filing_date: "2024-09-20",
    status: "completed",
    description: "Monthly GST Return for August",
    data: {
      "Total Turnover": "₹1,25,00,000",
      "Taxable Value": "₹1,00,00,000",
      "IGST": "₹18,00,000",
      "CGST": "₹0",
      "SGST": "₹0",
      "ITC Claimed": "₹12,50,000",
      "Net Tax Paid": "₹5,50,000"
    },
    files: [
      {
        id: "doc_gst_3b_1",
        organisation_id: "org_1",
        file_name: "GSTR-3B_Receipt.pdf",
        file_path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        document_type: "gst_return",
        created_at: new Date().toISOString()
      },
      {
        id: "doc_gst_3b_2",
        organisation_id: "org_1",
        file_name: "Working_Sheet.xlsx",
        file_path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        document_type: "gst_return",
        created_at: new Date().toISOString()
      }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: "fil_2",
    entity_id: "ent_1",
    name: "Income Tax Return FY 23-24",
    filing_type: "itr_acknowledgement",
    financial_year: "2023-24",
    filing_date: "2024-07-15",
    status: "completed",
    description: "Annual ITR Filing",
    data: {
      "Total Income": "₹12,45,00,000",
      "Total Tax Paid": "₹3,10,00,000",
      "Section": "115BAA",
      "Audit Date": "2024-06-30"
    },
    files: [
      {
        id: "doc_itr_ack",
        organisation_id: "org_1",
        file_name: "ITR_V_Acknowledgement.pdf",
        file_path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        document_type: "itr_acknowledgement",
        created_at: new Date().toISOString()
      }
    ],
    created_at: new Date().toISOString()
  }
];

export const MOCK_ENTITIES: Entity[] = [
  {
    id: "ent_1",
    organisation_id: "org_1",
    legal_name: "Acme Private Limited",
    short_name: "Acme Pvt Ltd",
    entity_type: "private_limited",
    status: "active",
    date_of_incorporation: "2010-05-15",
    state_of_incorporation: "Maharashtra",
    financial_year_end: "march_31",
    nature_of_business: "Software Development",
    pan: "ABCDE1234F",
    tan: "MUMA12345C",
    cin: "U12345MH2010PTC123456",
    fssai: "12345678901234",
    completeness_score: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    address_line1: "123 Tech Park",
    city: "Mumbai",
    state: "Maharashtra",
    pin_code: "400001",
    bank_accounts: ent1_bank_accounts,
    gstins: ent1_gstins,
    documents: ent1_documents,
    filings: ent1_filings,
  },
  {
    id: "ent_2",
    organisation_id: "org_1",
    legal_name: "Alpha LLP",
    short_name: "Alpha",
    entity_type: "llp",
    status: "active",
    date_of_incorporation: "2015-08-20",
    state_of_incorporation: "Karnataka",
    financial_year_end: "march_31",
    nature_of_business: "Consultancy",
    pan: "FGHIJ5678K",
    llpin: "AAA-1234",
    completeness_score: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    bank_accounts: [],
    gstins: [],
    documents: [],
    filings: [],
  }
];

const per1_bank_accounts: BankAccount[] = [
  {
    id: "bank_p1_1",
    entity_id: "", // Individual
    bank_name: "HDFC Bank",
    account_holder_name: "Alice Smith",
    branch: "Bandra West",
    account_number: "50100456789012",
    ifsc_code: "HDFC0000001",
    account_type: "savings",
    is_primary: true,
    created_at: new Date().toISOString(),
  }
];

const per1_documents: Document[] = [
  {
    id: "doc_p1_1",
    organisation_id: "org_1",
    person_id: "per_1",
    file_name: "PAN_Alice_Smith.pdf",
    file_path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    document_type: "pan_card",
    created_at: new Date().toISOString(),
  },
  {
    id: "doc_p1_2",
    organisation_id: "org_1",
    person_id: "per_1",
    file_name: "Aadhaar_Alice_Smith.pdf",
    file_path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    document_type: "aadhaar_card",
    created_at: new Date().toISOString(),
  }
];

export const MOCK_PEOPLE: Person[] = [
  {
    id: "per_1",
    organisation_id: "org_1",
    full_name: "Alice Smith",
    date_of_birth: "1985-03-10",
    nationality: "Indian",
    email: "alice@acme.com",
    pan: "PQRTS9876Z",
    aadhaar_number: "1234 5678 9012",
    din: "01234567",
    completeness_score: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    bank_accounts: per1_bank_accounts,
    documents: per1_documents,
    residential_address: "Apartment 4B, 123 Main Street, Mumbai, Maharashtra 400058",
    phone: "+91 98765 43210"
  },
  {
    id: "per_2",
    organisation_id: "org_1",
    full_name: "Bob Wilson",
    nationality: "Indian",
    email: "bob@alpha.com",
    pan: "LMNOP4321Q",
    completeness_score: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "per_3",
    organisation_id: "org_1",
    full_name: "Charlie Brown",
    nationality: "Indian",
    email: "charlie@invest.com",
    pan: "WXYZA1234B",
    completeness_score: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "per_4",
    organisation_id: "org_1",
    full_name: "David Smith & Associates",
    nationality: "Indian",
    email: "audit@davidsmith.com",
    pan: "AUDIT9999S",
    completeness_score: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "per_5",
    organisation_id: "org_1",
    full_name: "Meera Iyer",
    nationality: "Indian",
    email: "cs.meera@outlook.com",
    pan: "CSMEE1234I",
    completeness_score: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const MOCK_RELATIONSHIPS: EntityPersonRelationship[] = [
  {
    id: "rel_1",
    entity_id: "ent_1",
    person_id: "per_1",
    role: "director",
    effective_from: "2010-05-15",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rel_2",
    entity_id: "ent_2",
    person_id: "per_2",
    role: "partner",
    effective_from: "2015-08-20",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rel_3",
    entity_id: "ent_1",
    person_id: "per_3",
    role: "shareholder",
    shareholding_pct: 45,
    effective_from: "2012-01-10",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rel_4",
    entity_id: "ent_1",
    person_id: "per_1",
    role: "shareholder",
    shareholding_pct: 55,
    effective_from: "2010-05-15",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rel_5",
    entity_id: "ent_1",
    person_id: "per_4",
    role: "auditor",
    effective_from: "2020-04-01",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rel_6",
    entity_id: "ent_1",
    person_id: "per_5",
    role: "company_secretary",
    effective_from: "2021-06-15",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// --- Database Logic (Simulation) ---

class MockDatabase {
  private entities: Entity[] = [...MOCK_ENTITIES];
  private people: Person[] = [...MOCK_PEOPLE];
  private relationships: EntityPersonRelationship[] = [...MOCK_RELATIONSHIPS];
  private documents: Document[] = [];
  private auditLogs: AuditLogEntry[] = [];

  // Entities
  getEntities() { return this.entities; }
  getEntity(id: string) { return this.entities.find(e => e.id === id); }
  
  // Filings
  getFiling(id: string) {
    for (const entity of this.entities) {
      const filing = entity.filings?.find(f => f.id === id);
      if (filing) return { filing, entity };
    }
    return null;
  }

  addEntity(entity: Omit<Entity, "id" | "created_at" | "updated_at">) {
    const newEntity: Entity = {
      ...entity,
      id: `ent_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  // People
  getPeople() { return this.people; }
  getPerson(id: string) { return this.people.find(p => p.id === id); }
  addPerson(person: Omit<Person, "id" | "created_at" | "updated_at">) {
    const newPerson: Person = {
      ...person,
      id: `per_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.people.push(newPerson);
    return newPerson;
  }

  // Relationships
  getRelationships() { return this.relationships; }
  getRelationshipsForEntity(entityId: string) {
    return this.relationships.filter(r => r.entity_id === entityId);
  }
  getRelationshipsForPerson(personId: string) {
    return this.relationships.filter(r => r.person_id === personId);
  }
}

export const db = new MockDatabase();
