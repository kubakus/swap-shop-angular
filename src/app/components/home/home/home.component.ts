import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { OffersService } from 'src/app/services/offers.service';
import { WantedService } from 'src/app/services/wanted.service';
import { Base } from 'src/app/shared/models/base';
import { SelectItem } from 'src/app/shared/models/select-types';
import { SwapShopServices } from 'src/app/shared/models/swap-shop-services';


const types: SelectItem[] = [
  { name: SwapShopServices.Type.OFFER, displayName: 'Offered' },
  { name: SwapShopServices.Type.WANTED, displayName: 'Wanted' }
]

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public form: FormGroup;
  public types = types;
  public selectedType?: SwapShopServices.Type;
  public typeControl: FormControl;

  private authService: AuthService;
  private offersService: OffersService;
  private wantedService: WantedService;

  public  constructor(authService: AuthService, offersService: OffersService, wantedService: WantedService) {
    this.authService = authService;
    this.offersService = offersService;
    this.wantedService = wantedService;

    // Needs to be create separately so it can be referenced in the template
    this.typeControl = new FormControl(undefined, Validators.required);
    this.form = new FormGroup({
      type: this.typeControl,
      item: new FormControl(undefined, Validators.required),
      info: new FormControl(undefined, Validators.required),
      deal: new FormControl(undefined, Validators.required),
      email: new FormControl(undefined, Validators.compose([Validators.required, Validators.email])),
      name: new FormControl(undefined, Validators.required)
    })
   }

  public getRequiredErrorMessage(name: string): string | undefined{
    if (this.form.controls[name]?.hasError('required')) {
      return `${this.capitalize(name)} is required`;
    }
    return undefined;
  }

  public ngOnInit(): void {
    // this.authService.logout()
    this.authService.getUserInfo().subscribe(res => {
      this.form.controls.email.setValue(res.email)
    })
  }

  public onSubmit() {
    const type = this.form.value.type as SwapShopServices.Type;
    if (!type) {
      console.error("Trying to submit a form without a type of service");
      return;
    }
    let createObs: Observable<Base.CreateResponse>;

    const request: SwapShopServices.MaterialServiceCreateRequest = {
      name: this.form.value.name,
      info: this.form.value.info,
      deal: this.form.value.deal,
      item: this.form.value.item,
      email: this.form.value.email,
    }

    switch (type) {
      case SwapShopServices.Type.OFFER:
        createObs = this.offersService.createOffer(request);
        break;
      case SwapShopServices.Type.WANTED:
        createObs = this.wantedService.createWanted(request);
        break;
      case SwapShopServices.Type.EVENT:
      default:
        console.error("Unknown type of service", type);
        return;
    }
    createObs.pipe(take(1)).subscribe(res => console.log("created", res))
  }


  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
