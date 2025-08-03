import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmComponent } from '../../components/dialogs/confirm/confirm.component';
import { ProjetoDialogComponent } from '../../components/dialogs/projeto-dialog/projeto-dialog.component';
import { DialogService } from '../../services/dialog.service';
import { CrudProjetoService } from './../../services/crud-projeto.service';
import moment from 'moment';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  imports: [
    CommonModule,
    RouterLink,
  ]
})
export class ProjetosComponent implements OnInit {

  dataTable: any = signal([])

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private projetoService: CrudProjetoService
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
    const $res = await this.projetoService.getAll()
    $res.map(x => {
      x.dtaVotacao = moment.unix(x.dtaVotacao).toDate()
    })
    this.dataTable.set($res)
  }

  edit(row: any) {
    this.dialogService.open({
      title: 'Editar',
      message: 'Dados do projeto',
      edit: row
    }, ProjetoDialogComponent).then(async (item) => {
      await this.projetoService.update(row.codProjeto, item)
      await this.getData()
    }).catch(() => {
      console.log('Usuário cancelou ou fechou')
    })
  }

  async excluir(item: any) {
    this.dialogService.open({
      title: 'Excluir',
      message: `Tem certeza que deseja remover os dados do projeto ${item.numProjeto}`,
    }, ConfirmComponent).then(async () => {
      await this.projetoService.delete(item.codProjeto)
      await this.getData()
    }).catch(() => {
      console.log('Usuário cancelou ou fechou')
    })
  }

  novoProjeto() {
    this.dialogService.open({
      title: 'Cadastro',
      message: 'Dados do novo projeto',

    }, ProjetoDialogComponent).then(async (item) => {
      await this.projetoService.save(item)
      await this.getData()
    }).catch(() => {
      console.log('Usuário cancelou ou fechou')
    })
  }

  reload() {
    window.location.reload()
  }
}
