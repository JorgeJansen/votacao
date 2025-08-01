import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudProjetoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(filter?: any): Promise<any[]> {
    return firstValueFrom(this.httpClient.get<any[]>(`projeto`, { params: filter }))
  }

  getById(id: any, filter?: any): Promise<any> {
    return firstValueFrom(this.httpClient.get<any>(`projeto/${id}`, { params: filter }))
  }

  save(body: any): Promise<any> {
    return firstValueFrom(this.httpClient.post<any>(`/projeto`, body))
  }

  update(id: any, body: any): Promise<any> {
    return firstValueFrom(this.httpClient.put<any>(`/projeto/${id}`, body))
  }

  delete(id: any): Promise<any> {
    return firstValueFrom(this.httpClient.delete<any>(`/projeto/${id}`))
  }
}
