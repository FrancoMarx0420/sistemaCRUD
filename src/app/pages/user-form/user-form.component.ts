import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { IUser } from '../../interfaces/iuser.interface';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  @Input() _id: string = '';
  userForm: FormGroup = new FormGroup({}, []);
  myUser!: IUser;
  userService = inject(UserService);
  title: string = 'Registrar';
  message: string = 'Agregado';
  router = inject(Router);

  urlValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value;
    if (!url) return null;
    const basicUrlRegex = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+.*$/i;
    return basicUrlRegex.test(url) ? null : { simpleUrl: true };
  }

  async ngOnInit() {
    this.userForm = new FormGroup(
      {
        _id: new FormControl(this._id || undefined, []),
        first_name: new FormControl(this.myUser?.first_name || '', [
          Validators.required,
        ]),
        last_name: new FormControl(this.myUser?.last_name || '', [
          Validators.required,
        ]),
        username: new FormControl(this.myUser?.username || '', [
          Validators.required,
        ]),
        email: new FormControl(this.myUser?.email || '', [
          Validators.required,
          Validators.email,
        ]),
        image: new FormControl(this.myUser?.image || '', [
          Validators.required,
          this.urlValidator,
        ]),
      },
      []
    );
    if (this._id) {
      try {
        this.myUser = await this.userService.getById(this._id);

        if ('_id' in this.myUser) {
          this.title = 'Actualizar';
          this.message = 'Actualizado';
          this.userForm.patchValue({
            _id: this.myUser._id,
            first_name: this.myUser.first_name,
            last_name: this.myUser.last_name,
            username: this.myUser.username,
            email: this.myUser.email,
            image: this.myUser.image,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: (this.myUser as any).error,
            confirmButtonText: 'aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/home']);
            }
          });
        }
      } catch (msg: any) {
        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: msg.error,
        });
      }
    }
  }
  async getDataForm() {
    if (this.userForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, llena todos los campos obligatorios correctamente.',
        confirmButtonText: 'Entendido',
      });
      return;
    }
    let response: IUser | any;
    try {
      if (this.userForm.value._id) {
        response = await this.userService.update(this.userForm.value);
        console.log(response);
      } else {
        response = await this.userService.insert(this.userForm.value);
        response._id = response._id || response.id;
        response.id = Math.floor(Math.random() * 100) + 1; //esto se hace porque al solicitar post postea el id en lugar de _id
      }
      if (response._id) {
        Swal.fire({
          title: `El usuario ${this.myUser.first_name} ha sido ${this.message}`,
          confirmButtonText: 'aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('redirigiendo', '', 'success');
            console.log(response);
            this.router.navigate(['/home']);
          }
        });
      } else {
        Swal.fire({
          title: `Algo salio mal`,
          confirmButtonText: 'aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Intenta de nuevo', '', 'success');
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: (error as any).message || 'No se pudo completar la operación.',
      });
    }
  }
}
