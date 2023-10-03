export class Customer {
  private firstName: string;
  private lastName: string;
  private email: string;

  constructor(firstName: string, lastName: string, email: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  get _firstName(): string {
    return this.firstName;
  }
  set _firstName(value: string) {
    this.firstName = value;
  }

  get _lastName(): string {
    return this.lastName;
  }
  set _lastName(value: string) {
    this.lastName = value;
  }

  get _email(): string {
    return this.email;
  }
  set _email(value: string) {
    this.email = value;
  }
}
