Native-Js-Crud-Order
====================

This is the javascript application that will use the service WebAPI located at http://webapigl.azurewebsites.net/api/values .

This service provides access to a database with the orders. Each order is represented by the following data structure:

    Public class Order  {
      
       Public int Id {get; set; }
       
       Public string Product {get; set; }
       
       Public string Customer {get; set; }
       
       Public int Quantity {get; set; }
      
    }

When you receive a GET request http://webapigl.azurewebsites.net/api/values service gives the list of all orders that are in the database as JSON.
When a GET request http://webapigl.azurewebsites.net/api/values/1 service returns the value of the base id = 1.

When you send a POST request with values http://webapigl.azurewebsites.net/api/values Product, Customer, Quantity going to create a new record in the database and return the status code 201.

When you send a PUT http://webapigl.azurewebsites.net/api/values/1 request with the Product, Customer, Quantity is updated an existing record in the database. No values in the database by ID will be returned 404.

When you send a DELETE http://webapigl.azurewebsites.net/api/values/1 request made by deleting the record ID = 1.

Data when sending POST and PUT requests data should be sent as a JSON string.
JSON.stringify ({id: 1, Customer: "a", Quantity: "b", Product: "c"}).
When you send a request, you must add the header content-type: "application / json; charset = utf-8".

This application add, edit, delete, search by id and render record to table.
