import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudImageService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(filter?: any): Promise<any[]> {
    return firstValueFrom(this.httpClient.get<any[]>(`images`, { params: filter }))
  }

  getById(id: any, filter?: any): Promise<any> {
    return firstValueFrom(this.httpClient.get<any>(`images/${id}`, { params: filter }))
  }

  save(body: any): Promise<any> {
    return firstValueFrom(this.httpClient.post<any>(`/images`, body))
  }

  update(id: any, body: any): Promise<any> {
    return firstValueFrom(this.httpClient.put<any>(`/images/${id}`, body))
  }

  delete(id: any): Promise<any> {
    return firstValueFrom(this.httpClient.delete<any>(`/images/${id}`))
  }
}
