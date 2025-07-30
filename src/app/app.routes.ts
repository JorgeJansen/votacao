import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjetosComponent } from './pages/projetos/projetos.component';
import { VereadoresComponent } from './pages/vereadores/vereadores.component';
import { VotacaoComponent } from './pages/votacao/votacao.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'home/:projeto', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'votacao/:projeto/:vereador', canActivate: [AuthGuard], component: VotacaoComponent },
  { path: 'vereadores', canActivate: [AdminGuard], component: VereadoresComponent },
  { path: 'projetos', canActivate: [AdminGuard], component: ProjetosComponent },
  { path: '**', component: ErrorComponent }
];
