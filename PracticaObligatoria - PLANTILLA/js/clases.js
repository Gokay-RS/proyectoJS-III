//^^ Clase Producto

class Producto{
    #idProducto;
    #nombreProducto;
    #precioUnidad;
    #idCategoria;
    constructor(idProducto, nombreProducto, precioUnidad, idCategoria){
        this.idProducto = idProducto;
        this.nombreProducto = nombreProducto;
        this.precioUnidad = precioUnidad;
        this.idCategoria = idCategoria;
    }
}

//^^ Clase Catalogo
class Catalogo{
    #productos;
    constructor(){
        this.productos = []
    }
    addProducto(idProducto, nombreProducto, precioUnidad, idCategoria){
        const producto = new Producto(idProducto, nombreProducto, precioUnidad, idCategoria);
        this.productos.push(producto);
    }
}

//^^ Clase LineaPedido

class LineaPedido{
    #unidades;
    #idProducto;
    constructor(unidades, idProducto){
        this.unidades = unidades;
        this.idProducto = idProducto;
    }
}

//^^ Clase Cliente
class Cliente{
    #nombre;
    #cuentaAbierta;
    constructor(nombre, cuentaAbierta){
        this.nombre = nombre;
        this.cuentaAbierta = cuentaAbierta;
    }
}

//^^ Clase Gestor
class Gestor{
    #categorias;
    #comerciales;
    #clientes;
    #comercialActual;
    #clienteActual;
    #pedidos;
    constructor(){
        this.categorias = [];
        this.comerciales = [];
        this.clientes = [[]] //?  [x[y]] -> x=indice comercial, y=objetos cliente
        this.comercialActual = 0;
        this.clienteActual = 0;
        this.pedidos = []; //?  [x[y[z]]] -> x=indice comercial, y=indice del cliente, z=objetos LineaPedido
    }
}

