const url = "https://proyectodvi-iii-default-rtdb.europe-west1.firebasedatabase.app/"; const ext =".json";
const divClientesPadre = document.getElementById('clientes');
const comboComerciales = frmComercial[0];
const comboCategorias = frmControles[0];
const comboProductos = frmControles[1];
const botonGestionCategoria = document.getElementById('btnGestionCategorias');
const botonGestionProductos = document.getElementById('btnGestionProductos');

gestor = new Gestor();
catalogo = new Catalogo();

function extraerApi() {
    return fetch(url+ext) //? Hace una solicitud "GET" a la url (API)
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
};

function mostrarComerciales(datosExtraidos) {
    const datosComerciales = datosExtraidos.comerciales;
    for (const key in datosComerciales) {
        if (Object.hasOwnProperty.call(datosComerciales, key)) {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = datosComerciales[key];
            comboComerciales.appendChild(option)
        }
    }
    gestor.comercialActual=comboComerciales.selectedIndex;
    mostrarClientes(gestor.clientes);
};

function mostrarClientes(todosLosClientes) {
    const divClientesHijo = document.createElement('div');
    divClientesHijo.id='todosClientes';
    divClientesPadre.appendChild(divClientesHijo);

    todosLosClientes[gestor.comercialActual].forEach(cliente => {
        const divDeCliente = document.createElement('div');
        divDeCliente.classList.add('cliente');
        if(!cliente.cuentaAbierta){
            divDeCliente.classList.add('pagado');
        }else{
            divDeCliente.classList.add('pendiente')
        }
        divDeCliente.textContent = cliente.nombre;
        divClientesHijo.appendChild(divDeCliente);
    });
};

function cargarCategorias(categorias) {
    comboCategorias.innerHTML="";
    for (const key in categorias) {
        if (Object.hasOwnProperty.call(categorias, key)) {
            const option = document.createElement('option');
            option.value=key;
            option.textContent=categorias[key];
            comboCategorias.appendChild(option);
        }
    }
};

function cargarProductos(productos) {
    for (const key in productos) {
        if (Object.hasOwnProperty.call(productos, key)) {
            catalogo.addProducto(productos[key].idProducto, productos[key].nombreProducto, productos[key].precioUnidad, productos[key].idCategoria)
        }
    }
    mostrarProductos(catalogo.productos);
};

function mostrarProductos(productos) {
    comboProductos.innerHTML="";
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].idCategoria == comboCategorias.selectedIndex) {
            const option = document.createElement('option');
            option.value = productos[i].idProducto;
            option.textContent = productos[i].nombreProducto;

            comboProductos.appendChild(option);
        }
    }
    //? Fragmento de codigo para el relleno automatico del campo de texto para borrar la categoria
    let categorias = comboCategorias.querySelectorAll("option") //^ Introducimos dentro de la variable todos los options del comboBox
    frmBorrarCategoria[0].value=categorias[comboCategorias.selectedIndex].textContent; //^ Igualamos el valor del input a el nombre de la categoria seleccionada
    frmEditarCategoria[0].value=categorias[comboCategorias.selectedIndex].textContent; //^ Igualamos el valor del input a el nombre de la categoria seleccionada
};

function gestionCategorias() {
    if (!(document.getElementById('frmNuevaCategoria'))) {
        document.getElementById('formularios').innerHTML = "";
        let salida =
                '<form id="frmNuevaCategoria" name="frmNuevaCategoria" style="visibility: visible">' +
                '<label><h4>Nueva categoría:</h4></label>' +
                '<input type="text" id="txtNuevaCategoria" /><br /><br />' +
                '<input type="submit" value="Guardar" />' +
                '</form>' +
                '<hr />' +
                '<form id="frmBorrarCategoria" name="frmBorrarCategoria" style="visibility: visible">' +
                '<label><h4>Categoría a borrar:</h4></label>' +
                '<input type="text" id="txtBorrarCategoria" disabled /><br /><br />' +
                '<input type="submit" value="Borrar" />' +
                '</form>' +
                '<hr />' +
                '<form id="frmEditarCategoria" name="frmBorrarCategoria" style="visibility: visible">' +
                '<label><h4>Categoría a actualizar:</h4></label>' +
                '<input type="text" id="txtActualizarCategoria" disabled /><br />' +
                '<label><h4>Nuevo nombre para la categoria</h4></label>' +
                '<input type="text" if="nuevotxtActualizarCategoria" /><br /><br />' +
                '<input type="submit" value="Actualizar" />' +
                '</form>';

        document.getElementById('formularios').innerHTML=salida;
        frmNuevaCategoria.addEventListener('submit', ()=>{
            event.preventDefault();
            insertarCategoria(frmNuevaCategoria[0].value.trim());
        });
        frmBorrarCategoria.addEventListener('submit', ()=>{
            event.preventDefault();
            borrarCategorias();
        });
        frmEditarCategoria.addEventListener('submit', ()=>{
            event.preventDefault();
            editarCategoria();
        });
        console.log('Regenerado formulario de gestión de categoria');
        mostrarProductos(catalogo.productos);
    }else{
        console.log('Ya existe');
    }
};

