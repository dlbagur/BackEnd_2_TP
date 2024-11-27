const inputEmail=document.getElementById("email")
const inputPassword=document.getElementById("password")
const btnSubmit=document.getElementById("btnSubmit")
const divMensajes=document.getElementById("mensajes")

const params=new URLSearchParams(window.location.search)
let mensaje=params.get("mensaje")
if(mensaje){
    divMensajes.textContent=mensaje
    setTimeout(() => {
        divMensajes.textContent=""
    }, 3000);
}

btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

    let email = inputEmail.value;
    let password = inputPassword.value;
    if (!email || !password) {
        alert("Complete los datos de ingreso.");
        return;
    }

    const body = {
        email: email.toLowerCase(),
        password
    };

    let respuesta = await fetch("/api/users/login", {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (respuesta.status >= 400) {
        let { error } = await respuesta.json();
        alert(error);
        return;
    } else {
        let datos = await respuesta.json();
        console.log("datos: ", datos);
        localStorage.setItem('cartId', datos.cart);
        document.cookie = `cartId=${datos.cart}; path=/`;
        alert(datos.payload);
        window.location.href = "/";
    }
});
