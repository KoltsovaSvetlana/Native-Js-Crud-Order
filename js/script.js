// Cross browser addListener
function addListener(e, event, handler) {

	if (window.addEventListener)
		addListener = function addListener(e, event, handler) {
			e.addEventListener(event, handler, false);
		}
	else if (window.attachEvent)
		addListener = function addListener(e, event, handler) {
			e.addListener = attachEvent("on" + event, handler);
		}
	else
		addListener = function addListener(e, event, handler) {
			e["on" + event] = handler;
		}
	addListener(e, event, handler);
}

addListener(window, "load", ready);

function ready() {

	var xhr = new XMLHttpRequest();

	// DOM elements
	var search = document.querySelector("#search");
	var searchAll = document.querySelector("#searchAll");
    var buttonAdd = document.querySelector("#buttonAdd");
    var buttonOk = document.querySelector("#buttonOk");
    var editBtn;
    var deleteBtn;
	var table = document.querySelector("table");

	//adding Event Handlers
	addListener(search, "click", searchId);
	addListener(searchAll, "click", searchAllId);
    addListener(buttonAdd, "click", updateAdd);
    addListener(buttonOk, "click", addItem);

    updateAdd();

	// search by ID
	function searchId() {
        var id = document.querySelector("#searchId").value;
		getDB("http://webapigl.azurewebsites.net/api/values/" + id);
	}

	// search all elements
	function searchAllId() {
		document.querySelector("#searchId").value = "";
		getDB("http://webapigl.azurewebsites.net/api/values");
	}

    // edit item in DB
    function editItem() {
        console.log("editItem");
        editBtn = document.querySelectorAll(".editBtn");
        for ( var i = 0, length = editBtn.length; i < length; i++) {
            addListener(editBtn[i], "click", function() {
                var id = this.parentNode.parentNode.firstChild.textContent;
                var row = this.parentNode.parentNode;
                var url = "http://webapigl.azurewebsites.net/api/values/" + id;

                console.log("id: " + id + " row: " + row + " url: " + url);
                getDataById(id);
                updateEdit(id);
            });
        }
    }

	// remove item from DB
	function removeItem() {
        console.log("removeItem");
		deleteBtn = document.querySelectorAll(".deleteBtn");
		for ( var i = 0, length = deleteBtn.length; i < length; i++) {
			addListener(deleteBtn[i], "click", function() {
				var result =  confirm("Are you sure?");
				if (result) {
					var id = this.parentNode.parentNode.firstChild.textContent;
					var row = this.parentNode.parentNode;
					var url = "http://webapigl.azurewebsites.net/api/values/" + id;
					removeByID(url, row);
				}
			});
		}
	}

    // remove item from DB
    function removeByID(url, row) {
        xhr.open("DELETE", url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("deleted item");
                table.removeChild(row);
            }
        }
        xhr.send();
    }

/* ---------------------------------------  Logic ----------------------------------------------*/
	// get data from DB
	function getDB(url) {
		xhr.open("GET", url);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data = JSON.parse(xhr.responseText);
				//console.log(xhr.responseText);
                refreshTable(data);
                removeItem();
                editItem();
			}
            if (xhr.readyState == 4 && (xhr.status == 400 || xhr.status == 404)) {
                alert("Not Found! Enter correct ID!");
                renderTable();
            }
		}
		xhr.send();
	}

	 // create table with data about Order
	 function createTable(table, data) {
		 var tr, td, prop;
		 if (!data.length) {
			 var arr = [];
			 arr.push(data);
			 data = arr;
		 }
		 for (var i = 0, length = data.length; i < length; i++) {
			 tr = document.createElement("tr");
			 for (prop in data[i]){
				 td = document.createElement("td");
				 td.innerText = data[i][prop];
				 tr.appendChild(td);
			 }
			 td = document.createElement("td");
			 td.innerHTML = '<a href="#" class="deleteBtn">Удалить</a> | <a href="#" class="editBtn">Редактировать</a>';
             tr.appendChild(td);
			 table.appendChild(tr);
		 }
	}

	// clear and render table
	function renderTable() {
		var row = table.getElementsByTagName("tr");
		for (var i = row.length-1; i >= 1; i--) {
			table.removeChild(row[i]);
		}
	}

    function refreshTable(data) {
        renderTable();
        createTable(table, data);
    }

    function updateEdit(id) {
        console.log("updateEdit");
        isUpdating = true;
        ID = id;
        var tableAdd = document.querySelector("#tableAdd");
        if (tableAdd.style.display == "none") {
            tableAdd.style.display = "";
        }
    }

    function showEdit() {
        var tableAdd = document.querySelector("#tableAdd");
        tableAdd.style.display = "";
    }

	function updateAdd() {
        console.log("updateAdd");
        isUpdating = false;
        ID = "";
        var tableAdd = document.querySelector("#tableAdd");
        if (tableAdd.style.display == "") {
            tableAdd.style.display = "none";
        } else {
            tableAdd.style.display = "";
        }
    }

    function getData() {
        console.log("getData");
        var data = {};
        data.Id = document.querySelector("#inputId").value;
        data.Customer = document.querySelector("#inputCustomer").value;
        data.Product = document.querySelector("#inputProduct").value;
        data.Quantity = document.querySelector("#inputQuantity").value;
        return data;
    }

    function setData(data) {
        console.log("setData");
        document.querySelector("#inputId").value = data.Id.toString();
        document.querySelector("#inputCustomer").value = data.Customer;
        document.querySelector("#inputProduct").value = data.Product;
        document.querySelector("#inputQuantity").value = data.Quantity;
    }

    function getDataById(id) {
        console.log("getDataById");
        var url = "http://webapigl.azurewebsites.net/api/values/" + id;
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                //console.log("getDataById:" + data);
                setData(data);
                showEdit();
            }
            if (xhr.readyState == 4 && (xhr.status == 400 || xhr.status == 404)) {
                alert("Not Found! Enter correct ID!");
                renderTable();
            }
        }
        xhr.send();
    }

    function sendData(data) {
        xhr.setRequestHeader("content-type", "application/json; charset=utf-8");
        xhr.send(JSON.stringify(data));
    }

    function addItem() {
        if (isUpdating) {
            console.log("addItem Update");
            var url = "http://webapigl.azurewebsites.net/api/values/" + ID;
            var data = getData();
            xhr.open("PUT", url);
            sendData(data);
        } else {
            console.log("addItem");
            var url = "http://webapigl.azurewebsites.net/api/values";
            var data = getData();
            xhr.open("POST", url);
            sendData(data);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 201) {
                //if (xhr.readyState == 2 && xhr.status == 201) {
                    createTable(data);
                }
            }
        }

        //getDB("http://webapigl.azurewebsites.net/api/values");
    }
}