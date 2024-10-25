import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  avatarPreview: string | ArrayBuffer | null = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // Formulário para editar perfil
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.maxLength(150)]],
      status: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
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
  
}
