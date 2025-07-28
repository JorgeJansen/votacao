import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from "@angular/common";
import moment from "moment";
import _ from "lodash";

export class UsefullFunctions {

  public static capitalizeFirstLetter(text: string) {
    return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : ''
  }

  public static isNumber(value: string) {
    const regex = /[0-9]/
    return regex.test(value)
  }

  public static EmailPattern(): RegExp {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  }

  public static getNamePattern(): string {
    return `^[a-zA-ZàáâãèéêėìíîòóôõùúûüūýżźñçÀÁÂÃÅĆČĖÈÉÊÌÍÎÒÓÔÕÙÚÛŪÝŻŹÑÇ'\s]{2,100}(?: [a-zA-ZàáâãèéêėìíîòóôõùúûüūýżźñçÀÁÂÃÅĆČĖÈÉÊÌÍÎÒÓÔÕÙÚÛŪÝŻŹÑÇ'\s]{1,100})+[ ]*$`
  }

  public static capitalizeName(full_name: string): string {
    let separateWord = full_name.toLowerCase().split(' ')
    for (let i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
        separateWord[i].substring(1)
    }
    return separateWord.join(' ')
  }

  public static RetirarMascara(value: string): string {
    if (typeof value == 'string') {
      return convertToSlug(value)
    } else {
      return value
    }
  }

  public static MonetarioParaDecimal(value: string) {
    if (typeof value == 'string') {
      value = value.replace(/[^0-9\,-]+/g, '').replace(',', '.')
    }
    return parseFloat(value)
  }

  public static CurrencyMask(value: string | number, code = 'BRL', locale = 'pt-BR') {
    const currencyPipe: CurrencyPipe = new CurrencyPipe(locale)
    return currencyPipe.transform(value, code)
  }

  public static PercentMask(value: string | number, digitsInfo = '1.2-2', locale = 'pt-BR') {
    const currencyPipe: PercentPipe = new PercentPipe(locale)
    return currencyPipe.transform(value, digitsInfo)
  }

  public static DecimalMask(value: string | number, digits = '1.2-2', locale = 'pt-BR') {
    const decimalPipe: DecimalPipe = new DecimalPipe(locale)
    return decimalPipe.transform(value, digits)
  }

  public static DateMask(value: string | number, format = 'dd/MM/yyyy', locale = 'pt-BR') {
    const datePipe: DatePipe = new DatePipe(locale)
    return datePipe.transform(value, format)
  }

  public static isNullOrEmpty(value: any) {
    if (value === '' || value === null || value === undefined || (Array.isArray(value) && Object.keys(value)?.length === 0))
      return true

    return false
  }

  public static randonId(id?: any) {
    if (id)
      return id
    else
      return '_' + Math.random().toString(36).substring(2, 9)
  }

