import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
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
  vereador: any = signal({})
  projeto: any = signal({})
  votacao: any = signal({})

  constructor(
    private cdr: ChangeDetectorRef,
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

  ngAfterViewInit() {
    this.cdr.detectChanges() // força renderização após o Angular terminar o ciclo
  }

  async getDataById() {
    const $proj = await this.projetoService.getById(this.projetoId)
    this.projeto.set($proj)
    const $ver = await this.vereadorService.getById(this.vereadorId)
    this.vereador.set($ver)

    const filter = { numProjeto: this.projeto().numProjeto, codVereador: this.vereador().id }
    const $vot = await this.votacaoService.getAll(filter)
    this.votacao.set($vot?.find((x: any) => x))
  }

  async computarVoto(voto: string) {
    const body = {
      codVereador: this.vereadorId,
      numProjeto: this.projeto().numProjeto,
      presente: true,
      voto: voto
    }
    await this.votacaoService.save(body);
    this.router.navigate(['/home/', this.projetoId])
  }
}
