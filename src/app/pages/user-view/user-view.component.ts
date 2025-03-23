import { Component, EventEmitter, inject, input, Input } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-view',
  imports: [RouterLink],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent {
  @Input() _id: string = '';
  myUser!: IUser;
  userServices = inject(UserService);
  router = inject(Router);

  async ngOnInit() {
    try {
      this.myUser = await this.userServices.getById(this._id);
      if (!('_id' in this.myUser)) {
        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: (this.myUser as any).error,
          confirmButtonText: 'aceptar',
        });
        this.router.navigate(['/home']);
      }
    } catch (msg: any) {
      Swal.fire({
        icon: 'error',
        title: 'Ups...',
        text: msg.error,
        confirmButtonText: 'aceptar',
      });
    }
  }
  deleteUser(id: string) {
    Swal.fire({
      title: `Estas seguro que quieres borrar al usuario ${this.myUser?.first_name}?`,
      text: 'No podras revertir los cambios!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar!',
    }).then(async (result) => {
      let response = await this.userServices.delete(id);

      if (result.isConfirmed && (response as any)._id) {
        Swal.fire({
          title: 'Usuario Borrado!',
          text: `Se ha borrado al usuario ${this.myUser?.first_name}`,
          icon: 'success',
        });
        this.router.navigate(['/home']);
      } else if (Swal.DismissReason.cancel) {
      } else {
        Swal.fire({
          title: 'Algo salio mal!',
          text: 'Usuario no borrado',
          icon: 'warning',
        });
      }
    });
  }
  vistaPrevia() {
    console.log('qp');
    Swal.fire({
      imageUrl: this.myUser.image,
      imageAlt: 'A tall image',
      confirmButtonText: 'Cerrar',
    });
  }
}