  public static getRandomColor() {
    var letters = '0123456789ABCDEF'.split('')
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  public static getSum(items: any[], field: string): any {
    if (!items) return []
    if (!field) return items

    return items.reduce((total, item) => { return total + Number(item[field]) }, 0)
  }

  public static variableColorsRGB(index: number, rgb: any[]) {
    let result: any = []
    rgb.forEach(el => {
      if (index > 0) {
        el = parseInt(el > 225 ? 255 : el + 30)
        result.push(el)
      }
    })
    return result.length ? result : rgb
  }

  public static hexToRgb(hex: any, a = 1) {
    hex = hex.replace('#', '')
    var arrBuff = new ArrayBuffer(4)
    var vw = new DataView(arrBuff)
    vw.setUint32(0, parseInt(hex, 16), false)
    var arrByte = new Uint8Array(arrBuff)

    return `rgba(${arrByte[1]}, ${arrByte[2]}, ${arrByte[3]}, ${a}`
  }

  public static rgbToHex(rgb: number[]) {
    const r = this.convertRgbToHex(rgb[0])
    const g = this.convertRgbToHex(rgb[1])
    const b = this.convertRgbToHex(rgb[2])

    return `#${r}${g}${b}`
  }

  private static convertRgbToHex(value: number) {
    let hex = Number(value).toString(16)
    if (hex.length < 2) {
      hex = '0' + hex
    }
    return hex
  }

  public static generateRandom(maxLimit = 100) {
    let rand = Math.random() * maxLimit
    rand = Math.floor(rand)
    return rand
  }

  public static dateDiff(dtStart: any, dtEnd: any) {
    let ss = Math.floor((dtEnd - dtStart) / 1000)
    let mm = Math.floor(ss / 60)
    let hh = Math.floor(mm / 60)
    const dd = Math.floor(hh / 24)

    hh = hh - (dd * 24)
    mm = mm - (dd * 24 * 60) - (hh * 60)
    ss = ss - (dd * 24 * 60 * 60) - (hh * 60 * 60) - (mm * 60)

    return `${dd}d ${hh}h ${mm}m ${ss}s`
  }

  public static stringTodate(value: any) {
    const date = UsefullFunctions.RetirarMascara(value)
    const brFormat = moment(date, 'DDMMYYYY', true)
    const usFormat = moment(date, 'YYYYMMDD', true)

    if (brFormat.isValid())
      return moment(value, 'DD/MM/YYYY').toDate()
    else if (usFormat.isValid())
      return moment(value, 'YYYY-MM-DD').toDate()
    else
      return moment(value).toDate()
  }

  public static base64ToFile(base64Image: string): Blob {
    const split = base64Image.split(',')
    const type = split[0].replace('data:', '').replace(';base64', '')
    const byteString = atob(split[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type })
  }

  public static post_data(controls: any) {
    const data: any = {}
    Object.keys(controls).forEach(name => {
      const field = controls[name]
      if (field?.controls) {
        const form_controls = this.post_data(field.controls)
        if (form_controls) {
          data[name] = form_controls
        }
      } else if (field.value != null || field.value != undefined) {
        data[name] = field.value
      }
    })
    return data
  }

  /**
     * Get a controls dirty from form object
     * @param controls AbstractControl
     */
  public static dirty_controls_data(controls: any) {
    const data: any = {}
    Object.keys(controls).forEach(name => {
      const field = controls[name]
      if (field?.controls) {
        const form_controls = this.dirty_controls_data(field.controls)
        if (form_controls) {
          data[name] = form_controls
        }
      } else if ((field.value != null || field.value != undefined) && field.dirty && !field.disabled) {
        data[name] = field.value
      }
    })
    return data
  }

  public static mark_controls_dirty(controls: any) {
    setTimeout(() => {
      Object.keys(controls).forEach(name => {
        const field = controls[name]
        if (field.valid && field.value) {
          field.markAsDirty()
        }
      })
    }, 300)
  }

  public static mark_controls_pristine(controls: any) {
    setTimeout(() => {
      Object.keys(controls).forEach(name => {
        const field = controls[name]
        if (field.valid && field.value) {
          field.markAsPristine()
        }
      })
    }, 300)
  }

  public static getTextWidth(col: any, font?: string) {
    // re-use canvas object for better performance
    const canvas = document.createElement("canvas")
    const context: any = canvas.getContext("2d")
    context.font = font || this.getCanvasFont()
    const metrics = context.measureText(col)
    const width = Math.round(metrics.width)
    return width + 40
  }


  private static getCanvasFont(el = document.body) {
    const fontWeight = this.getCssStyle(el, 'font-weight') || 'normal'
    const fontSize = this.getCssStyle(el, 'font-size') || '2rem'
    const fontFamily = this.getCssStyle(el, 'font-family') || 'Times New Roman'

    return `${fontWeight} ${fontSize} ${fontFamily}`
  }

  private static getCssStyle(element: any, prop: any) {
    return window.getComputedStyle(element, null).getPropertyValue(prop)
  }

  public static groupBy(xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      var tmp = rv.find((r: any) => r.name == x[key]) || { name: x[key], children: [] }
      tmp.expandido = valueOrDefault(tmp?.expandido, false)
      if (tmp.children.length == 0) {
        rv.push(tmp)
      }
      tmp.children.push(x)
      return rv
    }, [])
  }


  public static arrayToObject(list: any[]) { // list to enum or list to json
    let obj: any = {}
    list.reduce((value, key) => {
      obj[key.label] = key.value
    }, {})
    return obj
  }

  public static objectToArray(obj: any) { // enum to list or json to list
    return Object.keys(obj).map(key => {
      return { label: key, value: (obj as any)[key] }
    })
  }

  public static cloneWithoutReference(object: any) {
    return _.cloneDeep(object)
  }

  public static extractEmail(text: string) {
    let list = text?.split(",")
    let result: any = []
    list?.map((email: any) => {
      result.push(email && email.match(/<(.+)>/) ? email.match(/<(.+)>/)[1] : email)
    })
    return result?.join()
  }

  public static compararObjetos(obj1: any, obj2: any) {
    const changedProperties: any = {};

    for (const key in obj1) {
      if (key != 'edit' && key != 'select' && obj1.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
        changedProperties[key] = obj2[key];
      }
    }

    for (const key in obj2) {
      if (key != 'edit' && key != 'select' && obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
        changedProperties[key] = obj2[key];
      }
    }

    return changedProperties;
  }
}


