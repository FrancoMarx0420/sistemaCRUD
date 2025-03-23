import { Component, inject, Inject, Input, input } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  @Input() myUser!: IUser;
  @Input() _id: string = '';
  userServices = inject(UserService);

  deleteUser(id: string) {
    Swal.fire({
      title: `Estas seguro que quieres borrar al usuario ${this.myUser.first_name}?`,
      text: 'No podras revertirlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      //hacer bien esto
      let response = await this.userServices.delete(id);

      if (result.isConfirmed && (response as any)._id) {
        Swal.fire({
          title: 'Usuario Borrado!',
          text: `se ha borrado al usuario ${this.myUser.first_name}`,
          icon: 'success',
        });
      } else if (result.isDenied) {
      } else {
        Swal.fire({
          title: 'Algo salio mal!',
          text: `Usuario no borrado`,
          icon: 'warning',
        });
      }
    });
  }
}
