/**
 * Sorts a HTML table.
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */







const posts = {
    postPerPage : 10 , 
    currentPage : 1, 
    results : null 
}; 

const pagination = document.querySelector('.pages');
const output = document.querySelector('.output'); 
const date = document.querySelector('.date'); 



/// rest api 


const init = function(){
    const url = 'https://data.gov.il/api/3/action/datastore_search?resource_id=a30dcbea-a1d2-482c-ae29-8f781f5025fb&limit=100';
fetch(url).then(function(res){
    return res.json()
}).then(function(data){
    posts.results = data.result.records;
    loadPages(1);
})

}


// Load data to the table 

const loadPages = function(pg){
    posts.currentPage = pg ; 
    pagination.innerHTML = "" ;
    let startPost = (posts.currentPage - 1 ) * posts.postPerPage;
    let totalPages = Math.ceil( posts.results.length / posts.postPerPage);
    let endPost = startPost + posts.postPerPage > posts.results.length ?
    posts.results.length : startPost + posts.postPerPage ; 
    let pageOutput = document.createElement('div'); 
    for(let x=0; x < totalPages;x++ ){
        let span = document.createElement('span');
        span.textContent = ( x + 1 );
        span.className = 'pageination';
        console.log(posts.results[0])
        let slic = `${posts.results[0].CURRENT_DATE}` ; 
        date.innerHTML = slic

    span.addEventListener('click' , function(){
    loadPages( x+ 1 ); 
    })
    pageOutput.appendChild(span); 

    }
    let html = ""  

for(let x = startPost; x < endPost; x++){
   let htmlSegment=`<table class="table table-striped table-hover">
   <tr>
<td class="col">${(posts.results[x].FUND_NAME)}</td>
<td class="col">${(posts.results[x].YEAR_TO_DATE_YIELD)}%</td>
<td class="col">${(posts.results[x].YIELD_TRAILING_5_YRS)}%</td>
<td class="col">${(posts.results[x].SHARPE_RATIO)}</td>
<td class="col">${(posts.results[x].AVG_ANNUAL_MANAGEMENT_FEE)}%</td>
</tr>
</table>
`

html += htmlSegment;
let data = document.querySelector('.output'); data.innerHTML = html;

}

pagination.appendChild(pageOutput);

}




///sort table 

function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = parseFloat(a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim());
        const bColText = parseFloat(b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim());

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
});




window.addEventListener('load', function(){
    init();
})


