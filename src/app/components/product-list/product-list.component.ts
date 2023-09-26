import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
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
  pageSize: number = 8;
  totalElements: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  /**
   * Get products when component is initialized.
   * If search is on, search products.
   * If search is off, list products.
   * @memberof ProductListComponent
   */
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

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  /**
   * Search products using keyword.
   * @memberof ProductListComponent
   */
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

  /**
   * List products using category id.
   * If catgeory id is 0, list all products.
   * If category id is not 0, list products by category id.
   * @memberof ProductListComponent
   */
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

  /**
   * Scroll to top of page.
   * Smooth scroll.
   * @memberof ProductListComponent
   */
  scrollUp(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Update page size.
   * Reset page number to 1.
   * If search is on, search products.
   * If search is off, list products.
   * @param value
   * @memberof ProductListComponent
   */
  updateSize(value: string): void {
    this.pageSize = +value;
    this.pageNumber = 1;
    if (this.searchOn) {
      this.searchProducts();
    } else {
      this.listProducts();
    }
    //this.scrollUp();
  }

  /**
   * Update category name.
   * @param name
   * @memberof ProductListComponent
   */
  setCategoryName(name: string): void {
    this.currentCategoryName = name;
  }

  /**
   * Process data from backend.
   * Set products, page number, page size, and total elements.
   * Return function to be used in subscribe.
   * @memberof ProductListComponent
   */
  processData() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  /**
   * Add product to cart.
   * @param product
   * @memberof ProductListComponent
   */
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
