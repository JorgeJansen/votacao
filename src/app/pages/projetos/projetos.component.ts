import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CrudProjetoService } from './../../services/crud-projeto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  imports: [
    CommonModule,
    RouterLink,
  ]
})
export class ProjetosComponent implements OnInit {

  dataTable?: any[] | null = []

  constructor(
    private crd: ChangeDetectorRef,
    private vereadorService: CrudProjetoService
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
    this.crd.detectChanges()
  }

  reload() {
    window.location.reload()
  }
}
