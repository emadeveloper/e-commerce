//JAVASCRIPT

//Alert inicio de pagina
swal("Bienvenido a nuestra Tienda digital E-Commerce");

//Carrito en LocalStorage
const nombreCarritoEnLocalStorage = 'carrito'
//carrito
let carrito = {}

//Sweet Alert funcion
const mostrarAlert = () => {
    swal ("Agregaste un producto a tu carrito!", "", "success")
};

const advertenciaVaciar = () => {
    swal ("Eliminaste con exito todos los productos del carrito", "", "success")
};

const saludoDeCompra = () => {
    swal ("Felicidades por tu nueva compra!", "", "success")
};


//Fetch data 
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    // Leer del localStorage a ver si hay algo guardado del carrito
    var carritoGuardadoEnLocalStorage = localStorage.getItem(nombreCarritoEnLocalStorage);
    if (carritoGuardadoEnLocalStorage != null) {
        //Si había algo guardado en el local storage, leerlo y pasar de "json serializado en String" a "objeto JavaScript"
        carrito = JSON.parse(carritoGuardadoEnLocalStorage)
    }
    //Modificar al objeto carrito y volver a "pintar el carrito" en el html
    pintarCarrito()
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        // console.log(data)
        pintarProductos(data)
        detectarBotones(data)
    } catch (error) {
        console.log(error)
    }
}
//Renderizar cards de productos
const contendorProductos = document.querySelector('#contenedor-productos')
const pintarProductos = (data) => {
    const template = document.querySelector('#template-productos').content
    const fragment = document.createDocumentFragment()
    // console.log(template)
    data.forEach(producto => {
        // console.log(producto)
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        template.querySelector('h5').textContent = producto.title
        template.querySelector('p span').textContent = producto.precio
        template.querySelector('button').dataset.id = producto.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    contendorProductos.appendChild(fragment)
}

//Detectar Botones
const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))
            producto.cantidad = 1
            if (carrito.hasOwnProperty(producto.id)) {
                producto.cantidad = carrito[producto.id].cantidad + 1
            }
            carrito[producto.id] = { ...producto }
            // console.log('carrito', carrito)
            guardarCarritoEnLocalStorage();
            pintarCarrito();
            mostrarAlert();
        })
    })
}

const items = document.querySelector('#items')
//Renderizar Carrito
const pintarCarrito = () => {

    //carrito innerHTML
    items.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    Object.values(carrito).forEach(producto => {
        // console.log('producto', producto)
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.title
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()
    accionBotones()

}
//Renderizar Footer carrito
const footer = document.querySelector('#footer-carrito')
const pintarFooter = () => {

    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Tu Carrito esta vacío! Empeza a comprar ahora</th>
        `
        return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    // console.log(nPrecio)

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    //vaciar el carrito
    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {};
        pintarCarrito();
        advertenciaVaciar();
    })
    //Realizar pedido
    const comprar = document.querySelector('#realizar-compra')
    comprar.addEventListener ('click', () => {
        carrito = {};
        pintarCarrito();
        saludoDeCompra();
    });
};



//Accion botones
const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')

    // console.log(botonesAgregar)
    //Agregar cantidad(+1) del carrito
    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const producto = carrito[btn.dataset.id]
            producto.cantidad ++
            carrito[btn.dataset.id] = { ...producto }
            pintarCarrito();
            guardarCarritoEnLocalStorage();
            
        })
    })
    //Eliminar cantidad (-1) del carrito
    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = carrito[btn.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[btn.dataset.id]
            } else {
                carrito[btn.dataset.id] = { ...producto }
            }
            pintarCarrito();
            guardarCarritoEnLocalStorage();
        })
    })
}

//Funcion guardar items del carrito en LocalStorage
function guardarCarritoEnLocalStorage() {
    //Pasar de "objeto JavaScript" a "string serializado como JSON"
    const carritoComoJSONString = JSON.stringify(carrito)
    //Guardar el string en localStorage en la clave (key) "carrito"
    localStorage.setItem(nombreCarritoEnLocalStorage, carritoComoJSONString)
}

