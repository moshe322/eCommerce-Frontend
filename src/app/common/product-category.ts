export class ProductCategory {
  private _id: number;
  private _categoryName: string;

  constructor(id: number, categoryName: string) {
    this._id = id;
    this._categoryName = categoryName;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get categoryName(): string {
    return this._categoryName;
  }

  set categoryName(value: string) {
    this._categoryName = value;
  }
}
