import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CrudVereadorService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAll(filter?: any): Promise<any[]> {
    return firstValueFrom(this.httpClient.get<any[]>(`vereador`, { params: filter }))
  }

  getById(id: any, filter?: any): Promise<any> {
    return firstValueFrom(this.httpClient.get<any>(`vereador/${id}`, { params: filter }))
  }

  save(body: any): Promise<any> {
    return firstValueFrom(this.httpClient.post<any>(`/vereador`, body))
  }

  update(id: any, body: any): Promise<any> {
    return firstValueFrom(this.httpClient.put<any>(`/vereador/${id}`, body))
  }

  delete(id: any): Promise<any> {
    return firstValueFrom(this.httpClient.delete<any>(`/vereador/${id}`))
  }
}
