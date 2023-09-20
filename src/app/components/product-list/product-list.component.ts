import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 0;
  previousCategoryId: number = 0;
  currentCategoryName: string = '';
  searchOn: boolean = false;
  keyword: string = '';
  previousKeyword: string = '';

  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  //get products when component is initialized
  //if search is on, search products
  //if search is off, list products
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.searchOn = this.route.snapshot.paramMap.has('keyword');
      if (this.searchOn) {
        this.searchProducts();
      } else {
        this.listProducts();
      }
    });
  }

  //search products using keyword
  searchProducts(): void {
    this.keyword = this.route.snapshot.paramMap.get('keyword')!;
    if (this.keyword != this.previousKeyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = this.keyword;
    this.productService
      .getSearchProductsPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.keyword
      )
      .subscribe(this.processData());
    this.setCategoryName('Search results for: ' + this.keyword);
    this.scrollUp();
  }

  //list products using category id
  //if catgeory id is 0, list all products
  //if category id is not 0, list products by category id
  listProducts(): void {
    this.route.paramMap.subscribe(() => {
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

      if (hasCategoryId) {
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
        this.setCategoryName(this.route.snapshot.paramMap.get('name')!);
      } else if (this.searchOn) {
        this.currentCategoryId = 0;
        this.setCategoryName('Search results for: ' + this.keyword);
      } else {
        this.currentCategoryId = 0;
        this.setCategoryName('All');
      }

      //check if we have a different category id than previous
      //angular will reuse a component if it is currently being viewed
      if (this.previousCategoryId != this.currentCategoryId) {
        this.pageNumber = 1;
      }
      this.previousCategoryId = this.currentCategoryId;

      //get products for given category id
      this.productService
        .getProductListPaginate(
          this.pageNumber - 1,
          this.pageSize,
          this.currentCategoryId
        )
        .subscribe(this.processData());
    });
    this.scrollUp();
  }

  //scroll to top of page
  //smooth scroll
  scrollUp(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  //update page size
  //reset page number to 1
  //if search is on, search products
  //if search is off, list products
  updateSize(value: string): void {
    this.pageSize = +value;
    this.pageNumber = 1;
    if (this.searchOn) {
      this.searchProducts();
    } else {
      this.listProducts();
    }
    this.scrollUp();
  }

  //update category name
  setCategoryName(name: string): void {
    this.currentCategoryName = name;
  }

  //process data from backend
  //set products, page number, page size, and total elements
  //return function to be used in subscribe
  processData() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  //add product to cart
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
