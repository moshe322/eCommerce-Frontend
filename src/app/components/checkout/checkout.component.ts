import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';
import { Country, State } from 'country-state-city';
import { ICountry, IState } from 'country-state-city';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',

  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = new FormGroup({});

  private _formBuilder: FormBuilder;
  private _cartService: CartService;
  private _formService: FormService;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  months: number[] = [];
  years: number[] = [];

  countries: ICountry[] = [];
  statesShipping: IState[] = [];
  statesBilling: IState[] = [];

  constructor(formBuilder: FormBuilder, cartService: CartService) {
    this._formBuilder = formBuilder;
    this._cartService = cartService;
    this._formService = new FormService();
  }

  /**
   * Load cart details.
   * Initialize checkout form group.
   * @memberof CheckoutComponent
   */
  ngOnInit(): void {
    this.loadCountries();
    this.loadMonths(new Date().getMonth() + 1);
    this.loadYears();
    this.setCartDetails();
    this.checkoutFormGroup = this._formBuilder.group({
      customer: this._formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this._formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this._formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this._formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });
  }

  /**
   * Use shipping address as billing address.
   * If checkbox is checked, set billing address to shipping address.
   * If checkbox is unchecked, make billing address editable and reset billing address.
   * @param event
   * @memberof CheckoutComponent
   */
  onCheckChange(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress']['value']
      );
      this.checkoutFormGroup.controls['billingAddress'].disable();
    }
    if (!event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].enable();
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  /**
   * Change states, when country is changed.
   * If number is 1, change shipping states.
   * If number is 2, change billing states.
   * @param number
   * @memberof CheckoutComponent
   */
  changeStates(number: number) {
    if (number == 1) {
      const shippingFormGroup = this.checkoutFormGroup.get('shippingAddress');
      const selectedCountry: string = shippingFormGroup?.value.country;
      this.statesShipping = State.getStatesOfCountry(selectedCountry);
    }
    if (number == 2) {
      const billingFormGroup = this.checkoutFormGroup.get('billingAddress');
      const selectedCountry: string = billingFormGroup?.value.country;
      this.statesBilling = State.getStatesOfCountry(selectedCountry);
    }
  }

  /**
   * Change months.
   * If selected year is current year, start month is current month.
   * Else start month is 1.
   * @memberof CheckoutComponent
   */
  changeMonthsByYear() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = creditCardFormGroup?.value.expirationYear;
    const currentYear: number = new Date().getFullYear();
    let startMonth: number = 1;

    if (selectedYear == currentYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.loadMonths(startMonth);
  }

  /**
   * Set cart details.
   * Get total price and total quantity.
   * @private
   * @memberof CartDetailsComponent
   */
  private setCartDetails() {
    this._cartService
      .getTotalPrice()
      .subscribe((totalPrice) => (this.totalPrice = totalPrice));

    this._cartService
      .getTotalQuantity()
      .subscribe((totalQuantity) => (this.totalQuantity = totalQuantity));
  }

  /**
   * Load countries.
   * @private
   * @memberof CheckoutComponent
   */
  private loadCountries() {
    this.countries = Country.getAllCountries();
  }

  /**
   * Load months.
   * @param startMonth
   * @memberof CheckoutComponent
   */
  private loadMonths(startMonth: number) {
    this._formService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.months = data;
    });
  }

  /**
   * Load years.
   * @memberof CheckoutComponent
   */
  private loadYears() {
    this._formService.getCreditCardYears().subscribe((data) => {
      this.years = data;
    });
  }

  /**
   * TODO: Handle the submit button.
   * @memberof CheckoutComponent
   */
  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);
    console.log(this.checkoutFormGroup.get('creditCard')?.value);
  }
}
