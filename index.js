window.addEventListener('DOMContentLoaded', function(){

    const dataForm = document.getElementById('dataForm');
    const dataTable = document.getElementById('dataTable');
    const searchBar = document.getElementById('searchBar');
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

    function loadEmployees(employeesList){
        for (index = 0; index < employeesList.length; index++)
        { 
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

            if (key === "img") {
                const img = document.createElement('img');
                
            }
            if(key == "birthdate"){
                const date= data[key];
                const splittedDate = date.split("-")
                const year = splittedDate[0];
                const month = splittedDate[1];
                const day = splittedDate[2];
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
        button.onclick = function() {removeRow(row);};

        tableNode.children[1].appendChild(row);
    }
    
    function removeRow(row){
        row.remove();
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
            appendDataToTable(dataTable, data);
            employees = [...employees,data];
        }
    })
})