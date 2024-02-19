const comboComerciales = frmComercial[0];

gestor = new Gestor();

function extraerApi() {
    return fetch('https://proyectodvi-iii-default-rtdb.europe-west1.firebasedatabase.app/.json') //? Hace una solicitud "GET" a la url (API)
    .then(res => { //? Recibe un objeto RESPONSE como argumento
    if (!res.ok) { //? Si el booleano "ok" del objeto RESPONSE es falso, por lo que ha abido un error en la solicitud HTTP del anterior "GET"
        throw new Error('Error en la solicitud'); //? Generamos un nuevo objeto ERROR con un mensaje personalizado
    }
    return res.json();//? i el booleano "ok" del objeto RESPONSE es verdadero, por lo que no hay error, devolvemos el cuerpo de la respuesta formateado en JSON
    }).then(data => {
    // Procesar los datos recibidos
    return data;
    }).catch(error => {
    console.error('Error:', error);
    });
}

function mostrarComerciales(datosExtraidos) {
    const datosComerciales = datosExtraidos.comerciales;
    let arrayNombres = [];
    for (const key in datosComerciales) {
        if (Object.hasOwnProperty.call(datosComerciales, key)) {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = datosComerciales[key];
            comboComerciales.appendChild(option)
            arrayNombres.push(datosComerciales[key]);
            //const nombreComercial = datosComerciales[key];
        }
    }
    gestor.comercialActual=comboComerciales.selectedIndex;
    //console.log(datosComerciales);
    mostrarClientes(datosExtraidos,datosComerciales,arrayNombres);
};



function mostrarClientes(datosExtraidos,comerciales,nombreComerciales) {
    let indice;

    const datosClientes = datosExtraidos.clientes;
    console.log(nombreComerciales , datosClientes, );
};

extraerApi()
.then (data => {
    mostrarComerciales(data);
});

comboComerciales.addEventListener('change', ()=>{
    gestor.comercialActual = comboComerciales.selectedIndex;
})