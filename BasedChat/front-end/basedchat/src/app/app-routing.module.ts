import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

// Opcional: importar o AuthGuard se desejar proteger rotas
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: '',
    component: MainLayoutComponent, // Novo componente pai para gerenciar amigos e chat
    canActivate: [AuthGuard], // Guard para proteger esta rota apenas para usuários autenticados
  },
  { path: '**', redirectTo: '' }, // Redireciona qualquer rota inválida para a principal
  // Adicione outras rotas conforme necessário
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
