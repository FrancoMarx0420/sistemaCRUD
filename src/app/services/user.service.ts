import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IResponse } from '../interfaces/iresponse.interface';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private endPoint: string = 'https://peticiones.online/api/users';

  getAllPromise(url: string): Promise<IResponse> {
    url = url === '' ? 'https://peticiones.online/api/users?total=8' : url;
    return lastValueFrom(this.httpClient.get<IResponse>(url));
  }
  getById(_id: string): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.endPoint}/${_id}`));
  }
  delete(_id: string): Promise<IUser> {
    return lastValueFrom(
      this.httpClient.delete<IUser>(`${this.endPoint}/${_id}`)
    );
  }
}
