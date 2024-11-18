const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const addProductModal = document.getElementById('addProductModal');
    const openAddProductModalBtn = document.getElementById('openAddProductModal');
    const irAlMenuBtn = document.getElementById('irAlMenu');
    const closeAddProductModalBtns = document.querySelectorAll('.modal .close');
    const editProductModal = document.getElementById('productModal');
    const formAgregarProducto = document.getElementById('form-agrego-producto');
    const formModificarProducto = document.getElementById('form-modificar-producto');
    let productoPendiente = null;
    let currentEditId = null;

    let skip = 0;
    const limit = 10;

    // Inicialización de eventos de dropdown
    initializeDropdownEvents();

    // Vuelvo al menú principal
    if (irAlMenuBtn) {
        irAlMenuBtn.addEventListener('click', () => {
            window.location.href = "/";
        });
    }

    // Abro el modal de agregar producto
    if (openAddProductModalBtn) {
        openAddProductModalBtn.addEventListener('click', () => {
            addProductModal.style.display = 'block';
        });
    }

    // Cierro los modales
    closeAddProductModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addProductModal.style.display = 'none';
            editProductModal.style.display = 'none';
        });
    });

    // Cierro el modal si se hace clic fuera del modal
    window.addEventListener('click', (event) => {
        if (event.target === addProductModal || event.target === editProductModal) {
            addProductModal.style.display = 'none';
            editProductModal.style.display = 'none';
        }
    });

    // Recibo y muestro los productos paginados
    socket.on('productsPaginatedResponse', (productosPaginados) => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        productosPaginados.docs.forEach(producto => {
            const productItem = document.createElement('li');
            productItem.classList.add('card-io');
            productItem.setAttribute('data-id', producto._id);
            productItem.innerHTML = `
                <span class="product-code-io">${producto.code}</span>
                <br> 
                <span class="product-category-io">${producto.category}</span> - 
                <span class="product-title-io">${producto.title}</span>
                <br>
                <span class="product-description-io">${producto.description}</span>
                <br> 
                Precio: $<span class="product-price-io">${producto.price}</span> - 
                Stock: <span class="product-stock-io">${producto.stock}</span>
                <div class="dropdown">
                    <button class="dropdown-btn">Opciones</button>
                    <div class="dropdown-menu">
                        <a href="#" class="edit-btn" data-id="${producto._id}">Modificar</a>
                        <a href="#" class="delete-btn" data-id="${producto._id}">Eliminar</a>
                        <a href="#" class="add-cart-btn" data-id="${producto._id}">Agregar al Carrito</a>
                    </div>
                </div>
            `;
            productList.appendChild(productItem);
        });
        initializeDropdownEvents();
    });

    // Botón de página anterior
    document.getElementById('prevPage').addEventListener('click', () => {
        if (skip >= limit) {
            skip -= limit;
            socket.emit('productsPaginatedRequest', { skip, limit });
        }
    });

    // Botón de página siguiente
    document.getElementById('nextPage').addEventListener('click', () => {
        skip += limit;
        socket.emit('productsPaginatedRequest', { skip, limit });
    });

    // Valido producto antes de agregarlo
    socket.on('productoExisteP', (existe) => {
        if (existe) {
            alert('El producto con ese código ya existe.');
        } else {
            socket.emit('crearProductoP', productoPendiente);
            addProductModal.style.display = 'none';
        }
    });

    // Agrego un nuevo producto
    formAgregarProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        const product = {
            code: document.getElementById('product-code').value.trim(),
            category: document.getElementById('product-category').value.trim(),
            title: document.getElementById('product-title').value.trim(),
            description: document.getElementById('product-description').value.trim(),
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            status: true,
            thumbnails: [],
        };

        if (!product.code || !product.title || isNaN(product.price) || isNaN(product.stock) || !product.category) {
            alert('Todos los campos son obligatorios y deben ser válidos.');
            return;
        }

        if (product.price < 0 || product.stock < 0) {
            alert('El precio o el stock no pueden ser negativos.');
            return;
        }

        const categoriasValidas = ["tintos", "blancos", "rosados", "espumantes"];
        if (!categoriasValidas.includes(product.category.toLowerCase())) {
            alert('Las categorías válidas son: "Tintos", "Blancos", "Rosados" o "Espumantes".');
            return;
        }

        productoPendiente = product;
        socket.emit('validarProductoP', product.code);
    });

    // Manejo de clics en botones de la lista de productos
    const productList = document.getElementById('product-list');
    if (productList) {
        productList.addEventListener('click', (e) => {
            const idProducto = e.target.getAttribute('data-id');
            if (!idProducto) return;

            // Clic en eliminar producto
            if (e.target.classList.contains('delete-btn')) {
                socket.emit('eliminarProductoP', idProducto);
            }

            // Clic en editar producto
            if (e.target.classList.contains('edit-btn')) {
                currentEditId = idProducto;
                const card = e.target.closest('.card-io');
                if (card) {
                    document.getElementById('edit-product-code').value = card.querySelector('.product-code').textContent.trim();
                    document.getElementById('edit-product-category').value = card.querySelector('.product-category').textContent.trim();
                    document.getElementById('edit-product-title').value = card.querySelector('.product-title').textContent.trim();
                    document.getElementById('edit-product-description').value = card.querySelector('.product-description').textContent.trim();
                    document.getElementById('edit-product-price').value = card.querySelector('.product-price').textContent.trim();
                    document.getElementById('edit-product-stock').value = card.querySelector('.product-stock').textContent.trim();
                    editProductModal.style.display = 'block';
                }
            }

            socket.off('productoAgregadoP');
            socket.on('productoAgregadoP', (data) => {
                if (data.success) {
                    alert(data.message);
                } else {
                    alert(`Error: ${data.message}`);
                }
            });
            if (e.target.classList.contains('add-cart-btn')) {
                const cartId = localStorage.getItem('cartId');
                let idProducto = e.target.getAttribute('data-id');
                console.log("Cart: ", cartId)
                console.log("idProducto: ", idProducto)
                if (e.target.classList.contains('add-cart-btn')) {
                    const idProducto = e.target.getAttribute('data-id');
                    if (!cartId) {
                        alert("No hay un carrito asociado.");
                        return;
                    }
                    socket.emit('agregarProductoAlCart', { cart: cartId, idProducto });
                }}
            });
    }

    // Modificar producto
    formModificarProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedProduct = {
            code: document.getElementById('edit-product-code').value.trim(),
            category: document.getElementById('edit-product-category').value.trim(),
            title: document.getElementById('edit-product-title').value.trim(),
            description: document.getElementById('edit-product-description').value.trim(),
            price: parseFloat(document.getElementById('edit-product-price').value),
            stock: parseInt(document.getElementById('edit-product-stock').value),
        };

        if (!updatedProduct.code || !updatedProduct.title || isNaN(updatedProduct.price) || isNaN(updatedProduct.stock) || !updatedProduct.category) {
            alert('Todos los campos son obligatorios y deben ser válidos.');
            return;
        }

        if (updatedProduct.price < 0 || updatedProduct.stock < 0) {
            alert('El precio o el stock no pueden ser negativos.');
            return;
        }

        const categoriasValidas = ["tintos", "blancos", "rosados", "espumantes"];
        if (!categoriasValidas.includes(updatedProduct.category.toLowerCase())) {
            alert('Las categorías válidas son: "Tintos", "Blancos", "Rosados" o "Espumantes".');
            return;
        }

        socket.emit('modificarProductoP', { _id: currentEditId, ...updatedProduct });
        editProductModal.style.display = 'none';
    });

    // Actualizar la lista de productos
    socket.on('agregarProductoP', (producto) => {
        const productItem = document.createElement('li');
        productItem.classList.add('card-io');
        productItem.setAttribute('data-id', producto._id);
        productItem.innerHTML = `
            <span class="product-code-io">${producto.code}</span>
            <br> 
            <span class="product-category-io">${producto.category}</span> - 
            <span class="product-title-io">${producto.title}</span>
            <br>
            <span class="product-description-io">${producto.description}</span>
            <br> 
            Precio: $<span class="product-price-io">${producto.price}</span> - 
            Stock: <span class="product-stock-io">${producto.stock}</span>
            <div class="dropdown">
                <button class="dropdown-btn">Opciones</button>
                <div class="dropdown-menu">
                    <a href="#" class="edit-btn" data-id="${producto._id}">Modificar</a>
                    <a href="#" class="delete-btn" data-id="${producto._id}">Eliminar</a>
                    <a href="#" class="add-cart-btn" data-id="${producto._id}">Agregar al Carrito</a>
                </div>
            </div>
        `;
        productList.appendChild(productItem);
    });

    // Eliminar un producto de la lista
    socket.on('eliminarProductoP', (idProducto) => {
        const itemToRemove = productList.querySelector(`li[data-id="${idProducto}"]`);
        if (itemToRemove) {
            productList.removeChild(itemToRemove);
        }
    });

    // Actualizar un producto modificado
    socket.on('modificarProductoPag', (producto) => {
        const itemToUpdate = productList.querySelector(`li[data-id="${producto._id}"]`);
        if (itemToUpdate) {
            itemToUpdate.querySelector('.product-code').textContent = producto.code;
            itemToUpdate.querySelector('.product-category').textContent = producto.category;
            itemToUpdate.querySelector('.product-title').textContent = producto.title;
            itemToUpdate.querySelector('.product-description').textContent = producto.description;
            itemToUpdate.querySelector('.product-price').textContent = producto.price;
            itemToUpdate.querySelector('.product-stock').textContent = producto.stock;
        }
    });
});

// Función para inicializar eventos de dropdown
function initializeDropdownEvents() {
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');
    dropdownButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const dropdownMenu = button.nextElementSibling;
            if (dropdownMenu) {
                const isVisible = dropdownMenu.style.display === 'block';
                dropdownMenu.style.display = isVisible ? 'none' : 'block';
            }
        });
    });
   document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    });
}