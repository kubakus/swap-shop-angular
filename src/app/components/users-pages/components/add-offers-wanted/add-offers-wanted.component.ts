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
import { SwapShopServices } from 'src/app/shared/models/swap-shop-services';

const types: SelectItem[] = [
  { name: SwapShopServices.Type.OFFER, displayName: 'Offered' },
  { name: SwapShopServices.Type.WANTED, displayName: 'Wanted' },
];

@Component({
  selector: 'app-add-offers-wanted',
  templateUrl: './add-offers-wanted.component.html',
  styleUrls: ['./add-offers-wanted.component.scss'],
})
export class AddOffersWantedComponent implements OnInit {
  public form: FormGroup;
  public types = types;
  public selectedType?: SwapShopServices.Type;
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
      item: new FormControl(undefined, Validators.required),
      info: new FormControl(undefined, Validators.required),
      deal: new FormControl(undefined, Validators.required),
      email: new FormControl(
        undefined,
        Validators.compose([Validators.required, Validators.email]),
      ),
      name: new FormControl(undefined, Validators.required),
    });
  }

  public getControlError(control: AbstractControl): string | undefined {
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
    const type = this.form.value.type as SwapShopServices.Type;
    if (!type) {
      console.error('Trying to submit a form without a type of service');
      return;
    }
    let createObs: Observable<Base.CreateResponse>;

    const request: SwapShopServices.MaterialServiceCreateRequest = {
      name: this.form.value.name,
      info: this.form.value.info,
      deal: this.form.value.deal,
      item: this.form.value.item,
      email: this.form.value.email,
    };
    let successMessage: string;
    let errorMessage: string;

    switch (type) {
      case SwapShopServices.Type.OFFER:
        createObs = this.offersService.createOffer(request);
        successMessage = 'Offer has been submitted';
        errorMessage = 'Failed to submit new offer';
        break;
      case SwapShopServices.Type.WANTED:
        createObs = this.wantedService.createWanted(request);
        successMessage = 'Wanted offer has been submitted';
        errorMessage = 'Failed to create wanted offer';
        break;
      case SwapShopServices.Type.EVENT:
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
