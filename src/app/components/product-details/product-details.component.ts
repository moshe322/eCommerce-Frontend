import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  private _router: ActivatedRoute;
  private _productService: ProductService;
  private _cartService: CartService;

  product: Product = new Product(
    0,
    '',
    '',
    '',
    0,
    '',
    false,
    0,
    new Date(),
    new Date()
  );

  constructor(
    router: ActivatedRoute,
    productService: ProductService,
    cartService: CartService
  ) {
    this._router = router;
    this._productService = productService;
    this._cartService = cartService;
  }

  /**
   * Get product details.
   * @memberof ProductDetailsComponent
   */
  ngOnInit(): void {
    const productId: number = +this._router.snapshot.paramMap.get('id')!;
    this.getProductDetails(productId);
  }

  /**
   * Get product details.
   * @private
   * @param productId
   * @memberof ProductDetailsComponent
   */
  private getProductDetails(productId: number) {
    this._productService.getProduct(productId).subscribe((data) => {
      this.product = data;
    });
  }

  /**
   * Add product to cart.
   * @param product
   * @memberof ProductDetailsComponent
   */
  addToCart(product: Product): void {
    this._cartService.addToCart(product);
  }
}
