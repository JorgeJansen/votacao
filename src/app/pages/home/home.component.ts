import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import moment from 'moment';
import { TimerComponent } from '../../components/timer/timer.component';
import { CrudProjetoService } from '../../services/crud-projeto.service';
import { CrudVereadorService } from '../../services/crud-vereador.service';
import { CrudVotacaoService } from '../../services/crud-votacao.service';
import { StorageService as storage } from '../../services/storage.service';
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
    TimerComponent
  ]
})
export class HomeComponent implements OnInit {

  today = moment().toDate()
  elements: any = signal({
    presentes: 0,
    ausentes: 0,
    votosSim: 0,
    votosNao: 0,
    totalVotos: 0,
    codProjeto: null
  })
  projeto: any = signal({})
  vereadores: any = signal([])
  vereador: any = signal({})

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
        if (params['projeto'])
          this.elements().codProjeto = params['projeto']
      })
      this.carregarDados()
    } catch (error) {
      // this.reload()
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges() // força renderização após o Angular terminar o ciclo
  }

  async carregarDados() {
    await this.getProjetoById()
    await this.getListVereadores()
  }

  async getProjetoById() {
    if (this.elements().codProjeto) {
      const $res = await this.projetoService.getById(this.elements().codProjeto)
      this.projeto.set($res)
    } else {
      const $res = await this.projetoService.getAll()
      this.projeto.set($res.find(x => x.dtaVotacao > moment().unix()))
    }
  }

  async getListVereadores() {
    const $res = await this.vereadorService.getAll()
    this.vereadores.set($res)
    await this.verificarVotos()
  }

  async verificarVotos() {
    let presentes = 0
    let ausentes = 0
    let votosSim = 0
    let votosNao = 0
    let totalVotos = 0

    for (let item of this.vereadores()) {
      if (item.codVereador === storage.get('user'))
        this.vereador.set(item)

      const filter = { codProjeto: this.projeto().codProjeto, codVereador: item.codVereador }
      const $res = await this.votacaoService.getAll(filter)
      item.votacao = $res?.find(x => x)

      if (item.votacao?.presente) {
        presentes++
        if (item.votacao.voto === 'S')
          votosSim++
        else if (item.votacao.voto === 'N')
          votosNao++
      } else {
        ausentes++
      }
    }
    totalVotos = votosSim + votosNao
    this.elements.set({
      presentes: presentes,
      ausentes: ausentes,
      votosSim: votosSim,
      votosNao: votosNao,
      totalVotos: totalVotos,
      codProjeto: null
    })
  }

  reload() {
    window.location.reload()
  }
}
