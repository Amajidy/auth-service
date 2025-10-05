import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const newHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  try {
    const apiKey = localStorage.getItem('api-key');
    console.log()
    // فقط اگه توکن وجود داره
    if (apiKey) {
      newHeaders['x-api-key'] = apiKey;
    } else {
      // توکن پیش‌فرض فقط در حالت نبود توکن واقعی
      newHeaders['x-api-key'] = '-mhuqj9cWtY42CxghXE-E9BTEfHJg3c-u1f-epIxK64';
    }
  } catch (e) {
    console.warn('Invalid localStorage user-query', e);
    newHeaders['x-api-key'] = '-mhuqj9cWtY42CxghXE-E9BTEfHJg3c-u1f-epIxK64';
  }

  const newReq = req.clone({ setHeaders: newHeaders });
  return next(newReq);
};
