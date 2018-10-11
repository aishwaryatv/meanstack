import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/Operatoroperator';


import { Customer,Contract } from './customer.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  selectedContract: Contract|{}={};
  selectedCustomer: Customer|{}={};
   customers: Customer[];
 
   //baseURL of REST APIs hosted on NodeJS server
  readonly baseURL = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) { }

  //Function to retrieve latest customer details on invoking Http GET
  getCustomerList() {
    return this.http.get(this.baseURL);
  }
  
  //Function to add new customer details on invoking Http POST
  postCustomer(cust: Customer) {
    return this.http.post(this.baseURL, this.selectedCustomer);
  }

  //Function to update latest contract details of an existing customer on invoking Http PUT
  putCustomer(cust: Customer) {
    return this.http.put(this.baseURL + `/${cust.customerID}`+'/contracts', this.selectedCustomer);
  }
 
  //Function to delete existing customer details on invoking Http DELETE
  deleteCustomer(customerId: string) {
    return this.http.delete(this.baseURL + `/${customerId}`);
  }

}
