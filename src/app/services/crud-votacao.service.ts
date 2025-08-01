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
    return firstValueFrom(this.httpClient.get<any[]>(`votacao`, { params: filter }))
  }

  getById(filter?: any): Promise<any> {
    return firstValueFrom(this.httpClient.get<any>(`votacao/${filter.id}`))
  }

  save(body: any): Promise<any> {
    return firstValueFrom(this.httpClient.post<any>(`/votacao`, body))
  }

  update(id: any, body: any): Promise<any> {
    return firstValueFrom(this.httpClient.put<any>(`/votacao/${id}`, body))
  }

  delete(id: any): Promise<any> {
    return firstValueFrom(this.httpClient.delete<any>(`/votacao/${id}`))
  }
}
