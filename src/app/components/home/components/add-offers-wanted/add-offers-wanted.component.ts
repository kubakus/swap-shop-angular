import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { OffersService } from 'src/app/services/offers.service';
import { WantedService } from 'src/app/services/wanted.service';
import { getControlMessage } from 'src/app/shared/helpers';
import { Alerts } from 'src/app/shared/models/alerts';
import { Base } from 'src/app/shared/models/base';
import { SelectItem } from 'src/app/shared/models/select-types';
import { Items } from 'src/app/shared/models/items';

const types: SelectItem[] = [
  { name: Items.Type.OFFERED, displayName: 'Offered' },
  { name: Items.Type.WANTED, displayName: 'Wanted' },
];

@Component({
  selector: 'app-add-offers-wanted',
  templateUrl: './add-offers-wanted.component.html',
  styleUrls: ['./add-offers-wanted.component.scss'],
})
export class AddOffersWantedComponent implements OnInit {
  public form: FormGroup;
  public types = types;
  public selectedType?: Items.Type;
  public typeControl: FormControl;

  private authService: AuthService;
  private offersService: OffersService;
  private wantedService: WantedService;
  private alertService: AlertService;

  public constructor(
    authService: AuthService,
    offersService: OffersService,
    wantedService: WantedService,
    alertService: AlertService,
  ) {
    this.authService = authService;
    this.offersService = offersService;
    this.wantedService = wantedService;
    this.alertService = alertService;

    // Needs to be create separately so it can be referenced in the template
    this.typeControl = new FormControl(undefined, Validators.required);
    this.form = new FormGroup({
      type: this.typeControl,
      itemName: new FormControl(undefined, Validators.required),
      info: new FormControl(undefined, Validators.required),
      deal: new FormControl(undefined, Validators.required),
      email: new FormControl(
        undefined,
        Validators.compose([Validators.required, Validators.email]),
      ),
      userName: new FormControl(undefined, Validators.required),
    });
  }

  public getControlError(control: AbstractControl): string {
    return getControlMessage(control);
  }

  public ngOnInit(): void {
    this.authService
      .getUserInfo()
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.form.controls.email.setValue(res.email);
        },
        (err) => console.error('Failed to get user info', err),
      );
  }

  public onSubmit(): void {
    const type = this.form.value.type as Items.Type;
    if (!type) {
      console.error('Trying to submit a form without a type of service');
      return;
    }
    let createObs: Observable<Base.CreateResponse>;

    const request: Items.MaterialServiceCreateRequest = {
      userName: this.form.value.userName,
      info: this.form.value.info,
      deal: this.form.value.deal,
      itemName: this.form.value.itemName,
      email: this.form.value.email,
    };
    let successMessage: string;
    let errorMessage: string;

    switch (type) {
      case Items.Type.OFFERED:
        createObs = this.offersService.createOffer(request);
        successMessage = 'Offered item has been submitted';
        errorMessage = 'Failed to submit new offered item';
        break;
      case Items.Type.WANTED:
        createObs = this.wantedService.createWanted(request);
        successMessage = 'Wanted item has been submitted';
        errorMessage = 'Failed to create wanted offer item';
        break;
      case Items.Type.EVENT:
      default:
        console.error('Unknown type of service', type);
        return;
    }
    createObs.pipe(take(1)).subscribe(
      (_res) =>
        this.alertService.show({
          type: 'success',
          message: successMessage,
          autoClose: Alerts.AlertLength.Normal,
        }),
      (err) => {
        console.error('Failed to create new item', err);
        this.alertService.show({
          type: 'error',
          message: errorMessage,
          autoClose: Alerts.AlertLength.Long,
        });
      },
    );
  }
}
