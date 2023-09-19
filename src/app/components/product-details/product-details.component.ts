import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  private _router: ActivatedRoute;
  private _productService: ProductService;

  product!: Product;

  constructor(router: ActivatedRoute, productService: ProductService) {
    this._router = router;
    this._productService = productService;
  }

  ngOnInit(): void {
    const productId: number = +this._router.snapshot.paramMap.get('id')!;
    this.getProductDetails(productId);
  }

  private getProductDetails(productId: number) {
    this._productService.getProduct(productId).subscribe((data) => {
      this.product = data;
    });
  }
}
