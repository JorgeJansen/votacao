import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const defaultFilter: any = { originalUrl: true }

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(
    private http: HttpClient
  ) { }

  readByCep(cep: string, filter?: any): Promise<any> {
    return firstValueFrom(this.http.get(`https://viacep.com.br/ws/${cep}/json`, { params: Object.assign(defaultFilter, filter), observe: 'response' }))
  }

  readUFs(filter?: any): Promise<any> {
    return firstValueFrom(this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`, { params: Object.assign(defaultFilter, filter), observe: 'response' }))
  }

  readCitiesById(id: string, filter?: any): Promise<any> {
    return firstValueFrom(this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}/municipios?orderBy=nome`, { params: Object.assign(defaultFilter, filter), observe: 'response' }))
  }
}
