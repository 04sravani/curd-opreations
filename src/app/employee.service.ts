import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export const httpHeaders = new HttpHeaders({
  'Content-Type': 'application/json'
})
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  editedData: any = [];
  isLoggedIn = false;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  employeeData: any = [];
  domainUrl = 'http://localhost:3000/';

  constructor(private httpClient: HttpClient) {

  }

  getEmployeeData() {
    return new Promise((resolve) => {
      this.httpClient.get(this.domainUrl + 'employees').subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  createOrUpdateEmployee(student: object): Observable<object> {
    return this.httpClient.post(`${this.domainUrl}`+'employees', student);
  }
  updateeEmployee(id: number, value: object): Observable<Object> {
    return this.httpClient.put(`${'http://localhost:3000/employees'}/${id}`, value);
  }

  deleteEmployee(id: number): Observable<any> {
  return this.httpClient.delete(`${'http://localhost:3000/employees'}/${id}`);
}

  // deleteEmployee(id: number) {
  //   return new Promise((resolve, reject) => {
  //     this.httpClient
  //       .delete(this.domainUrl + '/employees/'+id)
  //       .subscribe(
  //         (res) => {
  //           resolve(res);
  //         },
  //         (err) => {
  //           reject(err);
  //         }
  //       );
  //   });
  // }

}
