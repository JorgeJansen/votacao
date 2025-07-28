import { Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { VotacaoComponent } from './pages/votacao/votacao.component';
import { VereadoresComponent } from './pages/vereadores/vereadores.component';
import { ProjetosComponent } from './pages/projetos/projetos.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'home/:projeto', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'votacao/:projeto/:vereador', canActivate: [AuthGuard], component: VotacaoComponent },
  { path: 'vereadores', canActivate: [AuthGuard], component: VereadoresComponent },
  { path: 'projetos', canActivate: [AuthGuard], component: ProjetosComponent },
  { path: '**', component: ErrorComponent }
];
