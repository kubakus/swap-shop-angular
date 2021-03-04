import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { EventsService } from 'src/app/services/events.service';
import { capitalize } from 'src/app/shared/helpers';
import { SwapShopServices } from 'src/app/shared/models/swap-shop-services';

// Sunday is equal to 0;
// Currently Monday
const SUBS_SEND_DAY = 1;

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss'],
})
export class AddEventsComponent {
  public form: FormGroup;
  // indicates day after next day when emails are sent to the users
  public dayAfterNextSubsOut: Date = this.getNextDate();

  private eventsService: EventsService;

  public constructor(eventsService: EventsService) {
    this.form = new FormGroup({
      eventName: new FormControl(undefined, Validators.required),
      // TODO add correct data validator
      when: new FormControl(undefined, Validators.required),
      info: new FormControl(undefined, Validators.required),
      contactInfo: new FormControl(undefined, Validators.required),
    });
    console.log('pub', this.dayAfterNextSubsOut.toUTCString());

    this.eventsService = eventsService;
  }
  public getRequiredErrorMessage(name: string): string | undefined {
    if (this.form.controls[name]?.hasError('required')) {
      return `${capitalize(name)} is required`;
    }
    return undefined;
  }

  public onSubmit(): void {
    const request: SwapShopServices.EventCreateRequest = {
      eventName: this.form.value.eventName,
      when: this.form.value.when,
      info: this.form.value.info,
      contactInfo: this.form.value.contactInfo,
    };
    this.eventsService
      .createEvent(request)
      .pipe(take(1))
      .subscribe(
        (res) => console.log('created event', res),
        (err) => console.error('Failed to create new event', err),
      );
  }

  private getNextDate(): Date {
    const nextDate = new Date();
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() + 2 + ((SUBS_SEND_DAY + 7 - nextDate.getDay() - 1) % 7));
    return nextDate;
  }
}
