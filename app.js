const productos = [];
const carrito = [];

function agregarProducto(index) {
  const producto = productos[index];
  if (producto) {
    const productoEnCarrito = carrito.find(item => (
      item.nombre === producto.nombre && item.marca === producto.marca
    ));

    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1;
      productoEnCarrito.precioTotal += producto.precio;
    } else {
      carrito.push({
        nombre: producto.nombre,
        marca: producto.marca,
        precio: producto.precio,
        cantidad: 1,
        precioTotal: producto.precio,
      });
    }

    mostrarProductosEnCarrito();
  }
}

function quitarProducto(index) {
  const productoEnCarrito = carrito[index];
  if (productoEnCarrito) {
    if (productoEnCarrito.cantidad > 1) {
      productoEnCarrito.cantidad -= 1;
      productoEnCarrito.precioTotal -= productoEnCarrito.precio;
    } else {
      carrito.splice(index, 1);
    }
    mostrarProductosEnCarrito();
  }
}

function mostrarProductosEnCarrito() {
  const carritoTableBody = document.getElementById('carritoTableBody');
  carritoTableBody.innerHTML = '';

  let subtotal = 0;

  carrito.forEach((producto, index) => {
    const row = document.createElement('tr');

    const nombreCell = document.createElement('td');
    nombreCell.textContent = producto.nombre;

    const precioCell = document.createElement('td');
    precioCell.textContent = producto.precio;

    const cantidadCell = document.createElement('td');
    cantidadCell.textContent = producto.cantidad;

    const subtotalCell = document.createElement('td');
    subtotalCell.textContent = producto.precio * producto.cantidad;

    const accionesCell = document.createElement('td');
    const quitarButton = document.createElement('button');
    quitarButton.textContent = 'Quitar';
    quitarButton.classList.add('btn', 'btn-danger', 'btn-sm');
    quitarButton.addEventListener('click', () => quitarProducto(index));

    accionesCell.appendChild(quitarButton);

    row.appendChild(nombreCell);
    row.appendChild(precioCell);
    row.appendChild(cantidadCell);
    row.appendChild(subtotalCell);
    row.appendChild(accionesCell);

    carritoTableBody.appendChild(row);

    subtotal += producto.precio * producto.cantidad;
  });

  const totalRow = document.createElement('tr');
  totalRow.innerHTML = '<td colspan="3">Total:</td><td>' + subtotal + '</td><td></td>';
  carritoTableBody.appendChild(totalRow);
}

document.getElementById('comprarButton').addEventListener('click', function() {
  vaciarCarritoYMostrarMensajeCompra();
});

function vaciarCarritoYMostrarMensajeCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Parece que tienes el carrito vacío!'
    })
    mensajeCompra.textContent = 'Primero debes llenar el carrito';
  } else {
    carrito.length = 0;
    mostrarProductosEnCarrito();
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Confirmación',
      text: "Estas a punto de realizar tu compra",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Comprar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Compra Realizada!',
          'Su compra ha realizada con exito.',
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Su compra ha sido cancelada.',
          'error'
        )
      }
    })
  }
}

fetch('https://my-json-server.typicode.com/EmiSoba/proyectoJS/productos_alimenticios')
  .then(response => response.json())
  .then(data => {
    const productosTableBody = document.getElementById('productosTableBody');

    if (Array.isArray(data)) {
      productos.push(...data);
      data.forEach((producto, index) => {
        const row = document.createElement('tr');

        const nombreCell = document.createElement('td');
        nombreCell.textContent = producto.nombre;

        const marcaCell = document.createElement('td');
        marcaCell.textContent = producto.marca;

        const precioCell = document.createElement('td');
        precioCell.textContent = producto.precio;

        const accionesCell = document.createElement('td');
        const agregarButton = document.createElement('button');
        agregarButton.textContent = 'Agregar';
        agregarButton.classList.add('btn', 'btn-success', 'btn-sm');
        agregarButton.addEventListener('click', () => agregarProducto(index));

        accionesCell.appendChild(agregarButton);

        row.appendChild(nombreCell);
        row.appendChild(marcaCell);
        row.appendChild(precioCell);
        row.appendChild(accionesCell);

        productosTableBody.appendChild(row);
      });
    } else {
      console.error('No se encontró la lista de productos en la API.');
    }
  })
  .catch(error => {
    console.error('Error al cargar los datos desde la API:', error);
  });
