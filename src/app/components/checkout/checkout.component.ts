import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = new FormGroup({});
  isSubmitted = false;

  private _cartService: CartService;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private formBuilder: FormBuilder, cartService: CartService) {
    this._cartService = cartService;
  }

  /**
   * Load cart details.
   * Initialize checkout form group.
   * @memberof CheckoutComponent
   */
  ngOnInit(): void {
    this.setCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
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
