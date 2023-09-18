import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 0;
  currentCategoryName: string = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
      if (hasCategoryId) {
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
        this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      } else {
        //default values
        this.currentCategoryId = 0;
        this.currentCategoryName = "All";
      }

      this.productService
        .getProductList(this.currentCategoryId)
        .subscribe((data) => {
          this.products = data;
        });
    });
  }
}
