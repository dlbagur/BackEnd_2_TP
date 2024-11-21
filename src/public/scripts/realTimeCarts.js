const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página cargada correctamente");

    const cartsList = document.getElementById('carts-list');
    const irAlMenuBtn = document.getElementById('irAlMenu');

    // Inicializar eventos para menús desplegables
    function initializeDropdownEvents() {
        const dropdownButtons = document.querySelectorAll('.dropdown-btn');
        dropdownButtons.forEach((button, index) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                console.log(`Botón dropdown clickeado [${index}]`);

                const dropdownMenu = button.nextElementSibling;
                if (dropdownMenu) {
                    const isVisible = dropdownMenu.style.display === 'block';
                    dropdownMenu.style.display = isVisible ? 'none' : 'block';
                }
            });
        });

        // Cerrar todos los menús al hacer clic fuera
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        });
    }

    // Manejar clics en la lista de carritos
    if (cartsList) {
        cartsList.addEventListener('click', (e) => {
            const idCarrito = e.target.getAttribute('data-id');
            console.log(`Clic en carrito con ID: ${idCarrito}`);

            // Vaciar carrito
            if (e.target.classList.contains('delete-btn')) {
                socket.emit('vaciarCarrito', idCarrito);
            }
        });
    }

    // Botón "Volver al menú"
    if (irAlMenuBtn) {
        irAlMenuBtn.addEventListener('click', () => {
            window.location.href = "/";
        });
    }

    // Escuchar eventos de eliminación de carrito desde el servidor
    socket.on('vaciarCarritoR', (idCarrito) => {
        console.log(`Eliminar carrito con ID: ${idCarrito}`);
        const itemToRemove = cartsList.querySelector(`li[data-id="${idCarrito}"]`);
        if (itemToRemove) {
            cartsList.removeChild(itemToRemove);
        }
    });

    initializeDropdownEvents();
});
