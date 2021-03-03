import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from './../employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  display = 'none';
  deletePopup = 'none';
  editDisplay = 'none';
  model: any = {};
  editedId = 0;
  copiedDataModel: any = {};
  idExists = false;
  isCreate = true;
  deletedId = 0;
  goToPageNumber = 1;
  displayedColumns = [
    'id',
    'firstName',
    'lastName',
    'gender',
    'grade',
    'odc',
    'bu',
    'project',
    'actions',
  ];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  registerForm: FormGroup;
  submitted = false;
  dataLoaded: boolean;
  constructor(
    public employeeService: EmployeeService,private ndxSpinner: NgxSpinnerService,
    private formBuilder: FormBuilder,private cdr: ChangeDetectorRef
  ) {
    this.getEmployeeData();
  }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      id: [0, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      grade: ['', [Validators.required, Validators.pattern('[0-9. ]*')]],
      odc: [''],
      bu: [''],
      project: [''],
      status: [1],
    });
  }
  deleteRecord(i) {
    this.deletedId = i;
    this.deletePopup = 'block';
  }

  goPageNumber(gotoNumber) {
    this.paginator.pageIndex = gotoNumber;

    this.paginator.page.next({
      pageIndex: gotoNumber,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
    });
  }
  closeDeletePupup() {
    this.deletePopup = 'none';
  }

  changeInputId(id: number) {
    this.idExists = false;
    this.employeeService.employeeData.forEach((data) => {
      if (data.id === id) {
        this.idExists = true;
      }
    });
  }

  editData(data, i) {
    this.editedId = i;
    this.editDisplay = 'block';
    this.registerForm.controls['firstName'].setValue(data.firstName);
    this.registerForm.controls['lastName'].setValue(data.lastName);
    this.registerForm.controls['id'].setValue(data.id);
    this.registerForm.controls['gender'].setValue(data.gender);
    this.registerForm.controls['grade'].setValue(data.grade);
    this.registerForm.controls['odc'].setValue(data.odc);
    this.registerForm.controls['bu'].setValue(data.bu);
    this.registerForm.controls['project'].setValue(data.project);
  }

  deleteRecored() {
    if (this.deletedId !== -1) {
      this.ndxSpinner.show();
      this.employeeService.employeeData[this.deletedId].status = 0;
      this.employeeService.deleteEmployee(this.employeeService.employeeData[this.deletedId].id).subscribe(data => {
        console.log(data);
        this.ndxSpinner.hide();
        this.getEmployeeData();
      },()=> {
        this.ndxSpinner.hide();
      })
    }
    this.deletePopup = 'none';
  }

  clickEventHandler(data) {
    this.copiedDataModel = {};
    this.employeeService.editedData = data;
    this.copiedDataModel = this.employeeService.editedData;
    this.isCreate = false;
    this.openModal(this.isCreate);
  }
  openModal(create: boolean) {
    this.isCreate = create;
    if (create) {
      this.model = {};
      this.model.gender = 'Male';
    }
    this.display = 'block';
  }
  onCloseHandled() {
    this.display = 'none';
    this.editDisplay = 'none';
  }
  get ffff() {
    return this.registerForm.controls;
  }
  getEmployeeData() {
    this.ndxSpinner.show();
    this.dataLoaded = false;
    this.employeeService.getEmployeeData().then((data) => {
      if(data){
        this.ndxSpinner.hide();
        this.dataLoaded = true;
        this.employeeService.employeeData = data;
        this.dataSource = new MatTableDataSource(this.employeeService.employeeData);
        if(this.dataSource) {
          this.cdr.detectChanges();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    }, ()=> {
      this.ndxSpinner.hide();
    });
  }

  active(row, i) {
    if (row && row.status === 1) {
      this.employeeService.employeeData[i].status = 0;
    } else if (row && row.status === 0) {
      this.employeeService.employeeData[i].status = 1;
    }
    this.getEmployeeData();
  }

  onSubmitEdit(form: any, editForm) {
    if (editForm.status === 'VALID') {
      this.ndxSpinner.show();
      this.employeeService.updateeEmployee(editForm.value.id, editForm.value).subscribe( data => {
        if(data) {
          this.ndxSpinner.hide();
          this.getEmployeeData();
        }
      }, ()=> {
        this.ndxSpinner.hide();
      })
    }
    this.onCloseHandled();
  }
  onSubmit(model: any, f: NgForm) {
    const dat = model;
    dat.status = 1;
    let created = true;
    this.createOrUpdate(dat);
    this.onCloseHandled();
    if (f.valid && f.submitted && created) {
      f.reset();
    }
  }

  createOrUpdate(employee: any) {
    this.ndxSpinner.show();
  this.employeeService.createOrUpdateEmployee(employee).subscribe(data => {
    if(data) {
      this.ndxSpinner.hide();
      this.getEmployeeData();
      console.log(data);
    }
  }, (error)=> {
    this.ndxSpinner.hide();
    alert(error);
  })
}

}
export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  grade: number;
  odc: string;
  bu: string;
  project: string;
  status: number;
}
