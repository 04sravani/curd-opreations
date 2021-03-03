import { EmployeeService } from './../employee.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model:any ={};
  constructor(private router: Router, public employeeService: EmployeeService) {
    this.employeeService.isLoggedIn  =false;
  }

    onSubmit(model) {
      const data =  this.validEmail(model);
      if(data) {
       this.employeeService.isLoggedIn = true;
       this.router.navigate(['employee']);
     }
    }

  ngOnInit(): void {
  }

  validEmail(data) {
    if(data.email !== '' && data.email.includes('persistent')){
      return true;
    }else {
      return false;
    }
  }

}
