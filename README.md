Native-Js-Crud-Order
====================

This is the javascript application that will use the service WebAPI located at http://webapigl.azurewebsites.net/api/values .

This service provides access to a database with the orders. Each order is represented by the following data structure -
Public class Order
{
  Public int Id {get; set; }
  Public string Product {get; set; }
  Public string Customer {get; set; }
  Public int Quantity {get; set; }
}
