import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { capitalize } from 'src/app/shared/helpers';
import { Alerts } from 'src/app/shared/models/alerts';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
  public alerts: Alerts.Alert[] = [];

  private alertService: AlertService;
  private subscription?: Subscription;

  public constructor(alertService: AlertService) {
    this.alertService = alertService;
  }

  public ngOnInit(): void {
    this.subscription = this.alertService.alerts.subscribe((alert) => {
      this.alerts.push(alert);
      if (alert.autoClose) {
        setTimeout(() => this.removeAlert(alert), alert.autoClose);
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public removeAlert(alert: Alerts.Alert): void {
    if (!this.alerts.includes(alert)) {
      console.warn('Trying to remove already removed alert', alert);
      return;
    }

    this.alerts = this.alerts.filter((a) => a !== alert);
  }

  public formatAlertType(type: Alerts.Type): string {
    return `${capitalize(type)}: `;
  }
}
