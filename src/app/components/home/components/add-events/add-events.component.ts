import { NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { CUSTOM_MAT_DATE_FORMATS } from 'src/app/shared/datepicker-format';
import { getControlMessage } from 'src/app/shared/helpers';
import { Alerts } from 'src/app/shared/models/alerts';
import { Items } from 'src/app/shared/models/items';
@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss'],
  providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_MAT_DATE_FORMATS }],
})
export class AddEventsComponent implements OnInit {
  public form: FormGroup;

  public minDate = new Date();

  private authService: AuthService;
  private eventsService: EventsService;
  private alertService: AlertService;
  private subscriptionsService: SubscriptionsService;

  public constructor(
    eventsService: EventsService,
    alertService: AlertService,
    authService: AuthService,
    subscriptionsService: SubscriptionsService,
  ) {
    this.form = new FormGroup({
      eventName: new FormControl(undefined, Validators.required),
      email: new FormControl(
        undefined,
        Validators.compose([Validators.required, Validators.email]),
      ),
      // TODO add correct data validator
      when: new FormControl(undefined, Validators.required),
      info: new FormControl(undefined, Validators.required),
      contactInfo: new FormControl(undefined, Validators.required),
    });

    this.eventsService = eventsService;
    this.alertService = alertService;
    this.authService = authService;
    this.subscriptionsService = subscriptionsService;
  }

  public ngOnInit(): void {
    combineLatest([
      this.authService.userInfo,
      this.subscriptionsService.getSubscriptions({ state: 'AwaitingDispatch' }),
    ]).subscribe(
      ([userInfo, subscriptions]) => {
        this.form.controls.email.setValue(userInfo.email);
        if (subscriptions.length) {
          // There should be only one awaiting subscription
          const sub = subscriptions[0];
          const dispatchDate = new Date(sub.date);
          this.minDate = this.getNextDate(dispatchDate.getDay());
        }
      },
      (err) => console.error('Failed to get user info', err),
    );
  }

  public getControlError(control: AbstractControl): string {
    return getControlMessage(control);
  }

  public onSubmit(): void {
    const request: Items.EventCreateRequest = {
      eventName: this.form.value.eventName,
      when: this.form.value.when,
      info: this.form.value.info,
      contactInfo: this.form.value.contactInfo,
      email: this.form.value.email,
    };
    this.eventsService
      .createEvent(request)
      .pipe(take(1))
      .subscribe(
        (_res) =>
          this.alertService.show({
            type: 'success',
            message: 'Event has been submitted',
            autoClose: Alerts.AlertLength.Normal,
          }),
        (err) => {
          console.error('Failed to create new event', err);
          this.alertService.show({
            type: 'error',
            message: 'Failed to submit new event',
            autoClose: Alerts.AlertLength.Normal,
          });
        },
      );
  }

  private getNextDate(dispatchDay: number): Date {
    const nextDate = new Date();
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() + 2 + ((dispatchDay + 7 - nextDate.getDay() - 1) % 7));
    return nextDate;
  }
}
