export class Product {
  private _id: number;
  private _sku: string;
  private _name: string;
  private _description: string;
  private _unitPrice: number;
  private _imageUrl: string;
  private _active: boolean;
  private _unitsInStock: number;
  private _dateCreated: Date;
  private _lastUpdated: Date;

  constructor(
    id: number,
    sku: string,
    name: string,
    description: string,
    unitPrice: number,
    imageUrl: string,
    active: boolean,
    unitsInStock: number,
    dateCreated: Date,
    lastUpdated: Date
  ) {
    this._id = id;
    this._sku = sku;
    this._name = name;
    this._description = description;
    this._unitPrice = unitPrice;
    this._imageUrl = imageUrl;
    this._active = active;
    this._unitsInStock = unitsInStock;
    this._dateCreated = dateCreated;
    this._lastUpdated = lastUpdated;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get sku(): string {
    return this._sku;
  }
  set sku(value: string) {
    this._sku = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }
  set unitPrice(value: number) {
    this._unitPrice = value;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }
  set imageUrl(value: string) {
    this._imageUrl = value;
  }

  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = value;
  }

  get unitsInStock(): number {
    return this._unitsInStock;
  }
  set unitsInStock(value: number) {
    this._unitsInStock = value;
  }

  get dateCreated(): Date {
    return this._dateCreated;
  }
  set dateCreated(value: Date) {
    this._dateCreated = value;
  }

  get lastUpdated(): Date {
    return this._lastUpdated;
  }
  set lastUpdated(value: Date) {
    this._lastUpdated = value;
  }
}
