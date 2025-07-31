import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CrudImageService } from '../../../services/crud-image.service';
import { valueOrDefault } from '../../../commons/usefullFunctions';
import { MODAL_DATA } from '../modal.token';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html'
})
export class UploadDialogComponent implements OnInit {

  file: any = {}
  validate: string = ''
  maxSize = 0
  accept = ['image/png', 'image/jpeg']

  constructor(
    @Inject(MODAL_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private imageService: CrudImageService,
    private overlayRef: OverlayRef
  ) { }

  ngOnInit(): void {
    if (this.data?.accept) {
      this.accept = this.data.accept
    }

    this.maxSize = valueOrDefault(this.data?.size, 5) * 1024000
  }

  onFileSelected(event: Event) {
    this.validate = ''
    this.file = (event.target as HTMLInputElement)?.files?.[0]

    if (this.file.size < this.maxSize && this.accept?.includes(this.file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.file.base64 = reader.result as string
      };
      reader.readAsDataURL(this.file)
    } else {
      this.validate = `Apenas arquivos PNG, JPG e JPEG. Tamanho máximo ${valueOrDefault(this.data?.size, 5)}MB.`
    }
    this.cdr.detectChanges()
  }

  async uploadImage() {
    if (this.file?.base64) {
      const imagePayload = {
        name: this.file.name,
        data: this.file.base64
      }

      const $res = await this.imageService.save(imagePayload)
      this.file.id = $res.id
      this.confirm()
    }
  }

  close() {
    this.data.reject?.() // garante rejeição se fechar
    this.overlayRef.dispose()
  }

  confirm() {
    this.data.resolve?.(this.file)
    this.overlayRef.dispose()
  }
}
