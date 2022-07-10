document.addEventListener('DOMContentLoaded', e => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
});




//Hola Emanuel,
//Está bien que hayas enviado el link mediante un comentario, esa es la forma de reentregar el desafío.
//En cuento a tu proyecto veo que hiciste bastantes cambios, ahora la información de los productos viene de un archivo json y se muestran en //pantalla usando arrays y objetos. Veo también que tenés un archivo localStorage.js que verifica si hay algo en el storage para cargarlo pero en //ningún momento se guarda información ahí, por eso no se mantienen los productos en el carrito al recargar la página. Otro detalle es que al vaciar //el carrito los productos se eliminan independientemente de si el usuario confirma la acción o la cancela, pero son detalles que estoy seguro vas a //ir solucionando en las próximas entregas.
//Hiciste un gran cambio en tu proyecto y mi calificación pasa a ser óptima. ¡Felicitaciones!