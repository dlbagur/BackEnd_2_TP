Los datos ingresados corresponden a una Vinería, se clasifican por tipo de vino ("Tintos", "Blancos", "Rosados" y "Espumantes)

Se puede utilizar:
    localhost:8080/
    localhost:8080/realtimeproducts
    localhost:8080/api/products
    localhost:8080/api/products/?page=2&limit=10&sort=desc

    localhost:8080/api/products?category=Tintos
    localhost:8080/api/products?category=Blancos
    localhost:8080/api/products?category=Rosados
    localhost:8080/api/products?category=Espumantes
    localhost:8080/api/products?category=Tintos&inStock=true

inStock=true, muestra productos con stock>0
inStock=false o vacío, muestra todos los productos


El carrito hardcodeado es el : "66e62eb3a973a75814533678"
Productos hay:
"66dfa0edfdcce1b0bb143483" --> Sin stock
"66dfa0edfdcce1b0bb143486"
"66dfa0edfdcce1b0bb143488"

Para Post pueden utilizar la siguiente info, o usarla de modelo:

{"code":"Alamos Malbec", "category":"Tintos","title":"Catena Zapata", "description":"excelente vino tinto", "price":9000, "stock":10}

{"code":"Alamos Rosado", "category":"Rosados","title":"Catena Zapata", "description":"excelente vino rosado, muy fresco", "price":8500, "stock":10}


Atlas MongoDB
user: dlbagur
pwd: CoderCoder
