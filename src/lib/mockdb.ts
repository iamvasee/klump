import { Entity, Person, EntityPersonRelationship, Document, AuditLogEntry, UserProfile, Organisation } from "./types";

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
    cin: "U12345MH2010PTC123456",
    completeness_score: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    address_line1: "123 Tech Park",
    city: "Mumbai",
    state: "Maharashtra",
    pin_code: "400001",
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
    din: "01234567",
    completeness_score: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
