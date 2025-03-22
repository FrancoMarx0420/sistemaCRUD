import { Component, EventEmitter, inject, input, Input } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

  async ngOnInit() {
    try {
      this.myUser = await this.userServices.getById(this._id);
    } catch (error) {}
  }
  deleteUser(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      //hacer bien esto
      let response = await this.userServices.delete(id);

      if (result.isConfirmed && response) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'Something is wrong!',
          text: "Your file hasn't been deleted.",
          icon: 'warning',
        });
      }
    });
  }
}
