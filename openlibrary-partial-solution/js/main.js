import {datubasea} from './datubasea.js'

//title-ena eta argazkiaren aurrizkia
let indizea = 0
const URLBASE = 'https://covers.openlibrary.org/b/id/'
let izenburua  = document.getElementById('izenburua');
let irudia = document.getElementById('irudia')
let egilea = document.getElementById('egilea')
let isbn = document.getElementById('isbn')
let aurrera = document.getElementById('aurrera')
let atzera = document.getElementById('atzera')
let bilatu = document.getElementById('bilatu')
let libKop = document.getElementById('libKop')

function eremuakBete(){

    izenburua.value = datubasea[indizea].izenburua
    data.value = datubasea[indizea].data
    egilea.value = datubasea[indizea].egilea
    isbn.value = datubasea[indizea].isbn
    irudia.src = URLBASE + datubasea[indizea].filename 
    libKop.textContent=datubasea.length
}


function DBbadago(url){
    let emaitza=datubasea.findIndex(function bilatu(lib){return lib.isbn==url})
    return emaitza
}


async function bilatuAPI(){
    if(DBbadago(isbn.value)== -1){
        let lib= await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn.value}&format=json&jscmd=details`)
        .then(r => r.json()).then(datuak => {
        
       //datu berriak kargatu
        let thumbnail_url= datuak[`ISBN:${isbn.value}`].details.covers[0]

        let zebauthor=datuak[`ISBN:${isbn.value}`].details.authors.length
        let authors=""
            for(let i=0;i<zebauthor;i++){//author bat baino gehiago badago guztiak erakutsi
                authors=authors+datuak[`ISBN:${isbn.value}`].details.authors[i].name+". "
            }
     
        let full_title
            if(datuak[`ISBN:${isbn.value}`].details.full_title!= undefined){
                full_title= datuak[`ISBN:${isbn.value}`].details.full_title
            }else{
                full_title= datuak[`ISBN:${isbn.value}`].details.title
            }

        let data_book= datuak[`ISBN:${isbn.value}`].details.publish_date
        let irudia = new Image()        
        let i=document.getElementById('irudia')
        i.src=URLBASE+thumbnail_url+"-M.jpg"

        console.log()
        //DBan gorde datuak
        datubasea.push({
            "isbn": isbn.value,
            "egilea": authors,
            "data": data_book,
            "izenburua": full_title,
            "filename": thumbnail_url+"-M.jpg"
        })

        //eguneratu dena.
         indizea=datubasea.length-1
         data.value = datubasea[indizea].data
         egilea.value = datubasea[indizea].egilea
         isbn.value = datubasea[indizea].isbn
         irudia.src = URLBASE + datubasea[indizea].filename+"-M.jpg"
         izenburua.value = datubasea[indizea].izenburua
        })
    }   
    
    libKop.textContent=datubasea.length
}




function kargatu(){

    eremuakBete()

    aurrera.addEventListener('click', (event) => {
        if (indizea < datubasea.length-1)
            indizea++
        eremuakBete()
    })
    atzera.addEventListener('click', (event) => {
        if (indizea > 0)
            indizea--
        eremuakBete()
    })

    
    bilatu.addEventListener('click', (event) => {
        bilatuAPI()
    })
    
    
}

window.onload = kargatu;
