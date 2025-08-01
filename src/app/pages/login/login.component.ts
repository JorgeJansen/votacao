// import { CommonService } from 'src/app/shared/services/common.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsefullFunctions } from '../../commons/usefullFunctions';
import { InvalidFeedbackComponent } from '../../components/invalid-feedback/invalid-feedback.component';
import { CrudTokenService } from '../../services/crud-token.service';
import { DialogService } from '../../services/dialog.service';
import { StorageService as storage } from '../../services/storage.service';
// import { UsefullFunctions, valueOrDefault } from '../shared/commons/usefullFunctions';
// import { UserTypeEnum } from '../shared/enums/user-type.enum';
// import { CrudManagerService } from '../shared/services/crud-manager.service';
// import { CrudPartnerService } from '../shared/services/crud-partner.service';
// import { ThemeService } from '../shared/services/theme.service';
// import { TokenService } from '../shared/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    InvalidFeedbackComponent,
    ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit {

  formLogin!: FormGroup;
  formSecondFactor!: FormGroup;
  typeInput = 'password';
  iconPassword = 'visibility';
  userTypes: any
  requiresSecondFactor = false
  showPassword = false
  partner_info: any

  constructor(
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenService: CrudTokenService
  ) {
    storage.clear()
  }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(UsefullFunctions.EmailPattern())]],
      password: ['', Validators.required]
    })

    this.formSecondFactor = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  async login() {
    if (this.formLogin.valid) {
      const form = this.formLogin.getRawValue()
      delete form.type
      try {
        await this.tokenService.authenticate(form)
        this.tokenService.isAuthenticate()
        this.router.navigate(['/home'])
      } catch (_err) {
        const data = { title: 'Login not authorized', message: 'Please check email and password for the chosen user type' }
        this.dialogService.open(data)
      }
    } else {
      this.formLogin.markAllAsTouched()
    }
  }

  get f() {
    return this.formLogin.controls
  }
  get s() { return this.formSecondFactor.controls }

}
