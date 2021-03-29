export namespace Base {
  export interface Record {
    id: string;
  }

  export interface CreateResponse {
    id: string;
  }

  export interface AuditInfo {
    createdBy: string;
    createdDate: Date;
  }

  export interface MatchedCountResponse {
    count: number;
    matchedCount: number;
  }
}
