import { Component, OnInit } from '@angular/core';
import { OffersService } from 'src/app/services/offers.service';
import { Items } from 'src/app/shared/models/items';
import { forkJoin, Observable, of } from 'rxjs';
import { WantedService } from 'src/app/services/wanted.service';
import { Panel, PanelItem } from '../item-panel/item-panel.component';
import { EventsService } from 'src/app/services/events.service';
import { AlertService } from 'src/app/services/alert.service';
import { ItemState } from 'src/app/shared/models/item-state';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Base } from 'src/app/shared/models/base';
import { Alerts } from 'src/app/shared/models/alerts';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public offers?: PanelItem<Items.Offer>[];
  public wants?: PanelItem<Items.Wanted>[];
  public events?: PanelItem<Items.Event>[];

  public reviewedOffers?: PanelItem<Items.Offer>[];
  public reviewedWants?: PanelItem<Items.Wanted>[];
  public reviewedEvents?: PanelItem<Items.Event>[];
  public checkAll?: boolean;
  public someChildrenCheck?: boolean;

  public someOffersChecked?: boolean;
  public someWantsChecked?: boolean;
  public someEventsChecked?: boolean;

  private baseOfferFields: Panel<Items.Offer> = {
    title: { name: 'item', displayName: 'Offered' },
    description: { name: 'email', displayName: 'By' },
    content: [
      { name: 'name', displayName: 'Contact Information' },
      { name: 'info', displayName: 'Info' },
      { name: 'deal', displayName: 'Deal' },
    ],
  };

  private baseEventFields: Panel<Items.Event> = {
    title: { name: 'eventName', displayName: 'Event' },
    description: { name: 'createdBy', displayName: 'By' },
    content: [
      { name: 'when', displayName: 'When' },
      { name: 'info', displayName: 'Information' },
      { name: 'contactInfo', displayName: 'Contact Information' },
    ],
  };

  public reviewedOffersFields: Panel<Items.Offer> = {
    ...this.baseOfferFields,
    status: { name: 'state', displayName: 'Status' },
  };

  public offerFields: Panel<Items.Offer> = {
    ...this.baseOfferFields,
    showCheckBox: true,
  };

  public reviewedWantFields: Panel<Items.Wanted> = {
    ...this.reviewedOffersFields,
    title: { name: 'item', displayName: 'Wanted' },
  };

  public wantFields: Panel<Items.Wanted> = {
    ...this.offerFields,
    title: { name: 'item', displayName: 'Wanted' },
  };

  public reviewedEventsFields: Panel<Items.Event> = {
    ...this.baseEventFields,
    status: { name: 'state', displayName: 'Status' },
  };

  public eventsFields: Panel<Items.Event> = {
    ...this.baseEventFields,
    showCheckBox: true,
  };

  private offersService: OffersService;
  private wantedService: WantedService;
  private eventsService: EventsService;

  private alertService: AlertService;

  public constructor(
    offersService: OffersService,
    wantedService: WantedService,
    eventsService: EventsService,
    alertService: AlertService,
  ) {
    this.offersService = offersService;
    this.wantedService = wantedService;
    this.eventsService = eventsService;
    this.alertService = alertService;
  }

  public ngOnInit(): void {
    this.fetchAll().subscribe({
      error: (err) => {
        this.alertService.show({
          type: 'error',
          message: 'Failed to fetch items to review',
        }),
          console.error('Failed to fetch items to review', err);
      },
    });
  }

  public setAll(isChecked: boolean): void {
    this.checkAll = isChecked;
    this.offers && this.offers.map((o) => (o.selected = isChecked));
    this.wants && this.wants.map((w) => (w.selected = isChecked));
    this.events && this.events.map((e) => (e.selected = isChecked));
    this.someEventsChecked = isChecked;
    this.someOffersChecked = isChecked;
    this.someWantsChecked = isChecked;
    this.someChildrenCheck = isChecked;
  }

  public updateSomeChildrenChecked(): void {
    const allOffersChecked =
      this.offers && this.someOffersChecked && this.offers.every((offer) => offer.selected);
    const allWantsChecked =
      this.wants && this.someWantsChecked && this.wants.every((want) => want.selected);
    const allEventsChecked =
      this.events && this.someEventsChecked && this.events.every((event) => event.selected);

    this.checkAll = allOffersChecked && allWantsChecked && allEventsChecked;
    this.someChildrenCheck =
      !this.checkAll && (this.someOffersChecked || this.someWantsChecked || this.someEventsChecked);
  }

  public changeState(reject?: boolean): void {
    const action = reject ? 'reject' : 'approve';
    if (!(this.offers && this.wants && this.events)) {
      console.error(`Trying to ${action} items without required data`);
      return;
    }
    const selectedOffers = this.offers.filter((offer) => offer.selected);
    const selectedWants = this.wants.filter((want) => want.selected);
    const selectedEvents = this.events.filter((event) => event.selected);

    if (!(selectedOffers.length || selectedWants.length || selectedEvents.length)) {
      console.error(`Trying to ${action} items with nothing selected`);
      return;
    }

    const offersObs = this.getOffersObs(
      selectedOffers,
      reject ? ItemState.REJECTED : ItemState.APPROVED,
    );
    const wantsObs = this.getWantsObs(
      selectedWants,
      reject ? ItemState.REJECTED : ItemState.APPROVED,
    );
    const eventsObs = this.getEventsObs(
      selectedEvents,
      reject ? ItemState.REJECTED : ItemState.APPROVED,
    );

    forkJoin([offersObs, wantsObs, eventsObs])
      .pipe(
        switchMap(([_offers, _wants, _events]) => {
          this.alertService.show({
            type: 'success',
            message: `Items have been ${action}d`,
            autoClose: Alerts.AlertLength.Long,
          });
          return of(undefined);
        }),
        catchError((err) => {
          console.log('Failed to change state', err);
          this.alertService.show({
            type: 'error',
            message: `Failed to ${action} items`,
          });
          return of(undefined);
        }),
        switchMap((_res) => {
          this.setAll(false);
          return this.fetchAll();
        }),
      )
      .subscribe({
        error: (err) => {
          console.error('Failed to fetch awaiting review items', err);
          this.alertService.show({
            type: 'error',
            message: 'Failed to fetch items to review',
          });
        },
      });
  }

  private getOffersObs(
    items: PanelItem<Items.MaterialService>[],
    transition: ItemState,
  ): Observable<Base.MatchedCountResponse | undefined> {
    return items.length
      ? this.offersService
          .changeOffersState({ transition, ids: items.map((item) => item.id) })
          .pipe(take(1))
      : of(undefined);
  }

  private getWantsObs(
    items: PanelItem<Items.MaterialService>[],
    transition: ItemState,
  ): Observable<Base.MatchedCountResponse | undefined> {
    return items.length
      ? this.wantedService
          .changeWantedState({ transition, ids: items.map((item) => item.id) })
          .pipe(take(1))
      : of(undefined);
  }

  private getEventsObs(
    items: PanelItem<Items.Event>[],
    transition: ItemState,
  ): Observable<Base.MatchedCountResponse | undefined> {
    return items.length
      ? this.eventsService
          .changeEventsState({ transition, ids: items.map((item) => item.id) })
          .pipe(take(1))
      : of(undefined);
  }

  private fetchAll(): Observable<void> {
    return forkJoin([
      this.fetchData([ItemState.AWAITING_REVIEW]),
      this.fetchData([ItemState.APPROVED, ItemState.REJECTED]),
    ]).pipe(
      map(([[offers, wants, events], [reviewedOffers, reviewedWants, reviewedEvents]]) => {
        this.offers = offers;
        this.wants = wants;
        this.events = events;
        this.reviewedOffers = reviewedOffers;
        this.reviewedWants = reviewedWants;
        this.reviewedEvents = reviewedEvents;
      }),
    );
  }

  private fetchData(
    states: ItemState[],
  ): Observable<[Items.Offer[], Items.Wanted[], Items.Event[]]> {
    return forkJoin([
      this.offersService.getOffers({ state: states }).pipe(take(1)),
      this.wantedService.getWanted({ state: states }).pipe(take(1)),
      this.eventsService.getEvents({ state: states }).pipe(take(1)),
    ]);
  }
}