function insertarCategoria(nuevaCategoria) {
    
    let categoriaAAñadir;
    if (nuevaCategoria) {
        categoriaAAñadir = nuevaCategoria
    }else{
        categoriaAAñadir = frmNuevaCategoria[0].value.trim();
    }
    fetch(url+"categorias/"+ext, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(categoriaAAñadir)
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar la categoría'); // Si hay un error en la solicitud
        }
        return response.json(); // Si la solicitud es exitosa, leemos la respuesta como JSON
        })
    .then(data => {
        console.log('Categoría agregada con éxito:', data); // Hacemos algo con la respuesta (opcional)
        gestor.categorias[data.name] = categoriaAAñadir;
        cargarCategorias(gestor.categorias);
    })
    .catch(error => {
        console.error('Error al agregar la categoría:', error); // Manejo de errores
    });
};

function borrarCategorias(){
    
    const idCategoria = Object.keys(gestor.categorias).find(key => gestor.categorias[key] === frmBorrarCategoria[0].value.trim());

    if (idCategoria) {
        fetch(url + "categorias/" + idCategoria + ext, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al borrar la categoría');
            }
            return response.json();
        })
        .then(data => {
            console.log('Categoría borrada con éxito:', data);
            // Elimina la categoría del gestor.categorias
            delete gestor.categorias[idCategoria];
            cargarCategorias(gestor.categorias); // Actualiza la lista de categorías en el formulario
            mostrarProductos(catalogo.productos); // Muestra de nuevo los productos
        })
        .catch(error => {
            console.error('Error al borrar la categoría:', error);
        });
    } else {
        console.error('No se encontró la categoría:', nombreCategoria);
    }
};

function editarCategoria(){    
    
    borrarCategorias();
    insertarCategoria(frmEditarCategoria[1].value.trim());
}

function gestionProductos() {
    if (!(document.getElementById('frmNuevoProducto'))) {
        document.getElementById('formularios').innerHTML = "";
        let salida =
                '<form id="frmNuevoProducto" name="frmNuevoProducto" style="visibility: visible">' +
                '<label class="encabezadoDoble"><h4>Nuevo producto:</h4></label>' +
                '<span class="lineaDivisora"></span>'+
                '<label class="encabezadoDoble"><h4>Precio del nuevo producto:</h4></label>' +
                '<input type="text" id="txtNuevoProducto" class="comboInputs"/>' +
                '<span class="lineaDivisora2"></span>'+
                '<input type="text" id="txtNuevoPrecioProducto" class="comboInputs"/>' +
                '<input type="submit" value="Guardar" />' +
                '</form>' +
                '<hr />' +
                '<form id="frmBorrarProducto" name="frmBorrarProducto" style="visibility: visible">' +
                '<label><h4>Producto a borrar:</h4></label>' +
                '<input type="text" id="txtBorrarProducto" /><br /><br />' +
                '<input type="submit" value="Borrar" />' +
                '</form>' +
                '<hr />' +
                '<form id="frmEditarProducto" name="frmEditarProducto" style="visibility: visible">' +
                '<label><h4>Producto a actualizar:</h4></label>' +
                '<input type="text" id="txtActualizarProducto" disabled/><br />' +
                '<label class="encabezadoDoble"><h4>Nuevo nombre para el producto</h4></label>' +
                '<span class="lineaDivisora"></span>'+
                '<label class="encabezadoDoble"><h4>Nuevo precio para el producto</h4></label>'+
                '<input type="text" id="nuevotxtActualizarProducto" class="comboInputs" />' +
                '<span class="lineaDivisora2"></span>'+
                '<input type="text" id="nuevoPrecioActualizarProducto" class="comboInputs" /><br /><br />' +
                '<input type="submit" value="Actualizar" />' +
                '</form>';

        document.getElementById('formularios').innerHTML=salida;
        frmNuevoProducto.addEventListener('submit', ()=>{
            event.preventDefault();
            insertarProducto(frmNuevoProducto[0].value.trim(), frmNuevoProducto[1].value.trim());
        });
        frmBorrarProducto.addEventListener('submit', ()=>{
            event.preventDefault();
            borrarProducto();
        });
        frmEditarProducto.addEventListener('submit', ()=>{ 
            event.preventDefault();
            editarProducto();
        });
        console.log("Regenerando formulario de gestión de producto")
    }else{
        console.log('Ya existe');
    }
}
function instertarProducto(nuevoProducto) {
    let nuevoPrecio = frmNuevoProducto[1].value.trim();
    catalogo.addProducto(catalogo.productos.length+1, nuevoProducto, nuevoPrecio, comboCategorias.selectedIndex);


}

extraerApi()
.then (data => {
    let arrayClientes=[];
    for (const key in data.clientes) {
        if (Object.hasOwnProperty.call(data.clientes, key)) {
            arrayClientes = [];
            for (let i = 0; i<data.clientes[key].length; i++) {
                arrayClientes.push(new Cliente(data.clientes[key][i], false))
            }
            gestor.clientes.push(arrayClientes);
        };
    };
    gestor.clientes.shift();
    mostrarComerciales(data);
    /*console.log(data.categorias)
    console.log(gestor.categorias);*/
    gestor.categorias = data.categorias;
    cargarCategorias(gestor.categorias);
    cargarProductos(data.productos);
});

comboComerciales.addEventListener('change', ()=>{
    gestor.comercialActual = comboComerciales.selectedIndex;
    if(document.getElementById('todosClientes')){
        document.getElementById('todosClientes').parentNode.removeChild(document.getElementById('todosClientes'));
        mostrarClientes(gestor.clientes);
    }
});

comboCategorias.addEventListener('change', () => {
    mostrarProductos(catalogo.productos);
});

botonGestionCategoria.addEventListener('click', () => {
    gestionCategorias();
});

botonGestionProductos.addEventListener('click', ()=>{
    gestionProductos();
})