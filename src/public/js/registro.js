const inputNombre=document.getElementById("first_name");
const inputApellido=document.getElementById("last_name");
const inputEmail=document.getElementById("email");
const inputEdad=document.getElementById("age");
const inputPassword=document.getElementById("password");
const inputRol=document.getElementById("role");
const btnSubmit=document.getElementById("btnSubmit");
const divMensajes=document.getElementById("mensajes");


btnSubmit.addEventListener("click", async (e)=>{
    e.preventDefault()
    let first_name=inputNombre.value;
    let last_name=inputApellido.value;
    let email=inputEmail.value;
    let age=inputEdad.value;
    let password=inputPassword.value;
    let cart="";
    let role=inputRol.value;
    // if(!first_name || !last_name || !email || !password){
    if(!first_name || !email || !role || !password){
        alert("Complete los datos, Nombre, Apelildo, email, Password y Rol son obligatorios")
        return
    }
    // if(age<18){
    //     alert("Debe ser mayor de edad para registrarse en este sitio")
    //     return
    // }

    let body= {first_name, last_name, email, password, age, role}

    try {
        let respuesta = await fetch("/api/users/registro", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        let datos = await respuesta.json();

        if (respuesta.status >= 400) {
            divMensajes.textContent = datos.error;
            setTimeout(() => {
                divMensajes.textContent = "";
            }, 3000);
        } else {
            alert(datos.message);
            console.log("Usuario registrado:", datos.usuario);
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        alert("Ocurrió un error al registrarse. Por favor, intente nuevamente.");
    }
})