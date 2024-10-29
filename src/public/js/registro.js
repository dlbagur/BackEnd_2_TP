const inputNombre=document.getElementById("nombre");
const inputApellido=document.getElementById("apellido");
const inputEmail=document.getElementById("email");
const inputEdad=document.getElementById("edad");
const inputPassword=document.getElementById("password");
const inputRol=document.getElementById("rol");
const btnSubmit=document.getElementById("btnSubmit");
const divMensajes=document.getElementById("mensajes");

btnSubmit.addEventListener("click", async (e)=>{
    e.preventDefault()
    let nombre=inputNombre.value;
    let apellido=inputApellido.value;
    let email=inputEmail.value;
    let edad=inputEdad.value;
    let password=inputPassword.value;
    let cart="";
    let rol=inputRol.value;
    if(!nombre || !apellido || !email || !password){
        alert("Complete los datos")
        return
    }
    if(edad<18){
        alert("Debe ser mayor de edad para registrarse en este sitio")
        return
    }

    let body= {nombre, apellido, email, password, edad, rol}

    let respuesta = await fetch("/api/sessions/registro", {
        method: "post",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    })
    if (respuesta.status>=400){
        divMensajes.textContent=datos.error;
        setTimeout(()=> {
            divMensajes.textContent=""
        },3000)
    } else {
        let datos=await respuesta.json(9)
        alert(datos.payload)
    }
})