import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let newHeaders: { [name: string]: string | string[] } = {
    'Content-Type': 'application/json'
  };

  const webtoken = JSON.parse(localStorage.getItem('user-query') ?? '');

  // if (webtoken.token) {
    newHeaders['x-api-key'] = webtoken.token ?? '-mhuqj9cWtY42CxghXE-E9BTEfHJg3c-u1f-epIxK64';
  // }
  const newReq = req.clone({
    setHeaders: newHeaders
  });

  return next(newReq);
};
