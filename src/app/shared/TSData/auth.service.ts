import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs/Rx';
import { HttpService } from './http.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ProjectApiConfig } from './project-api-config';
import { UserService } from './user/user.service';
import { CanActivate, Router } from '@angular/router';
import { Location } from '@angular/common';

const AUTH_TOKEN_HEADER = 'Authorization';

@Injectable()
export class AuthService {
  private user: any = {};
  private userSubject$ = new ReplaySubject();
  private apiConfig = new ProjectApiConfig();
  public user$ = this.userSubject$.asObservable();
  constructor(
    private http: HttpService,
    private cookieService: CookieService,
    private userService: UserService ) {
      const userObj = this.cookieService.getObject('user');
      if (userObj !== undefined) {
        this.setAuthToken(userObj['token']);
      }
    }

  public login(username: string, password: string): Observable<any> {
    this.http.resetHeaders();
    const request = this.http.post(this.apiConfig.authUrl, {
      username: username,
      password: password
    });
    return request.do((response: any) => {
      this.cookieService.putObject('user', response);
      this.setAuthToken(response.token);
    });
  }

  public isLoggedIn(): boolean {
    const lUser = this.cookieService.get('user');
    return !!(this.user.id || lUser);
  }

  public logout(): void {
    this.http.removeHeader(AUTH_TOKEN_HEADER);
    this.user = {};
    this.cookieService.remove('user');
  }

  public signUp(user: any): Observable<any> {
    return this.http.post(`${this.apiConfig.baseUrl}/contributors`, user).flatMap(user => {
      return this.login(user.username, user.password);
    });
  }

  public getUser(): Observable<Object> {
    return this.http.get('http://160.7.242.7:8000/api/users/me/').do((user: any) => {
      this.user = user;
      this.userSubject$.next(this.user);
    });
  }

  public getUserType(): string {
    return this.cookieService.getObject('user')['type'];
  }

  private setAuthToken(token: string): void {
    this.http.updateHeader(AUTH_TOKEN_HEADER, 'Token ' + token);
  }

}

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    const loggedIn = this.auth.isLoggedIn();
    if (!loggedIn) {
      this.router.navigate(['login']);
      return loggedIn;
    }
    return loggedIn;
  }
}

@Injectable()
export class IsTeacher implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    const type = this.auth.getUserType();
    const isTeacher = type === 'teacher';
    if (!isTeacher) {
      if (type === 'student') {
        this.router.navigate(['students']);
      }
    }
    return isTeacher;
  }
}

@Injectable()
export class IsStudent implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    const type = this.auth.getUserType()
    const isStudent = type === 'student';
    if (!isStudent) {
      if (type === 'teacher') {
        this.router.navigate(['teachers']);
      }
    }
    return isStudent;
  }
}

