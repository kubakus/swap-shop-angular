import { Filters } from './filters';

export namespace Base {
  export interface Record {
    id: string;
  }

  export interface Get {
    id?: Filters.IdFilter;
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

  export interface GetWithAuditInfo extends Get {
    createdDate?: Filters.DateFilter;
    updatedDate?: Filters.DateFilter;
    createdBy?: Filters.IdFilter;
    updatedBy?: Filters.IdFilter;
  }
}
