"use strict";

let e, d, n, l;

function validatePrime(prime, nameOfPrime) {
    if (!isPrime(prime)) {
        alert("'" + nameOfPrime + "' bukan bilangan prima. Input hanya menerima bilangan prima.");
        return false;
    }
    if (prime <= 7) {
        alert("'" + nameOfPrime + "' bilangan harus lebih besar dari 7 .");
        return false;
    }
    return true;
}

function calculate() {
    var p = document.getElementById("p").value;
    var q = document.getElementById("q").value;
    if (!(validatePrime(p, "p") && validatePrime(q, "q"))) return;
    n = p * q;
    document.getElementById("n").value = n;

    l = (p - 1) * (q - 1);
    document.getElementById("m").value = l;

    var es = findEncryptionKeys(l, n);
    document.getElementById("e").value = es[0];
    document.getElementById("enKeyListSpan").innerHTML = " Kunci enkripsi yang memungkinkan adalah: " + es;
    encryptorChanged();
}

function encryptorChanged() {
    e = document.getElementById("e").value;

    var ds = findDecryptionKeys(e, l);
    ds.splice(ds.indexOf(e), 1);  // Menghapus kunci enkripsi dari list 
    d = ds[0];
    document.getElementById("d").value = d;
    document.getElementById("deKeyListSpan").innerHTML = " Kunci dekripsi yang memungkinkan adalah: " + ds;

    document.getElementById("private-key").innerHTML = "(" + e + "," + n + ")";
    document.getElementById("public-key").innerHTML = "(" + d + "," + n + ")";
}

function decryptorChanged() {
    d = document.getElementById("d").value;
    document.getElementById("public-key").innerHTML = "(" + d + "," + n + ")";
}

function isPrime(num) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num !== 1;
}

function findEncryptionKeys(l, n) {
    var arr = [];
    for (var i = 2; i < l; i++) {
        if (isCoPrime(i, l) && isCoPrime(i, n))
            arr.push(i);
        if (arr.length > 5) break;
    }
    return arr;
}

function isCoPrime(a, b) {
    var aFac = findFactors(a);
    var bFac = findFactors(b);
    var result = aFac.every(x => bFac.indexOf(x) < 0);
    return result;
}

var hashtable = new Object();
function findFactors(num) {
    if (hashtable[num])
        return hashtable[num];

    var half = Math.floor(num / 2), // Memastikan seluruh bilangan <= num.
        result = [],
        i, j;

    //result.push(1); // 1 should be a part of every solution but for our purpose of COPRIME 1 should be excluded

    // Memastikan nilai increment dari looping dan ditik mulai
    num % 2 === 0 ? (i = 2, j = 1) : (i = 3, j = 2);

    for (i; i <= half; i += j) {
        num % i === 0 ? result.push(i) : false;
    }

    result.push(num); // Memasukan bilangan asli
    hashtable[num] = result;
    return result;
}

function findDecryptionKeys(e, l) {
    var ds = [];
    for (var x = l + 1; x < l + 100000; x++) {
        if (x * e % l === 1) {
            ds.push(x);
            if (ds.length > 5) return ds;
        }
    }
    return ds;
}

function encrypt() {
    var m = document.getElementById("message").value;
    var ascii = Array.from(Array(m.length).keys()).map(i => m.charCodeAt(i));
    document.getElementById("ascii").innerHTML = ascii;
    var encrypted = ascii.map(i => powerMod(i, e, n));
    document.getElementById("encrypted-msg").innerHTML = encrypted;
    document.getElementById("encrypted-msg-textbox").value = encrypted;
}

function decrypt() {
    var cipher = stringToNumberArray(document.getElementById("encrypted-msg-textbox").value);
    var ascii = cipher.map(i => powerMod(i, d, n));
    document.getElementById("ascii-decrypted").innerHTML = ascii;
    var message = "";
    ascii.map(x => message += String.fromCharCode(x));
    document.getElementById("decrypted-msg").innerHTML = message;
}

function stringToNumberArray(str) {
    return str.split(",").map(i => parseInt(i));
}

// Mengkalkalusi base^exponent % modulus
function powerMod(base, exponent, modulus) {
    if (modulus === 1) return 0;
    var result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1)  //angka ganjil
            result = (result * base) % modulus;
        exponent = exponent >> 1; //dibagi dengan 2
        base = (base * base) % modulus;
    }
    return result;
}