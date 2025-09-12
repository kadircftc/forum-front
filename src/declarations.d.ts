declare module 'crypto-browserify'; 

import 'axios';

declare module 'axios' {
  // Axios config üzerine _retry alanını ekledik
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}