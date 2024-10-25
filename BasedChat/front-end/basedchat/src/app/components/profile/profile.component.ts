import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  avatarPreview: string | ArrayBuffer | null = '';
  currentAvatar: SafeUrl | string = 'uploads/default-avatar.png';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    // Formulário para editar perfil
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(200)]], // Atualizado para refletir o novo schema
      status: ['', [Validators.maxLength(100)]], // Atualizado para refletir o novo schema
      phoneNumber: ['', [Validators.pattern(/^\+[1-9]\d{1,14}$/)]], // Validação para formato E.164
      avatar: [''], // Avatar é opcional, portanto não precisamos de validações adicionais
      isOnline: [false], // Campo booleano para indicar se o usuário está online ou não
      lastLogin: [''] // Este campo é apenas para visualização, não é editável pelo usuário
    });

    // Formulário para alterar senha
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Carregar dados do perfil do usuário logado
    this.authService.getUserProfile().subscribe(
      profile => {
        this.profileForm.patchValue(profile);
        if (profile.avatar) {
          this.currentAvatar = this.getSafeUrl(profile.avatar);
        }
      },
      err => {
        console.error('Erro ao carregar perfil', err);
      }
    );
  }

  // Validador personalizado para garantir que a senha e a confirmação de senha são iguais
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Atualizar informações do perfil
  updateProfile(): void {
    if (this.profileForm.invalid) {
      alert('Por favor, preencha todas as informações corretamente.');
      return;
    }

    this.authService.updateProfile(this.profileForm.value).subscribe(
      res => {
        alert('Perfil atualizado com sucesso!');
      },
      err => {
        console.error('Erro ao atualizar perfil', err);
        alert('Erro ao atualizar o perfil: ' + (err.error.message || 'Erro desconhecido'));
      }
    );
  }

  // Manipulador do arquivo de imagem selecionado para avatar
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      // Previsualizar a imagem
      reader.onload = () => {
        this.avatarPreview = reader.result;
        this.currentAvatar = reader.result; // Atualiza a visualização atual
      };
      reader.readAsDataURL(file);
      
      // Fazer upload da imagem para o backend
      this.authService.uploadAvatar(file).subscribe(
        res => {
          alert('Avatar atualizado com sucesso!');
        },
        err => {
          console.error('Erro ao fazer upload do avatar:', err);
          alert('Erro ao fazer upload do avatar.');
        }
      );
    }
  }


  // Alterar senha do usuário
  changePassword(): void {
    if (this.passwordForm.invalid) {
      alert('Por favor, preencha todas as informações corretamente.');
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authService.changePassword(currentPassword, newPassword).subscribe(
      res => {
        alert('Senha alterada com sucesso!');
        this.passwordForm.reset();
      },
      err => {
        console.error('Erro ao alterar senha', err);
        alert('Erro ao alterar senha: ' + (err.error.message || 'Erro desconhecido'));
      }
    );
  }
  
  // Obter URL segura para o avatar
  getAvatar(user: any): SafeUrl {
    return user.avatar ? this.getSafeUrl(user.avatar) : this.getSafeUrl('uploads/default-avatar.png');
  }

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:3000/" + url);
  }
}
