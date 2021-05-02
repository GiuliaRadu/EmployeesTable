window.addEventListener('DOMContentLoaded', function(){

    const dataForm = document.getElementById('dataForm');
    const dataTable = document.getElementById('dataTable');
    const searchBar = document.getElementById('searchBar');
    const sortButton = document.getElementById("sortButton");
    const filter = document.getElementById('filterGender');
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    let employees = [];
    var employeesList=[];

    jQuery(document).ready(function ($) {
        $.ajax({
            method: "GET",
            url: 'https://localhost:5001/employee/Employee',
            success: function (data) {
                console.log(data)
                employeesList = data;
                loadEmployees(employeesList);
            },
            error: function (data) {
            alert(`Failed to load employees list.`);
            },
        });
    });

    function validateInput(newEmployee){
        
        if (!newEmployee.FirstName || !newEmployee.LastName || !newEmployee.Email || !newEmployee.Picture) {
            return false;
        }
        return true;
    }
            
    function addEmployee() {
        var newEmployee = new Object();
        newEmployee.Id = 0;
        newEmployee.FirstName = document.getElementById('fname').value;
        newEmployee.LastName = document.getElementById('lname').value;
        newEmployee.Email = document.getElementById('email').value;
        newEmployee.Picture = "pic";
        if (!validateInput(newEmployee)) {
            alert("You need to fill all the information!");
            console.log(newEmployee.picture)
            return;
        }
        newEmployee.Gender = document.getElementById('sex').value;
        newEmployee.Birthdate = document.getElementById('dateOfBirth').value;
        $.ajax({
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(newEmployee),
            url: 'https://localhost:5001/employee/Employee',
            success: function (data) {
                appendDataToTable(dataTable,data);
            },
            error: function (data) {
            alert(`Failed to add employee to list.`);
            },
        });
    }

    function loadEmployees(employeesList){
        for (index = 0; index < employeesList.length; index++)
        { 
            console.log(employeesList[index])
            appendDataToTable(dataTable,employeesList[index])
        }
    }

    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value.toLowerCase();
        const filteredEmployees = employees.filter(employee => {
            return employee.fname.toLowerCase().startsWith(searchString) || employee.lname.toLowerCase().startsWith(searchString);
        })
        console.log(filteredEmployees)
        dataTable.children[1].innerHTML="";
        for(i =0 ; i<filteredEmployees.length;i++)
            appendDataToTable(dataTable,filteredEmployees[i]);

    })

    function appendDataToTable(tableNode, data) {
        console.log(data)
        const row = document.createElement('tr');

        for(const key in data){
            const cell = document.createElement('td');
            if(key === "id"){
                continue;
            }
            if (key === "img") {
                const img = document.createElement('img');
                
            }
            if(key == "birthdate"){
                const date= data[key];
                const splittedDate = date.split("-")
                const year = splittedDate[0];
                const month = splittedDate[1];
                const day = splittedDate[2].split("T")[0];
                console.log(day)
                var finalDate="";

                if(month.startsWith("0"))
                {
                    monthWithoutZero = month.substring(1); 
                    finalDate=day + " " + months[monthWithoutZero-1]+ " " + year;
                }
                finalDate = day + " " + months[month-1] + " " + year;   
                cell.innerText = finalDate;
            }   
            else{
                cell.innerText = data[key];
            }            
            row.appendChild(cell);
        }
        if (tableNode.children.length < 2) {
            console.log("Table doesent contain body")
            return;
        }
        let button = document.createElement('button');
        row.appendChild(button)
        button.onclick = function() {
            row.remove();
            removeEmployeeFromDb(data.id)
        };

        tableNode.children[1].appendChild(row);
    }

    
    function removeEmployeeFromDb(id){
        $.ajax({
            method: "DELETE",
            url: `https://localhost:5001/employee/Employee/${id}`,
            error: function (data) {
                alert(`Failed to remove employee from list`);
            },
        });
    }

    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isValid = dataForm.checkValidity();

        if (isValid) {

            const data = {};
            for(const el of dataForm.elements){
                const {name,value} = el;
                //sa nu adauge td cu submit care nu are name
                if (name.length > 0) {
                    data[name] = value;  
                }  
            }
            // appendDataToTable(dataTable, data);
            addEmployee();
            employees = [...employees,data];
        }
    })

    sortButton.addEventListener('click', (e) =>{
        var sortAttribute = document.getElementById("sortButton").getAttribute("sort");
        if(sortAttribute == "up") {
            document.getElementById("sortButton").setAttribute("sort", "down");
        }else {
            document.getElementById("sortButton").setAttribute("sort", "up");
        }
    
        var rows, switching, index, x, y, shouldSwitch;
        switching = true;
    
        while (switching) {
            switching = false;
            rows = dataTable.rows;
            for (index = 1; index < (rows.length - 1); index++) {
                shouldSwitch = false;
                x = new Date(rows[index].getElementsByTagName("td")[5].innerText);
                console.log(x)
                y = new Date(rows[index + 1].getElementsByTagName("td")[5].innerText);
                console.log(y)
                if(sortAttribute == "up") {
                    if (x < y) {
                        shouldSwitch = true;
                        break;
                    }
                } else if(sortAttribute == "down") {
                    if (x > y) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[index].parentNode.insertBefore(rows[index + 1], rows[index]);
                switching = true;
            }
        }
    })

    filter.addEventListener('change', (e) =>{
        let filter = document.getElementById('filterGender').value;
        tr = dataTable.getElementsByTagName("tr");
      
        for (index = 1; index < tr.length; index++) {
          td = tr[index].getElementsByTagName("td")[3];
          if (td) {
            genderValue = (td.textContent || td.innerText).toLowerCase();
            if (genderValue == filter.toLowerCase() || filter.toLowerCase() == "none") {
                tr[index].style.display = "";
            }else {
              tr[index].style.display = "none";
            }
          }
        }
    })
})