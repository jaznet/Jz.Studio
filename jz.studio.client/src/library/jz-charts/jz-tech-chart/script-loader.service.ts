import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  loadScript(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () =>
        resolve(true);
      script.onerror = () =>
        reject(false);
      document.body.appendChild(script);
    });
  }
}
