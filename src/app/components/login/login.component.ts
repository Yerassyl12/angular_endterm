import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthState } from '../../items/states/auth.state';
import { TranslatePipe } from '../../services/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage = '';
  loading = false;
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authState: AuthState,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onSubmit(): Promise<void> {
    if (this.loading) return; // защита от двойного клика

    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control =>
        control.markAsTouched()
      );
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    try {
      await this.authState.login(email, password);
      this.router.navigate([this.returnUrl]);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
      console.error('[Login] Login failed:', error);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password';

      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';

      case 'auth/user-disabled':
        return 'This account has been disabled';

      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}
