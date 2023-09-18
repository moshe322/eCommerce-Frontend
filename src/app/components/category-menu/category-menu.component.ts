import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.css'],
})
export class CategoryMenuComponent implements OnInit{
  private _productService: ProductService;
  public productCategories: ProductCategory[] = [];

  constructor(productService: ProductService) {
    this._productService = productService;
  }

  ngOnInit(): void {
    this.listProductCategories();
  }

  private listProductCategories() {
    this._productService.getProductCategories().subscribe((data) => {
      this.productCategories = data;
    });
  }
  
}
