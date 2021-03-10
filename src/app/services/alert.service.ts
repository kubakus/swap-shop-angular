import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alerts } from '../shared/models/alerts';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new Subject<Alerts.Alert>();

  public get alerts(): Observable<Alerts.Alert> {
    return this.alertSubject.asObservable();
  }

  public show(alert: Alerts.Alert): void {
    this.alertSubject.next(alert);
  }
}
