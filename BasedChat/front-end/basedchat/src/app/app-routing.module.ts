import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// Opcional: importar o AuthGuard se desejar proteger rotas
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: ChatComponent, canActivate: [AuthGuard] }, // Protegendo a rota do chat
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Adicione outras rotas conforme necessário
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
