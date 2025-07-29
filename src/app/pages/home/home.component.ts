import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import moment from 'moment';
import { CrudProjetoService } from '../../services/crud-projeto.service';
import { CrudVereadorService } from '../../services/crud-vereador.service';
import { CrudVotacaoService } from '../../services/crud-votacao.service';
import { PadLeftPipe } from './../../pipes/padLeft.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    PadLeftPipe,
    RouterLink,
    RouterModule,
  ]
})
export class HomeComponent implements OnInit {

  today = moment().toDate()
  presentes: number = 0
  ausentes: number = 0
  votosSim: number = 0
  votosNao: number = 0
  totalVotos: number = 0
  projetoId: any = null
  projeto: any = {}
  vereadores: any = []
  isLoad = false

  constructor(
    private cdr: ChangeDetectorRef,
    private projetoService: CrudProjetoService,
    private route: ActivatedRoute,
    private vereadorService: CrudVereadorService,
    private votacaoService: CrudVotacaoService,
  ) { }

  async ngOnInit() {
    try {
      this.route.params.subscribe(params => {
        this.projetoId = params['projeto']
        this.carregarDados()
      })
    } catch (error) {
      this.reload()
    }
  }

  async carregarDados() {
    await this.getProjetoById()
    await this.getListVereadores()
  }

  async getProjetoById() {
    if (this.projetoId) {
      this.projeto = await this.projetoService.getById(this.projetoId)
    }
  }

  async getListVereadores() {
    this.isLoad = false
    this.vereadores = await this.vereadorService.getAll()
    await this.verificarVotos()
  }

  async verificarVotos() {
    this.presentes = 0
    this.ausentes = 0
    this.votosSim = 0
    this.votosNao = 0
    this.totalVotos = 0

    for (let vereador of this.vereadores) {
      const filter = { numProjeto: this.projeto.numProjeto, codVereador: vereador.id }
      const $res = await this.votacaoService.getAll(filter)
      vereador.votacao = $res?.find(x => x)

      if (vereador.votacao?.presente) {
        this.presentes++
        if (vereador.votacao.voto === 'S')
          this.votosSim++
        else if (vereador.votacao.voto === 'N')
          this.votosNao++
      } else {
        this.ausentes++
      }
    }
    setTimeout(() => {
      this.cdr.detectChanges()      
    }, 100);

    this.totalVotos = this.votosSim + this.votosNao
  }

  reload() {
    window.location.reload()
  }
}
