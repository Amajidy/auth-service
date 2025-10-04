import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const authService = inject(AuthService);
  // const authToken = authService.token;

  let newHeaders: { [name: string]: string | string[] } = {
    'Content-Type': 'application/json'
  };

  // if (authToken !== undefined) {
  //   newHeaders['Authorization'] = `Bearer ${authToken}`;
  // }
  const newReq = req.clone({
    setHeaders: newHeaders
  });

  return next(newReq);
};
