import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
 
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
 
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // array in local storage for registered users
    let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

    console.log("Users: " + users);
    // wrap in delayed observable to simulate server api call
    return Observable.of(null).mergeMap(() => {

      // authenticate
      if (request.url.endsWith('http://localhost/api/authenticate') && request.method === 'POST') {
        console.log(request.method);
        // find if any user matches login credentials
        let filteredUsers = users.filter(user => {
          console.log(user.username);
          return user.username === request.body.username && user.password === request.body.password;
        });

        if (filteredUsers.length) {
          // if login details are valid return 200 OK with user details and fake jwt token
          let user = filteredUsers[0];
          let body = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            token: 'fake-jwt-token'
          };

          console.log(body);
          return Observable.of(new HttpResponse({ status: 200, body: body }));
        } else {
          // else return 400 bad request
          return Observable.throw('Username or password is incorrect');
        }
      }

      // get users
      if (request.url.endsWith('/api/users') && request.method === 'GET') {
        // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          return Observable.of(new HttpResponse({ status: 200, body: users }));
        } else {
          // return 401 not authorised if token is null or invalid
          return Observable.throw('Unauthorised');
        }
      }

      // pass through any requests not handled above
      return next.handle(request);         
    })

    // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    .materialize()
    .delay(500)
    .dematerialize();
  }
}
 
export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};