import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.apiUrl + '/products';
  private categoryUrl = environment.apiUrl + '/product-category';

  constructor(private httpClient: HttpClient) {}

  /**
   * Get products.
   * If category is selected, get products by category.
   * If category is not selected, get all products aka category id = 0.
   * @param categoryId
   * @returns Observable<Product[]>
   * @memberof ProductService
   */
  getProductList(categoryId: number): Observable<Product[]> {
    let searchUrl = this.baseUrl;
    if (categoryId != 0) {
      searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    }
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  /**
   * Get products using pagination.
   * If category is selected, get products by category using pagination.
   * If category is not selected, get all products using pagination aka category id = 0.
   * @param page
   * @param size
   * @param categoryId
   * @returns Observable<GetResponseProducts>
   * @memberof ProductService
   */
  getProductListPaginate(
    page: number,
    size: number,
    categoryId: number
  ): Observable<GetResponseProducts> {
    let searchUrl = `${this.baseUrl}?page=${page}&size=${size}`;
    if (categoryId != 0) {
      searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${size}`;
    }
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  /**
   * Get product categories.
   * @returns Observable<ProductCategory[]>
   * @memberof ProductService
   */
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  /**
   * Get products using keyword and pagination.
   * @param page
   * @param size
   * @param keyword
   * @returns Observable<GetResponseProducts>
   * @memberof ProductService
   */
  getSearchProductsPaginate(
    page: number,
    size: number,
    keyword: string
  ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  /**
   * Get a single product using product id.
   * @param productId
   * @returns Observable<Product>
   * @memberof ProductService
   */
  getProduct(productId: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);
  }
}

/**
 * Unwraps the JSON from Spring Data REST.
 * _embedded is the JSON array of products.
 * page is the metadata.
 */
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

/**
 * Unwraps the JSON from Spring Data REST.
 */
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
