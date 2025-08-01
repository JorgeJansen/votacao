import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map } from 'rxjs';
import { CrudTokenService } from '../services/crud-token.service';
import { StorageService as storage } from '../services/storage.service';

export const tokenInterceptorFn: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(CrudTokenService);
  const token = storage.client_jwt()

  let body: any = request.body
  let apiReq: HttpRequest<unknown>;

  let baseUrl = request.params.get('originalUrl') ? request.url : tokenService.makeUri([request.url])

  if (token) {
    apiReq = request.clone({
      url: baseUrl,
      body,
      setHeaders: { Authorization: token }
    })
  } else {
    apiReq = request.clone({
      url: baseUrl,
      body
    })
  }
  return next(apiReq).pipe(map((event: HttpEvent<any>) => {
    if (event instanceof HttpResponse) {
      const jwt = event.headers.get("authorization")
      if (jwt) {
        storage.save('client_jwt', jwt)
        storage.save('is_authenticate', true)
      }
    }
    return event;
  }), catchError((error: HttpErrorResponse) => {
    return tokenService.handleError(error)
  }))
}
