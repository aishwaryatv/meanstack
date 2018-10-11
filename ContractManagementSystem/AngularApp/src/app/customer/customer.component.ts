//Package imports
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//local imports
import { CustomerService } from '../shared/customer.service';
import { Contract, Customer } from '../shared/customer.model';

declare var M: any;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [CustomerService]
})
export class CustomerComponent implements OnInit {

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.resetForm();
    this.refreshCustomerList();
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();

      this.customerService.selectedContract = {
        customerID: "",
        startDate: null,
        endDate: null,
        conditions: "",
        price: null,
        author: ""
      }
      this.customerService.selectedCustomer = {
        customerID: "",
        customerName: "",
        contract: [this.customerService.selectedContract]
      }
    }
  }

  //Function for onSubmit event
  onSubmit(form: NgForm) {

    this.customerService.selectedContract = {
      customerID: form.value.customerID,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      conditions: form.value.conditions,
      price: form.value.price,
      author: form.value.author
    }
    this.customerService.selectedCustomer = {
      customerID: form.value.customerID,
      customerName: form.value.customerName,
      contract: [this.customerService.selectedContract]
    }

    //Onsubmit path to invoke HTTP POST
    if (form.value._id != "edit") {
      this.customerService.postCustomer(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshCustomerList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    } //Onsubmit path to invoke HTTP PUT
    else {
      this.customerService.putCustomer(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshCustomerList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  //Function to populate the responsive table with latest customer details
  refreshCustomerList() {
    this.customerService.getCustomerList().subscribe((res) => {

      this.customerService.customers = res as Customer[];
    });
  }

  //Function for onEdit event
  onEdit(cust: Customer) {
    //This flag differenciates the path of execution when onSubmit event is invoked
    cust._id = 'edit';
    this.customerService.selectedCustomer = cust;
  }

  //Function to invoke Http DELETE on an onDelete event
  onDelete(cid: string, form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.customerService.deleteCustomer(cid).subscribe((res) => {
        this.refreshCustomerList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }

}
