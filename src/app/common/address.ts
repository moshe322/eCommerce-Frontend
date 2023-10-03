export class Address {
  private street: string;
  private city: string;
  private state: string;
  private country: string;
  private zipCode: string;

  constructor(
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
  ) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.country = country;
    this.zipCode = zipCode;
  }

  get _street(): string {
    return this.street;
  }
  set _street(value: string) {
    this.street = value;
  }

  get _city(): string {
    return this.city;
  }
  set _city(value: string) {
    this.city = value;
  }

  get _state(): string {
    return this.state;
  }
  set _state(value: string) {
    this.state = value;
  }

  get _country(): string {
    return this.country;
  }
  set _country(value: string) {
    this.country = value;
  }

  get _zipCode(): string {
    return this.zipCode;
  }
  set _zipCode(value: string) {
    this.zipCode = value;
  }
}
