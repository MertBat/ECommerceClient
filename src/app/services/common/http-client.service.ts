import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(
    private httpClient: HttpClient,
    @Inject('baseUrl') private baseUrl: string
  ) {}

  private url(requestParemeters: Partial<RequestParemeters>): string {
    return `${
      requestParemeters.baseUrl ? requestParemeters.baseUrl : this.baseUrl
    }${requestParemeters.controller}${
      requestParemeters.action ? `/${requestParemeters.action}` : ''
    }`;
  }

  get<T>(
    requestParemeters: Partial<RequestParemeters>,
    id?: string
  ): Observable<T> {
    let url: string = '';
    if (requestParemeters.fullEndPoint) {
      url = requestParemeters.fullEndPoint;
    } else {
      url = `${this.url(requestParemeters)}${id ? `/${id}` : ''}
      ${requestParemeters.queryString ? `?${requestParemeters.queryString}` : ''}`;
    }
    return this.httpClient.get<T>(url, { headers: requestParemeters.headers });
  }

  post<T>(
    requestParemeters: Partial<RequestParemeters>,
    body: Partial<T>
  ): Observable<T> {
    let url: string = '';
    if (requestParemeters.fullEndPoint) {
      url = requestParemeters.fullEndPoint;
    } else {
      url = `${this.url(requestParemeters)}
      ${requestParemeters.queryString ? `?${requestParemeters.queryString}` : ''}`;
    }
    return this.httpClient.post<T>(url, body, {
      headers: requestParemeters.headers,
    });
  }

  put<T>(
    requestParemeters: Partial<RequestParemeters>,
    body: Partial<T>
  ): Observable<T> {
    let url: string = '';
    if (requestParemeters.fullEndPoint) {
      url = requestParemeters.fullEndPoint;
    } else {
      url = `${this.url(requestParemeters)}
      ${requestParemeters.queryString ? `?${requestParemeters.queryString}` : ''}`;
    }
    return this.httpClient.put<T>(url, body, {
      headers: requestParemeters.headers,
    });
  }

  delete<T>(
    requestParemeters: Partial<RequestParemeters>,
    id: string
  ): Observable<T> {
    let url: string = '';
    if (requestParemeters.fullEndPoint) {
      url = requestParemeters.fullEndPoint;
    } else {
      url = `${this.url(requestParemeters)}/${id}
      ${requestParemeters.queryString ? `?${requestParemeters.queryString}` : ''}`;
    }
    return this.httpClient.delete<T>(url, {
      headers: requestParemeters.headers,
    });
  }
}

export class RequestParemeters {
  controller?: string;
  action?: string;
  queryString?: string;
  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string;
}
