window.addEventListener('DOMContentLoaded', function(){

    const dataForm = document.getElementById('dataForm');
    const dataTable = document.getElementById('dataTable');
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    
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
        tableNode.children[1].appendChild(row);
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
        }
    })
})