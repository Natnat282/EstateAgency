document.addEventListener("DOMContentLoaded", function() {
    loadData();

    document.getElementById("plazo").addEventListener("input", function() {
        document.getElementById("plazoValor").innerText = this.value;
    });

    document.getElementById("calcular").addEventListener("click", function() {
        calcularCredito();
    });
    
});

function calcularCredito() {
    const email = document.getElementById("email").value;
    const nombre = document.getElementById("nombre").value;
    const fechaNacimientoInput = document.getElementById("fechaNacimiento").value;
    const salario = parseFloat(document.getElementById("salario").value);
    const tasaInteresAnual = parseFloat(document.getElementById("tasaInteres").value);
    const plazo = parseInt(document.getElementById("plazo").value) * 12; // Convertir años a meses
    const valorVivienda = parseFloat(document.getElementById("valorVivienda").value);

     // Verifica que la fecha de nacimiento no esté vacía
     if (!fechaNacimientoInput) {
        alert("Por favor, ingresa una fecha de nacimiento válida.");
        return;
    }

    const fechaNacimiento = new Date(fechaNacimientoInput);
    const montoSolicitar = valorVivienda * 0.80;

   
    const tm = tasaInteresAnual / 100; // Convertir a decimal

    const pm = (montoSolicitar * (tm / 12) * Math.pow(1 + (tm / 12), plazo)) / (Math.pow(1 + (tm / 12), plazo) - 1);

    const salarioMinimoRequerido = pm / 0.40;

    const edad = calcularEdad(fechaNacimiento);

    mostrarResultados(pm, salarioMinimoRequerido, salario, edad, montoSolicitar, valorVivienda);

    guardarDatos(email, nombre, fechaNacimiento, salario, tasaInteresAnual, plazo, valorVivienda);
    
    mostrarProyeccion(pm,tm,plazo,montoSolicitar);
}

function mostrarResultados(pm, salarioMinimoRequerido, salario, edad, montoSolicitar, valorVivienda) {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = `
        <h4>Crédito Happy Eart</h4>
        <p><strong>Correo Electrónico:</strong> ${document.getElementById("email").value}</p>
        <p><strong>Nombre:</strong> ${document.getElementById("nombre").value}</p>
        <p><strong>Fecha de Nacimiento:</strong> ${document.getElementById("fechaNacimiento").value}</p>
        <p><strong>Salario Neto Mensual:</strong> ${salario.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</p>
        <p><strong>Valor de la Vivienda:</strong> ${valorVivienda.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</p>
        <p><strong>Monto a Solicitar:</strong> ${montoSolicitar.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</p>
        <p><strong>Plazo en Años:</strong> ${document.getElementById("plazo").value}</p>
        <p><strong>Tasa Interés:</strong> ${document.getElementById("tasaInteres").value}%</p>
        <p><strong>Cuota:</strong> ${pm.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</p>
        <p><strong>Ingreso Neto Requerido:</strong> ${salarioMinimoRequerido.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</p>
        <p><strong>% a Financiar:</strong> ${(montoSolicitar / valorVivienda ).toFixed(2)}%</p>
        <p>${salario >= salarioMinimoRequerido ? "<strong>Monto de salario suficiente para el crédito</strong>" : "<strong>Monto de salario insuficiente</strong>"}</p>
        <p>${edad > 22 && edad < 55 ? "<strong>Cliente con edad suficiente para crédito</strong>" : "<strong>Cliente no califica para crédito por edad</strong>"}</p>
    `;
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function guardarDatos(email, nombre, fechaNacimiento, salario, tasaInteresAnual, plazo, valorVivienda) {
    localStorage.setItem("email", email);
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("fechaNacimiento", fechaNacimiento.toISOString());
    localStorage.setItem("salario", salario);
    localStorage.setItem("tasaInteres", tasaInteresAnual);
    localStorage.setItem("plazo", plazo);
    localStorage.setItem("valorVivienda", valorVivienda);
}

function loadData() {
    if (localStorage.getItem("email")) {
        document.getElementById("email").value = localStorage.getItem("email");
        document.getElementById("nombre").value = localStorage.getItem("nombre");
        document.getElementById("fechaNacimiento").value = localStorage.getItem("fechaNacimiento").substring(0, 10);
        document.getElementById("salario").value = localStorage.getItem("salario");
        document.getElementById("tasaInteres").value = localStorage.getItem("tasaInteres");
        document.getElementById("plazo").value = localStorage.getItem("plazo") / 12; // Convertir meses a años
        document.getElementById("valorVivienda").value = localStorage.getItem("valorVivienda");
    }   
}

function mostrarProyeccion(pagoMensual, tasaInteresAnual, plazo, saldoInicial) {
    const tablaCuerpo = document.getElementById("tablaCuerpo");
    tablaCuerpo.innerHTML = ""; 

    let saldo = saldoInicial;
    let tasaInteresMensual = tasaInteresAnual / 12; 

    for (let mes = 1; mes <= plazo; mes++) {
        let interes = saldo * tasaInteresMensual;
        let amortizacion = pagoMensual - interes;
        saldo -= amortizacion;

        // Crear una nueva fila y agregarla al cuerpo de la tabla
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${mes}</td>
            <td>${pagoMensual.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</td>
            <td>${interes.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</td>
            <td>${amortizacion.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</td>
            <td>${saldo.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</td>
        `;
        tablaCuerpo.appendChild(fila); 
    }
}