export const convertToSlug = (text: string) => {
  const a = 'àáäâãèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:; '
  const b = 'aaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------ '
  const p = new RegExp(a.split('').join('|'), 'g')
  return text.toString().toLowerCase().trim()
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special chars
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\s]/gi, '') // Replace spaces, non-word characters and dashes with a single dash (-)
    .replace(/\s+/g, ' ')
}

export const valueOrDefault = (value: any, value_default: any) => {
  if (value == null || value == undefined || value?.toString() == 'NaN')
    return value_default
  else
    return value
}

export const changePrefix = (value: any, prefix: any) => {
  return value ? value.replace(prefix, '') : null
}

export const b3NextEquityFutures = (act_date: any, nr_futures: number = 2) => {
  const b3_month_codes = [
    { "month": 1, "code": "G" },
    { "month": 3, "code": "J" },
    { "month": 5, "code": "M" },
    { "month": 7, "code": "Q" },
    { "month": 9, "code": "V" },
    { "month": 11, "code": "Z" },
  ]
  const act_month = act_date?.month()
  const act_year = act_date?.format('YY')

  const equity_future_ticker_full_base = "ind"
  const equity_future_ticker_mini_base = "win"

  let next_futures = []

  b3_month_codes.filter(x => x.month >= act_month)?.forEach(item => {
    if (next_futures.length / 2 < nr_futures) {
      const next_full_future = equity_future_ticker_full_base + item.code.toLowerCase() + act_year
      next_futures.push(next_full_future)
      const next_mini_future = equity_future_ticker_mini_base + item.code.toLowerCase() + act_year
      next_futures.push(next_mini_future)
    }
  })

  if (act_month == 11) {
    next_futures.push(equity_future_ticker_full_base + "g" + act_date.add(1, 'Y').format('YY'))
    next_futures.push(equity_future_ticker_mini_base + "g" + act_date.add(1, 'Y').format('YY'))
  }
  return next_futures
}

export const b3NextUsdFutures = (act_date: any, nr_futures: number = 2) => {
  const b3_month_codes = [
    { "month": 0, "code": "F" },
    { "month": 1, "code": "G" },
    { "month": 2, "code": "H" },
    { "month": 3, "code": "J" },
    { "month": 4, "code": "K" },
    { "month": 5, "code": "M" },
    { "month": 6, "code": "N" },
    { "month": 7, "code": "Q" },
    { "month": 8, "code": "U" },
    { "month": 9, "code": "V" },
    { "month": 10, "code": "X" },
    { "month": 11, "code": "Z" },
  ]
  const act_month = act_date.month()
  const act_year = act_date.format('YY')

  const usd_future_ticker_full_base = "dol"
  const usd_future_ticker_mini_base = "wdo"

  let next_futures = []

  b3_month_codes.filter(x => x.month >= act_month)?.forEach(item => {
    if (next_futures.length / 2 < nr_futures) {
      const next_full_future = usd_future_ticker_full_base + item.code + act_year
      next_futures.push(next_full_future)
      const next_mini_future = usd_future_ticker_mini_base + item.code + act_year
      next_futures.push(next_mini_future)
    }
  })

  if (act_month == 11) {
    next_futures.push(usd_future_ticker_full_base + "F" + act_date.add(1, 'Y').format('YY'))
    next_futures.push(usd_future_ticker_mini_base + "F" + act_date.add(1, 'Y').format('YY'))
  }
  return next_futures
}

export const excludePages = ['manager_dashboard_tabs']

export const getValueByPath = (obj: any, path: string) => {
  const result = path?.replace(/\[(\d+)\]/g, '.$1')?.split('.')?.reduce((acc, part) => acc?.[part], obj)
  return result
}

export const setValueByPath = (obj: any, path: string, value: any) => {
  const parts = path?.replace(/\[(\d+)\]/g, '.$1')?.split('.')
  const last = parts?.pop()!
  const target = parts?.reduce((acc, part) => acc?.[part], obj)
  if (target && last) {
    target[last] = value
  }
}
