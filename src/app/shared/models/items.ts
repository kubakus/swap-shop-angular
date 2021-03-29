import { Base } from './base';
import { Filters } from './filters';
import { ItemState } from './item-state';

export namespace Items {
  export const enum Type {
    OFFERED = 'offered',
    WANTED = 'wanted',
    EVENT = 'event',
  }

  export interface State {
    state: ItemState;
  }

  export type CreateOffer = MaterialServiceCreateRequest;
  export type CreateWanted = MaterialServiceCreateRequest;

  export type Offer = MaterialService;
  export type Wanted = MaterialService;

  export type OfferRequest = MaterialServiceRequest;
  export type WantedRequest = MaterialServiceRequest;

  export interface Event extends EventCreateRequest, Base.Record, Base.AuditInfo, State {}

  export type ChangeOffersState = ChangeStateRequest;
  export type ChangeWantedState = ChangeStateRequest;
  export type ChangeEventsState = ChangeStateRequest;

  export interface EventRequest {
    eventName?: Filters.StringFilter;
    contactInfo?: Filters.StringFilter;
    state?: Filters.StringFilter<ItemState>;
  }

  export interface EventCreateRequest {
    eventName: string;
    when: Date; // Should be a date
    info: string;
    contactInfo: string; // Should be an email/phone ?
  }

  export interface MaterialServiceCreateRequest {
    name: string;
    info: string;
    item: string;
    deal: string;
    email: string;
  }

  export interface MaterialService
    extends MaterialServiceCreateRequest,
      Base.Record,
      Base.AuditInfo,
      State {}
  export interface MaterialServiceRequest {
    name?: Filters.StringFilter;
    item?: Filters.StringFilter;
    email?: Filters.StringFilter;
    state?: Filters.StringFilter<ItemState>;
  }

  export interface ChangeStateRequest {
    ids: string[];
    transition: ItemState;
  }
}
