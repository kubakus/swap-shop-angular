import { Base } from './base';

export namespace Subscriptions {
  export interface CreateRequest {
    date: Date;
    header: string;
    footer: string;
  }

  export interface Subscription extends CreateRequest, Base.AuditInfo, Base.Record {
    isSent: boolean;
  }
}
