export function creazaPiesa(
  index,
  data,
  display,
  modEditor,
  culoareStoc,
  disable
) {
  return `
     <div class="piesa" id='${data[index].id}'>
     <img class="poza-piesa" src='${data[index].poza_piesa}' loading="lazy">
     <div class="date-piesa-container">
         <div class="date-importante">
             <div class="celula-piesa" ${display}><div><strong>Part Photo</strong>:<span ${modEditor} class="data"> ${data[
    index
  ].poza_piesa.slice(12)}</span></div></div>
             <div class="celula-piesa"><div><strong>Part Name</strong>:<span ${modEditor} class="data"> ${
    data[index].nume_reper
  }</span></div></div>
             <div class="celula-piesa"><div><strong>Part Type</strong>:<span ${modEditor} class="data"> ${
    data[index].tip_reper
  }</span></div></div>
             <div class="celula-piesa"><div><strong>IFS Code</strong>:<span ${modEditor} class="data"> ${
    data[index].cod_ifs
  }</span></div></div>
             <div class="celula-piesa"><div><strong>Manufacturer</strong>:<span ${modEditor} class="data"> ${
    data[index].producator
  }</span></div></div>
             <div class="celula-piesa"><div><strong>Manufacturer code</strong>:<span ${modEditor} class="data"> ${
    data[index].cod_producator
  }</span></div></div>
             <div class="celula-piesa"><div><strong>Production line</strong>:<span ${modEditor} class="data"> ${
    data[index].linie_productie
  }</span></div></div>
             <div class="celula-piesa"><div><strong>Equipment series</strong>:<span ${modEditor} class="data"> ${
    data[index].serie_echipament
  }</span></div></div>
             <div class="celula-piesa"><div><strong>Warehouse location</strong>:<span ${modEditor} class="data"> ${
    data[index].locatie_magazie
  }</span></div></div>
             <div class="celula-piesa"><div><strong>Hall</strong>:<span ${modEditor} class="data"> ${
    data[index].hala
  }</span></div></div>
             <div class="celula-piesa descriere"><div><strong>Description</strong>:<span contenteditable=true class="data"> ${
               data[index].descriere
             }</span></div></div>
             <div class="celula-piesa descriere observatii" ><div><strong>Observations</strong>:<span contenteditable=true class="data"> ${
               data[index].observatii
             }</span></div></div>
         </div>
      
     </div>
     <div class= "stocuri">
         <div class="container-stoc">
             <div class="stoc-actual"><div>Current stock</div></div>
             <div class="stoc-minim"><div>Min stock allowed</div></div>
         </div> 
         <div class="cantitate">
             <div class="numar-stoc-actual" style="background:${culoareStoc(
               data[index].cantitate_stoc_actual,
               data[index].cantitate_stoc_minim
             )}"><div ><span ${modEditor} class="data valoare-actual">${
    data[index].cantitate_stoc_actual
  }</span> ${data[index].unitate_masura}</div></div>
 
             <div class="numar-stoc-minim"><div><span ${modEditor} class="data valoare-minim">${
    data[index].cantitate_stoc_minim
  }</span><span class="data"> ${data[index].unitate_masura}</span></div></div>
         </div>
         <div class="container-butoane-stoc">
           <button class="buton-stoc">Withdraw part</button>
           <button ${disable} class="buton-stergere">Delete part</button>
         </div>
         <div class="container-pret">
         <div class="stoc-actual"><div><strong>Unit price (Dollars)</strong></div></div>
         <div ${modEditor} class="numar-stoc-minim"><div class="data">${
    data[index].pret_unitar_lei
  }</div></div>
         </div>
 
     
     </div>
     </div>`
}

export function loading() {
  return `
    <div class='loading'>Loading...</div>
    `
}
