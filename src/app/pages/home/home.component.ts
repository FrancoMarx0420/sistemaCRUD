import { Component, inject } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { UserService } from '../../services/user.service';
import { IResponse } from '../../interfaces/iresponse.interface';
import { UserCardComponent } from '../../components/user-card/user-card.component';

@Component({
  selector: 'app-home',
  imports: [UserCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  arrUsersPromises: IUser[] = [];
  userService = inject(UserService);
  totalPages!: number;
  currentPage!: number;
  ngOnInit() {
    this.loadUsers();
  }
  async loadUsers(url: string = '') {
    try {
      let response: IResponse = await this.userService.getAllPromise(url);
      this.arrUsersPromises = response.results;
      this.totalPages = response.total_pages;
      this.currentPage = response.page;
    } catch (error) {
      console.log(error);
    }
  }
  gotoNext() {
    if (this.currentPage <= this.totalPages - 1) {
      let nextPage = this.currentPage + 1;
      this.loadUsers(
        `https://peticiones.online/api/users?total=8&page=${nextPage}`
      );
    }
  }
  gotoPrev() {
    if (this.currentPage >= 1) {
      let previousPage = this.currentPage - 1;
      this.loadUsers(
        `https://peticiones.online/api/users?total=8&page=${previousPage}`
      );
    }
  }
}
