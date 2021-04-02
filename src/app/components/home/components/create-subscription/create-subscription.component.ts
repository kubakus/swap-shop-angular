import { NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { CUSTOM_MAT_DATE_FORMATS } from 'src/app/shared/datepicker-format';
import { getControlMessage } from 'src/app/shared/helpers';
import { Alerts } from 'src/app/shared/models/alerts';
import { Subscriptions } from 'src/app/shared/models/subscriptions';
import { DEFAULT_FOOTER, DEFAULT_HEADER } from 'src/app/shared/subscriptions-messages';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss'],
  providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_MAT_DATE_FORMATS }],
})
export class CreateSubscriptionComponent implements OnInit {
  public form: FormGroup;
  public minDate = new Date();

  private subscriptionsService: SubscriptionsService;
  private alertService: AlertService;

  public constructor(subscriptionsService: SubscriptionsService, alertService: AlertService) {
    this.subscriptionsService = subscriptionsService;
    this.alertService = alertService;

    this.form = new FormGroup({
      date: new FormControl(undefined, Validators.required),
      header: new FormControl(DEFAULT_HEADER, Validators.required),
      footer: new FormControl(DEFAULT_FOOTER, Validators.required),
    });
  }

  ngOnInit(): void {
    console.log('date', new Date().toUTCString());
    console.log('date iso', new Date().toISOString());
    console.log('date iso to local', new Date(new Date().toISOString()).toLocaleString());
  }

  public getControlError(control: AbstractControl): string {
    return getControlMessage(control);
  }

  public onSubmit(): void {
    const request: Subscriptions.CreateRequest = {
      date: this.form.value.date,
      header: this.form.value.header,
      footer: this.form.value.footer,
    };
    this.subscriptionsService
      .createSubscription(request)
      .pipe(take(1))
      .subscribe(
        () => {
          // TODO should probably navigate somewhere
          this.alertService.show({
            type: 'success',
            message: 'Subscription has been created successfully',
            autoClose: Alerts.AlertLength.Long,
          });
        },
        (err) => {
          console.error('Failed to create the subscription', err);
          this.alertService.show({
            type: 'error',
            message: 'Failed to create the subscription',
          });
        },
      );
  }
}
