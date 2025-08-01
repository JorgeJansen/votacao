import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { firstValueFrom } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { AppConfigService } from './app-config.service';
import { DialogService } from './dialog.service';
import { StorageService as storage } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CrudTokenService {

  // private readonly appConfig = (globalThis as any).appConfig

  constructor(
    private appConfig: AppConfigService,
    private dialogService: DialogService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  private token = signal<string>('')

  setToken(token: string) {
    this.token.set(token)
  }

  getToken(): string {
    return this.token()
  }

  clearToken() {
    this.token.set('')
  }

  authenticate(body: any): Promise<any> {
    return firstValueFrom(this.httpClient.post<any>(`login`, body, { observe: 'response' }))
  }

  isAuthenticate() {
    const token = storage.client_jwt()
    if (JSON.parse(storage.get('is_authenticate')) && this.isTokenExpired(token)) {
      storage.save('is_authenticate', false)
      this.refreshJWT(token)
    }
  }

  private isTokenExpired(token: string): boolean {
    if (!token || token == 'undefined' || token == '') {
      return true
    }

    const date = this.getTokenExpirationDate(token)
    if (date === undefined) {
      return false
    }

    return date?.valueOf() <= new Date().valueOf()
  }

  private getTokenExpirationDate(token: string): Date | undefined {
    const helper = new JwtHelperService()
    const decoded: any = helper.decodeToken(token)

    if (decoded.exp === undefined) {
      return undefined
    }

    const date = new Date(0)
    date.setUTCSeconds(decoded.exp)
    return date
  }

  private refreshJWT(jwt?: string): Promise<any> {
    const url = this.makeUri(['/jwt', jwt])
    return firstValueFrom(this.httpClient.put(url, {}, { observe: 'response' })).then((res: any) => {
      storage.save('is_authenticate', true)
      // storage.save('client_jwt', res['body']['jwt'])
      return res
    }).catch((err: any) => {
      return err
    })
  }

  makeUri(data: any[]): string {
    this.isAuthenticate()

    // const config = this.appConfig.getConfig()
    const config = (globalThis as any).appConfig;

    if (!config)
      return ''

    let url: string = config['API_HOST']
    let qs = ''

    // port
    if ('API_PORT' in config && config['API_PORT'] !== 80 && config['API_PORT'] !== 443) {
      url += ':' + config['API_PORT']
    }

    // base api
    url += '/' + config['API_BASE']

    // data
    data.forEach((elem) => {
      if (!elem) {
        return
      }
      if (typeof (elem) === 'object') {
        Object.keys(elem).sort().forEach((key) => {
          qs += encodeURIComponent(key) + '=' + encodeURIComponent(elem[key]) + '&'
        })
      } else {
        url += '/' + elem
      }
    })

    // double /
    url = url.replace(/\/{2,}/g, '/')

    // query string
    if (qs.length > 0) {
      qs = qs.replace(/\&$/, '')
      url += '?' + qs
    }

    // protocolo http or https
    url = config['API_PROT'] + '://' + url

    // debug
    if (env.production === false && config['API_DEBUG'] === true) {
      console.log('MAKE URI: ' + url)
    }
    return url
  }

  handleError(response: any): Promise<any> {

    if (!response)
      return Promise.reject(response)

    let msgError!: string
    let Description!: string
    let DetalhesAdicionais!: string
    let statusCode: number = response.status
    msgError = response.message || "Unidentified backend error"

    switch (statusCode) {
      case 200: // no error
        break
      case 400:
        if (response.error?.errors?.code || response.error?.error?.code) {
          msgError = 'Invalid authentication code'
        }
        else if (response.error?.errors) {
          let errorKeys = Object.keys(response.error.errors)
          if (errorKeys) {
            msgError = ""
            for (let key of errorKeys) {
              if (Array.isArray(response.error?.errors[key])) {
                for (let m of response.error?.errors[key]) {
                  const msg_txt = m[0].toUpperCase() + m.slice(1)
                  msgError += `<p>${msg_txt}</p>`
                }
              }
              else
                msgError += `<p>${response.error.errors[key]}</p>`
            }
          }
          else {
            if (response.error.errors.manager?.length || response.error.errors.partner?.length) {
              // msgError = response.error.errors.manager[0]
              msgError = 'User not found - please check email and user type'
            }
            else {
              if (response.error.errors.auth?.length) {
                msgError = response.error.errors.auth[0]
              }
              if (response.error.errors.value?.length) {
                msgError = response.error.errors.value[0]
              }
            }
          }
          if (msgError == '<p>Error getting asset quotation</p>') {
            msgError = ''
          }
        }
        break
      case 401:
      case 403:
        const json = response.error?.errors || response.error
        let msg = json?.msg || json?.message
        // if ('jwt' in json && json?.jwt?.length > 0) {
        //   msg = json['jwt'][0]
        // }
        // // logout if expired token
        // if (msg === 'expired token' || msg === 'jwt decode error' || msg === 'this jwt was revoked' || msg === 'this jwt is wrong'
        //   || msg === 'this jwt is wrong, invalid or missing') {
        //   this.router.navigate(['login'])
        //   storage.clear()
        //   return Promise.reject(response)
        // }
        if (msg)
          msgError = msg
        break
      case 404:
        msgError = response.error?.errors?.msg
        break
      case 500:
        msgError = '500 - Internal Server Error'
        break
    }

    if (!storage.get('is_authenticate'))
      return Promise.reject(response)

    if (msgError || Description || DetalhesAdicionais) {
      msgError = msgError[0].toUpperCase() + msgError.slice(1)

      const description = `Error: ${msgError} - Status: ${statusCode} - URL: ${response.url}
      ${Description ? ' - Description: ' + Description : ''}
      ${DetalhesAdicionais ? ' - Additional Details: ' + DetalhesAdicionais : ''}`

      const level = statusCode >= 500 ? 'danger' : statusCode >= 400 ? 'warning' : 'info'
      // this.dialogService.log(msgError, statusCode, response.url, description, level)
      // const data = { title: 'Ops!', message: `<p class="mb-0">${statusCode} - ${response.url}</p><p class="mb-0">${msgError}</p>` }
      // this.dialogService.open(data)
    }

    return Promise.reject(response)
  }
}
