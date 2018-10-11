//Parent Model
export class Customer {
_id:String;
customerID:String;
customerName:String;
contract:[]
}

//Child Model
export class Contract{
    customerID: String;
    startDate: Date;
    endDate:  Date ;
    conditions: String;
    price: Number;
    author: String; 
}