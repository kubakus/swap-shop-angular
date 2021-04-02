import { NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { EventsService } from 'src/app/services/events.service';
import { CUSTOM_MAT_DATE_FORMATS } from 'src/app/shared/datepicker-format';
import { getControlMessage } from 'src/app/shared/helpers';
import { Alerts } from 'src/app/shared/models/alerts';
import { Items } from 'src/app/shared/models/items';

// Sunday is equal to 0;
// Currently Monday
const SUBS_SEND_DAY = 1;

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss'],
  providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_MAT_DATE_FORMATS }],
})
export class AddEventsComponent {
  public form: FormGroup;
  // indicates day after next day when emails are sent to the users
  public dayAfterNextSubsOut: Date = this.getNextDate();

  private eventsService: EventsService;
  private alertService: AlertService;

  public constructor(eventsService: EventsService, alertService: AlertService) {
    this.form = new FormGroup({
      eventName: new FormControl(undefined, Validators.required),
      // TODO add correct data validator
      when: new FormControl(undefined, Validators.required),
      info: new FormControl(undefined, Validators.required),
      contactInfo: new FormControl(undefined, Validators.required),
    });

    this.eventsService = eventsService;
    this.alertService = alertService;
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

  private getNextDate(): Date {
    const nextDate = new Date();
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() + 2 + ((SUBS_SEND_DAY + 7 - nextDate.getDay() - 1) % 7));
    return nextDate;
  }
}
