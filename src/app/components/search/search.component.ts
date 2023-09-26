import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  private _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  /**
   * Route to search page with keyword.
   * @param keyword
   * @memberof SearchComponent
   */
  search(keyword: string): void {
    this._router.navigateByUrl(`/search/${keyword}`);
  }
}
