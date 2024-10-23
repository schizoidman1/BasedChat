import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module'; // Certifique-se de que este está importado
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule

// Importar os componentes criados
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatComponent,
    FriendsListComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Adicionar FormsModule
    HttpClientModule // Adicionar HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
