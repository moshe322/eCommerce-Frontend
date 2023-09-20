import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  //inject HttpClient
  constructor(private httpClient: HttpClient) {}

  //get products
  //if category is selected, get products by category
  //if category is not selected, get all products aka category id = 0
  getProductList(categoryId: number): Observable<Product[]> {
    let searchUrl = this.baseUrl;
    if (categoryId != 0) {
      searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    }
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  //get products using pagination
  //if category is selected, get products by category using pagination
  //if category is not selected, get all products using pagination aka category id = 0
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

  //get categories
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  //get products using keyword and pagination
  getSearchProductsPaginate(
    page: number,
    size: number,
    keyword: string
  ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  //get a single product using product id
  getProduct(productId: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);
  }
}

//unwraps the JSON from Spring Data REST
//_embedded is the JSON array of products
//page is the metadata
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

//unwraps the JSON from Spring Data REST
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
