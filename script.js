// ---------------------------- UTILIDADES ----------------------------

function mod(n, m) {
    return ((n % m) + m) % m;
}

function gcd(a, b) {
    while (b) [a, b] = [b, a % b];
    return a;
}

function inversoModular(a, m) {
    a = mod(a, m);
    for (let x = 1; x < m; x++) {
        if (mod(a * x, m) === 1) return x;
    }
    return null;
}

// ---------------------- PROCESAR MENSAJE SIN ESPACIOS ----------------------
// 235711 → [23, 57, 11]
function convertirCadenaANumeros(cadena) {
    let arr = [];
    let buffer = "";

    for (let c of cadena) {
        if (!isNaN(c)) {
            buffer += c;

            // cada 2 dígitos se forma un número primo
            if (buffer.length === 2) {
                arr.push(parseInt(buffer));
                buffer = "";
            }
        }
    }

    // si queda un dígito suelto al final
    if (buffer.length === 1) arr.push(parseInt(buffer));

    return arr;
}

// ------------------------------ ENCRIPTAR ------------------------------

function encriptar() {
    let msg = document.getElementById("mensaje").value.trim();

    if (msg.length === 0) {
        alert("Ingresa números (ej: 23571113)");
        return;
    }

    // CONVERTIR AUTOMÁTICAMENTE SIN ESPACIOS
    let numeros = convertirCadenaANumeros(msg);

    // módulo = número máximo + 1
    let M = Math.max(...numeros) + 1;

    let a = parseInt(document.getElementById("k11").value);
    let b = parseInt(document.getElementById("k12").value);
    let c = parseInt(document.getElementById("k21").value);
    let d = parseInt(document.getElementById("k22").value);

    let det = a * d - b * c;

    if (gcd(det, M) !== 1) {
        alert("La matriz NO es invertible mod " + M);
        return;
    }

    if (numeros.length % 2 === 1) numeros.push(0); // relleno

    let resultado = [];

    for (let i = 0; i < numeros.length; i += 2) {
        let x = numeros[i];
        let y = numeros[i + 1];

        let e1 = mod(a * x + b * y, M);
        let e2 = mod(c * x + d * y, M);

        resultado.push(e1, e2);
    }

    document.getElementById("resultado").innerText = resultado.join(" ");
}

// ----------------------------- DESENCRIPTAR -----------------------------

function desencriptar() {
    let msg = document.getElementById("resultado").innerText.trim();
    if (!msg) {
        alert("No hay mensaje encriptado.");
        return;
    }

    let numeros = msg.split(" ").map(n => parseInt(n));
    let M = Math.max(...numeros) + 1;

    let a = parseInt(document.getElementById("k11").value);
    let b = parseInt(document.getElementById("k12").value);
    let c = parseInt(document.getElementById("k21").value);
    let d = parseInt(document.getElementById("k22").value);

    let det = mod(a * d - b * c, M);
    let detInv = inversoModular(det, M);

    if (detInv === null) {
        alert("La matriz NO es invertible mod " + M);
        return;
    }

    let ai = mod(detInv * d, M);
    let bi = mod(detInv * -b, M);
    let ci = mod(detInv * -c, M);
    let di = mod(detInv * a, M);

    let resultado = [];

    for (let i = 0; i < numeros.length; i += 2) {
        let x = numeros[i];
        let y = numeros[i + 1];

        let r1 = mod(ai * x + bi * y, M);
        let r2 = mod(ci * x + di * y, M);

        resultado.push(r1, r2);
    }

    // output sin espacios
    document.getElementById("resultadoDes").innerText = resultado.join("");
}

// ----------------------------- EVENTOS -----------------------------

document.getElementById("encriptar").addEventListener("click", encriptar);
document.getElementById("desencriptar").addEventListener("click", desencriptar);
