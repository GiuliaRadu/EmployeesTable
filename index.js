window.addEventListener('DOMContentLoaded', function(){
    const submitBtn = document.getElementById("submit");
    const dataForm = document.getElementById('dataForm');
    const dataTable = document.getElementById('dataTable');
    
    function appendDataToTable(tableNode, data) {
        const row = document.createElement('tr');

        for(const key in data){
            const cell = document.createElement('td');

            if (key === "img") {
                const img = document.createElement('img');
                img.src = data[key];
                
                cell.appendChild(img);
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
                if (name.length > 0) {
                    data[name] = value;
                }     
            }
            appendDataToTable(dataTable, data);
        }
    })

})