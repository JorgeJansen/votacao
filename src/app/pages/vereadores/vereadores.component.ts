import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UploadDialogComponent } from '../../components/dialogs/upload-dialog/upload-dialog.component';
import { CrudImageService } from '../../services/crud-image.service';
import { CrudVereadorService } from '../../services/crud-vereador.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-vereadores',
  templateUrl: './vereadores.component.html',
  imports: [
    RouterLink,
  ]
})
export class VereadoresComponent implements OnInit {

  dataTable?: any[] | null = []

  constructor(
    private cdr: ChangeDetectorRef,
    private imageService: CrudImageService,
    private dialogService: DialogService,
    private vereadorService: CrudVereadorService
  ) { }

  ngOnInit() {
    try {
      this.getData()
    } catch (error) {
      this.reload()
    }
  }

  async getData() {
    this.dataTable = await this.vereadorService.getAll()
    for (let item of this.dataTable) {
      if (item.foto?.id) {
        item.foto = await this.imageService.getById(item.foto.id)
      }
    }
    this.cdr.detectChanges()
  }

  uploadDialog(item: any) {
    this.dialogService.open({
      title: 'Upload',
      message: 'Selecione a imagem',
    }, UploadDialogComponent).then(async (file) => {
      item.foto.id = file.id
      await this.vereadorService.update(item.id, item)
      this.getData()
    }).catch(() => {
      console.log('Usuário cancelou ou fechou')
    })
  }

  reload() {
    window.location.reload()
  }
}
