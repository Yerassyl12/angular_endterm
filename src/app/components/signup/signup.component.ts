import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthState } from '../../items/states/auth.state';
import { TranslatePipe } from '../../services/translate.pipe';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authState: AuthState,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]],
      repeatPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get repeatPassword() {
    return this.signupForm.get('repeatPassword');
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasMinLength = value.length >= 8;
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasMinLength && hasNumber && hasSpecial;

    return valid ? null : { passwordStrength: true };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const repeatPassword = control.get('repeatPassword');

    if (!password || !repeatPassword) {
      return null;
    }

    return password.value === repeatPassword.value ? null : { passwordMismatch: true };
  }

  async onSubmit(): Promise<void> {
    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authState.signup(
        this.signupForm.value.email,
        this.signupForm.value.password
      );
      this.router.navigate(['/profile']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
      this.loading = false;
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak';
      default:
        return 'An error occurred. Please try again';
    }
  }
}
