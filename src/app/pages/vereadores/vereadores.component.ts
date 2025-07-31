import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UploadDialogComponent } from '../../components/dialogs/upload-dialog/upload-dialog.component';
import { VereadorDialogComponent } from '../../components/dialogs/vereador-dialog/vereador-dialog.component';
import { CrudImageService } from '../../services/crud-image.service';
import { CrudVereadorService } from '../../services/crud-vereador.service';
import { DialogService } from '../../services/dialog.service';
import { ConfirmComponent } from './../../components/dialogs/confirm/confirm.component';

@Component({
  selector: 'app-vereadores',
  templateUrl: './vereadores.component.html',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ]
})
export class VereadoresComponent implements OnInit {

  dataTable?: any = signal([])
  cloneRow: { [s: string]: any } = {}

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
      // this.reload()
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges() // força renderização após o Angular terminar o ciclo
  }

  async getData() {
    const $res = await this.vereadorService.getAll()
    for (let item of $res) {
      if (item.foto) {
        item.image = await this.imageService.getById(item.foto)
      }
    }
    this.dataTable.set($res)
    // this.cdr.detectChanges()
  }

  uploadDialog(item: any) {
    this.dialogService.open({
      title: 'Upload',
      message: 'Selecione a imagem',
    }, UploadDialogComponent).then(async (file) => {
      item.foto = file.id
      await this.vereadorService.update(item.id, item)
      this.getData()
    }).catch(() => {
      console.log('Usuário cancelou ou fechou')
    })
  }

  edit(row: any) {
    delete row.image
    this.cloneRow[row.id as string] = { ...row }
    this.dialogService.open({
      title: 'Editar',
      message: 'Dados do vereador',
      edit: row
    }, VereadorDialogComponent).then(async (item) => {
      if (this.cloneRow[row.indPresidente] !== item.indPresidente) {
        await this.vereadorService.update(row.id, item)
        // Só pode haver um presidente
        const exPresidente = this.dataTable().find((el: any) => el.indPresidente)
        if (exPresidente) {
          exPresidente.indPresidente = false
          await this.vereadorService.update(exPresidente.id, exPresidente)
        }
      } else {
        await this.vereadorService.update(row.id, row)
      }

      await this.getData()
    }).catch(() => {
      console.log('Usuário cancelou ou fechou')
    })
  }

  async excluir(item: any) {
    this.dialogService.open({
      title: 'Excluir',
      message: `Tem certeza que deseja remover os dados do vereador ${item.nomVereador}`,
    }, ConfirmComponent).then(async () => {
      await this.vereadorService.delete(item.id)
      await this.getData()
    }).catch(() => {
      console.log('Usuário cancelou ou fechou')
    })
  }

  novoVereador() {
    this.dialogService.open({
      title: 'Cadastro',
      message: 'Dados do novo vereador',
    }, VereadorDialogComponent).then(async (item) => {
      await this.vereadorService.save(item)
      await this.getData()
    }).catch(() => {
      console.log('Usuário cancelou ou fechou')
    })
  }

  reload() {
    window.location.reload()
  }
}
