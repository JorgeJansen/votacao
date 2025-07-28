import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import moment from 'moment';
import { CrudProjetoService } from '../../services/crud-projeto.service';
import { CrudVereadorService } from '../../services/crud-vereador.service';
import { CrudVotacaoService } from './../../services/crud-votacao.service';

@Component({
  selector: 'app-votacao',
  templateUrl: './votacao.component.html',
  imports: [
    DatePipe,
    RouterLink
  ]
})
export class VotacaoComponent implements OnInit {

  today = moment().toDate()
  projetoId: any
  vereadorId: any
  vereador: any = {}
  projeto: any = {}
  votacao: any = {}

  constructor(
    private projetoService: CrudProjetoService,
    private route: ActivatedRoute,
    private router: Router,
    private vereadorService: CrudVereadorService,
    private votacaoService: CrudVotacaoService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projetoId = params['projeto']
      this.vereadorId = params['vereador']
      this.getDataById()
    })
  }

  async getDataById() {
    this.projeto = await this.projetoService.getById(this.projetoId)
    this.vereador = await this.vereadorService.getById(this.vereadorId)

    const filter = { num_projeto: this.projeto.num_projeto, cod_vereador: this.vereador.id }
    const $vot = await this.votacaoService.getAll(filter)
    this.votacao = $vot?.find(x => x)
  }

  async computarVoto(voto: string) {
    const body = {
      cod_vereador: this.vereadorId,
      num_projeto: this.projeto.num_projeto,
      presente: true,
      voto: voto
    }
    await this.votacaoService.save(body);
    this.router.navigate(['/Home/', this.projetoId])
  }
}
