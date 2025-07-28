import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudVotacaoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(filter?: any): Promise<any[]> {
    return firstValueFrom(this.httpClient.get<any[]>(`api/votacao`, { params: filter }))
  }

  getById(filter?: any): Promise<any> {
    return firstValueFrom(this.httpClient.get<any>(`api/votacao/${filter.id}`))
  }

  save(body: any): Promise<any> {
    return firstValueFrom(this.httpClient.post<any>(`/api/votacao`, body))
  }

  update(id: any, body: any): Promise<any> {
    return firstValueFrom(this.httpClient.put<any>(`/api/votacao/${id}`, body))
  }

  delete(id: any): Promise<any> {
    return firstValueFrom(this.httpClient.delete<any>(`/api/votacao/${id}`))
  }
}
