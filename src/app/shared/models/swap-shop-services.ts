import { Base } from './base';

export namespace SwapShopServices {
  export const enum Type {
    OFFER = 'offer',
    WANTED = 'wanted',
    EVENT = 'event',
  }

  export type CreateOffer = MaterialServiceCreateRequest;
  export type CreateWanted = MaterialServiceCreateRequest;

  export type Offer = MaterialService;
  export type Wanted = MaterialService;

  export interface Event extends EventCreateRequest, Base.Record {}

  export interface EventCreateRequest {
    name: string;
    when: string; // Should be a date
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

  interface MaterialService extends MaterialServiceCreateRequest, Base.Record {}
}
