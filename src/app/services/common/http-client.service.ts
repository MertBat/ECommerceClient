import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {

  baseUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
  ) { }

  private url(requestParameter: Partial<RequestParameters>): string {
    return `${requestParameter.baseUrl ? requestParameter.baseUrl : this.baseUrl
      }/${requestParameter.controller}${requestParameter.action ? `/${requestParameter.action}` : ''
      }`;
  }

  get<T>(
    requestParameter: Partial<RequestParameters>,
    id?: string
  ): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${id ? `/${id}` : ''}${requestParameter.queryString ? `?${requestParameter.queryString}` : ''
        }`;

    return this.httpClient.get<T>(url, { headers: requestParameter.headers, responseType: requestParameter.responseType as 'json' });
  }

  post<T>(
    requestParameter: Partial<RequestParameters>,
    body: Partial<T>
  ): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) {
      url = requestParameter.fullEndPoint;
    } else {
      url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ''
        }`;
    }
    return this.httpClient.post<T>(url, body, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json' 
    });
  }

  put<T>(
    requestParemeters: Partial<RequestParameters>,
    body: Partial<T>
  ): Observable<T> {
    let url: string = '';
    if (requestParemeters.fullEndPoint) {
      url = requestParemeters.fullEndPoint;
    } else {
      url = `${this.url(requestParemeters)}${requestParemeters.queryString ? `?${requestParemeters.queryString}` : ''
        }`;
    }
    return this.httpClient.put<T>(url, body, {
      headers: requestParemeters.headers,
    });
  }

  delete<T>(
    requestParemeters: Partial<RequestParameters>,
    id: string
  ): Observable<T> {
    let url: string = '';
    if (requestParemeters.fullEndPoint) {
      url = requestParemeters.fullEndPoint;
    } else {
      url = `${this.url(requestParemeters)}/${id}
      ${requestParemeters.queryString ? `?${requestParemeters.queryString}` : ''
        }`;
    }
    return this.httpClient.delete<T>(url, {
      headers: requestParemeters.headers,
    });
  }
}

export class RequestParameters {
  controller?: string;
  action?: string;
  queryString?: string;
  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string;
  responseType?: string = 'json';
}
