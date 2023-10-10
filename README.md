# eCommerce App - Frontend

## Description:
Frontend code for the eCommerce App project, using Angular

## Versions:
- [Angular 16.2.1](https://angular.io/)
- [Node.js 18.17.1](https://nodejs.org/en)
- [npm 9.6.7](https://www.npmjs.com/)

## Tools Used:
- [Visual Studio Code](https://code.visualstudio.com/)

## Resources:
- [Angular.io](https://angular.io/)
- [Okta](https://www.okta.com/)
- [Stripe](https://stripe.com/en-nl)

### Tips:
How to create SSL certificate for localhost:
```
mkdir ssl-localhost
```
```
openssl req -x509 -out ssl-localhost\localhost.crt -keyout ssl-localhost\localhost.key -newkey rsa:2048 -nodes -sha256 -days 365 -config localhost.conf
```