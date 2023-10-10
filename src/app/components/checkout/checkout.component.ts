import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WhiteSpace } from 'src/app/validators/white-space';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';
import { Country, State } from 'country-state-city';
import { ICountry, IState } from 'country-state-city';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from 'src/app/common/payment-info';

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
  private _checkoutService: CheckoutService;
  private _router: Router;
  private _auth: AuthService;

  isSubmitted: boolean = false;

  isPurchaseDisabled: boolean = false;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  months: number[] = [];
  years: number[] = [];

  countries: ICountry[] = [];
  statesShipping: IState[] = [];
  statesBilling: IState[] = [];

  stripe = Stripe(environment.stripePublicKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: String = '';

  constructor(
    formBuilder: FormBuilder,
    cartService: CartService,
    formService: FormService,
    checkoutService: CheckoutService,
    route: Router,
    auth: AuthService
  ) {
    this._formBuilder = formBuilder;
    this._cartService = cartService;
    this._formService = formService;
    this._checkoutService = checkoutService;
    this._router = route;
    this._auth = auth;
  }

  /**
   * Load cart details.
   * Initialize checkout form group.
   * @memberof CheckoutComponent
   */
  ngOnInit(): void {
    this.setupStripeForm();
    this.loadCountries();
    // this.loadMonths(new Date().getMonth() + 1);
    // this.loadYears();
    this.setCartDetails();
    this.checkoutFormGroup = this._formBuilder.group({
      customer: this._formBuilder.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            WhiteSpace.noSpaceAlowed,
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            WhiteSpace.noSpaceAlowed,
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
      }),
      shippingAddress: this._formBuilder.group({
        street: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            WhiteSpace.noSpaceAlowed,
          ],
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            WhiteSpace.noSpaceAlowed,
          ],
        ],
        state: [''],
        country: ['', Validators.required],
        zipCode: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            WhiteSpace.noSpaceAlowed,
          ],
        ],
      }),
      billingAddress: this._formBuilder.group({
        street: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            WhiteSpace.noSpaceAlowed,
          ],
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            WhiteSpace.noSpaceAlowed,
          ],
        ],
        state: [''],
        country: ['', Validators.required],
        zipCode: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            WhiteSpace.noSpaceAlowed,
          ],
        ],
      }),
      creditCard: this._formBuilder.group({
        /*
        cardType: ['', Validators.required],
        nameOnCard: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            WhiteSpace.noSpaceAlowed,
          ],
        ],
        cardNumber: [
          '',
          [Validators.required, Validators.pattern('[0-9]{16}')],
        ],
        securityCode: [
          '',
          [Validators.required, Validators.pattern('[0-9]{3}')],
        ],
        expirationMonth: ['', Validators.required],
        expirationYear: ['', Validators.required],
        */
      }),
    });

    this._auth.user$.subscribe((data) => {
      if (data) {
        this.checkoutFormGroup.controls['customer'].setValue({
          firstName: '',
          lastName: '',
          email: data.email,
        });
      }
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
      this.statesBilling = this.statesShipping;
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

  // /**
  //  * Change months.
  //  * If selected year is current year, start month is current month.
  //  * Else start month is 1.
  //  * @memberof CheckoutComponent
  //  */
  // changeMonthsByYear() {
  //   const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
  //   const selectedYear: number = creditCardFormGroup?.value.expirationYear;
  //   const currentYear: number = new Date().getFullYear();
  //   let startMonth: number = 1;

  //   if (selectedYear == currentYear) {
  //     startMonth = new Date().getMonth() + 1;
  //   }

  //   this.loadMonths(startMonth);
  // }

  /**
   * Handle submit button.
   * If form is valid, place order.
   * Else scroll to first element with error.
   * @memberof CheckoutComponent
   */
  onSubmit() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.valid && this.displayError === '') {
      this.isPurchaseDisabled = true;

      let order = new Order(this.totalQuantity, this.totalPrice);

      let orderItems = this._cartService.cartItems.map(
        (item) => new OrderItem(item)
      );

      let purchase = new Purchase(
        this.checkoutFormGroup.controls['customer'].value,
        this.checkoutFormGroup.controls['shippingAddress'].value,
        this.checkoutFormGroup.controls['billingAddress'].value,
        order,
        orderItems
      );

      this.paymentInfo.amount = Math.round(this.totalPrice * 100);
      this.paymentInfo.currency = 'USD';

      this._checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (data) => {
          this.stripe
            .confirmCardPayment(
              data.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name:
                      purchase.customer.firstName +
                      ' ' +
                      purchase.customer.lastName,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: purchase.billingAddress.country,
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: { error: { message: string } }) => {
              if (result.error) {
                alert('There was an error: ' + result.error.message);
                this.isPurchaseDisabled = false;
              } else {
                this._checkoutService.placeOrder(purchase).subscribe({
                  next: (response) => {
                    alert(
                      `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
                    );
                    this.resetCart();
                    this.isPurchaseDisabled = false;
                  },
                  error: (err) => {
                    alert(`There was an error: ${err.message}`);
                    this.isPurchaseDisabled = false;
                  },
                });
              }
            });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.scrollToError();
    }
  }
  /**
   * Setup stripe form.
   * @private
   * @memberof CheckoutComponent
   */
  private setupStripeForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount('#card-element');
    this.cardElement.on('change', (event: any) => {
      if (event.error) {
        this.displayError = event.error.message;
      } else {
        this.displayError = '';
      }
    });
  }

  /**
   * Reset cart.
   * @private
   * @memberof CartDetailsComponent
   */
  private resetCart() {
    sessionStorage.clear();
    this._cartService.clearCart();
    this.checkoutFormGroup.reset();
    this.isSubmitted = false;
    this._router.navigateByUrl('/products');
  }

  /**
   * Scroll to first element with error.
   * @private
   * @memberof CartDetailsComponent
   */
  private scrollToError(): void {
    const firstElementWithError = document.querySelector(
      'form .ng-invalid'
    ) as HTMLElement;
    firstElementWithError.scrollIntoView({ behavior: 'smooth' });
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

  // /**
  //  * Load months.
  //  * @param startMonth
  //  * @memberof CheckoutComponent
  //  */
  // private loadMonths(startMonth: number) {
  //   this._formService.getCreditCardMonths(startMonth).subscribe((data) => {
  //     this.months = data;
  //   });
  // }

  // /**
  //  * Load years.
  //  * @memberof CheckoutComponent
  //  */
  // private loadYears() {
  //   this._formService.getCreditCardYears().subscribe((data) => {
  //     this.years = data;
  //   });
  // }

  //getters
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  get shippingStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get billingStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get cardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get nameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get cardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get securityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  get expirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  get expirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }
}
