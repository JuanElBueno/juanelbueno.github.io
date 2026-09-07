var mapa = [0,0,0,0,0,0,0,0,0];
var jugador = 1;
var njugadores = 0;
var eleccion = 0;
var esquinas = [0,2,6,8];
var scoreX = 0, scoreO = 0, scoreDraw = 0;

function resetear() {
    document.getElementById("opcion1").removeAttribute("hidden");
    document.getElementById("opcion2").setAttribute("hidden", "hidden");
    document.getElementById("tablero").setAttribute("hidden", "hidden");
    document.getElementById("mensaje").setAttribute("hidden", "hidden");
    document.getElementById("final").innerHTML = '';
    document.getElementById("win-line").className = 'win-line';
    jugador = 1;
    njugadores = 0;
    eleccion = 0;
    mapa = [0,0,0,0,0,0,0,0,0];
    dibujar();
}

function jugadores(num) {
    njugadores = num;
    if (num == 1) {
        document.getElementById("opcion2").removeAttribute("hidden");
    } else {
        jugando(1);
    }
    document.getElementById("opcion1").setAttribute("hidden", "hidden");
}

function jugando(turno) {
    eleccion = turno;
    document.getElementById("tablero").removeAttribute("hidden");
    document.getElementById("opcion2").setAttribute("hidden", "hidden");
    document.getElementById("mensaje").removeAttribute("hidden");
    document.getElementById("mensaje").textContent = "Haz tu primer movimiento";
    document.getElementById("mensaje").className = "message";
    scoreX = 0; scoreO = 0; scoreDraw = 0;
    updateScore();
    jugador = 1;
    mapa = [0,0,0,0,0,0,0,0,0];
    dibujar();
    jugar();
}

function final() {
    var espacios = 0;
    for (var i = 0; i < mapa.length; i++) {
        if (mapa[i] == 0) espacios++;
    }
    for (var a = 0; a < 8; a += 3) {
        if (mapa[a] == mapa[a+1] && mapa[a+1] == mapa[a+2] && mapa[a] > 0) return mapa[a];
    }
    for (var b = 0; b < 3; b++) {
        if (mapa[b] == mapa[b+3] && mapa[b+3] == mapa[b+6] && mapa[b] > 0) return mapa[b];
    }
    if (mapa[0] == mapa[4] && mapa[4] == mapa[8] && mapa[0] > 0) return mapa[0];
    if (mapa[2] == mapa[4] && mapa[4] == mapa[6] && mapa[2] > 0) return mapa[2];
    if (espacios == 9) return 9;
    if (espacios == 0) return 0;
}

function dibujar() {
    for (var i = 0; i < 9; i++) {
        var cell = document.getElementById("celda" + i);
        cell.textContent = "";
        cell.className = "cell";
        if (mapa[i] == 1) {
            cell.textContent = "X";
            cell.classList.add("x");
        } else if (mapa[i] == 2) {
            cell.textContent = "O";
            cell.classList.add("o");
        }
    }
}

function updateScore() {
    document.getElementById("score-x").textContent = scoreX;
    document.getElementById("score-o").textContent = scoreO;
    document.getElementById("score-draw").textContent = scoreDraw;
}

function highlightWin(a, b, c) {
    ["celda" + a, "celda" + b, "celda" + c].forEach(function(id) {
        document.getElementById(id).classList.add("win-cell");
    });
}

function fcelda(celda) {
    if (mapa[celda] != 0) {
        document.getElementById("mensaje").textContent = "Esa celda ya está ocupada";
        document.getElementById("mensaje").className = "message";
        return;
    }

    if (njugadores == 1) {
        if (eleccion == jugador) document.getElementById("mensaje").textContent = "Juego yo";
        else document.getElementById("mensaje").textContent = "Juegas tú";
    } else {
        if (jugador == 1) document.getElementById("mensaje").textContent = "Turno del jugador 2";
        else document.getElementById("mensaje").textContent = "Turno del jugador 1";
    }
    document.getElementById("mensaje").className = "message";

    if (jugador == 1) {
        mapa[celda] = 1;
        jugador = 2;
    } else {
        mapa[celda] = 2;
        jugador = 1;
    }

    var cell = document.getElementById("celda" + celda);
    cell.classList.add("animated");
    setTimeout(function() { cell.classList.remove("animated"); }, 300);

    dibujar();

    var res = final();
    var msg = document.getElementById("mensaje");

    switch (res) {
        case 0:
            scoreDraw++;
            updateScore();
            msg.textContent = "Empate, no hay movimientos";
            msg.className = "message draw-msg";
            pregunta();
            break;
        case 1:
            scoreX++;
            updateScore();
            if (njugadores == 1) {
                msg.textContent = eleccion == 1 ? "Has ganado!!!" : "Ordenador gana";
            } else {
                msg.textContent = "Gana Jugador 1";
            }
            msg.className = "message win-msg";
            findWinLine(1);
            pregunta();
            break;
        case 2:
            scoreO++;
            updateScore();
            if (njugadores == 1) {
                msg.textContent = eleccion == 2 ? "Has ganado!!!" : "Ordenador gana";
            } else {
                msg.textContent = "Gana Jugador 2";
            }
            msg.className = "message win-msg";
            findWinLine(2);
            pregunta();
            break;
        default:
            if (njugadores == 1 && jugador != eleccion) { jugar(); }
    }
}

function findWinLine(num) {
    var lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (mapa[l[0]] == num && mapa[l[1]] == num && mapa[l[2]] == num) {
            highlightWin(l[0], l[1], l[2]);
            return;
        }
    }
}

function jugar() {
    if (eleccion == 2) {
        if (jugador != eleccion) {
            if (final() == 9) {
                fcelda(8);
            } else {
                if (!jugadaganadora(1)) {
                    if (!jugadaganadora(2)) {
                        if (esigual(mapa,[0,2,0,0,0,0,0,0,1]) || esigual(mapa,[0,0,0,2,0,0,0,0,1]) || esigual(mapa,[0,0,0,0,0,2,0,0,1])) fcelda(6);
                        else if (esigual(mapa,[0,0,0,0,0,0,0,2,1])) fcelda(2);
                        else if (esigual(mapa,[2,0,0,0,0,0,0,0,1]) || esigual(mapa,[0,0,2,0,0,0,0,0,1])) fcelda(6);
                        else if (esigual(mapa,[0,0,0,0,0,0,2,0,1])) fcelda(2);
                        else if (mapa[4] == 0) {
                            if (mapa[8] == 1 && (mapa[6] == 1 || mapa[2] == 1)) fcelda(4);
                        }
                        else if (esigual(mapa,[0,0,0,0,2,0,0,0,1])) fcelda(0);
                        else if (esigual(mapa,[1,0,2,0,2,0,0,0,1])) fcelda(6);
                        else if (esigual(mapa,[1,0,0,0,2,0,2,0,1])) fcelda(2);
                        else {
                            fcelda(mapa.indexOf(0));
                        }
                    }
                }
            }
        }
    } else if (jugador == 2) {
        if (!jugadaganadora(2)) {
            if (!jugadaganadora(1)) {
                if (mapa[4] == 0) fcelda(4);
                else if (esigual(mapa,[0,0,0,0,1,0,0,0,0])) fcelda(8);
                else if ((mapa[0] == 1 || mapa[2] == 1 || mapa[6] == 1 || mapa[8] == 1) && mapa[1] == 0) fcelda(1);
                else if ((mapa[0] == 1 || mapa[2] == 1 || mapa[6] == 1 || mapa[8] == 1) && mapa[3] == 0) fcelda(3);
                else if (esigual(mapa,[0,1,0,0,2,0,0,1,0]) || esigual(mapa,[0,0,0,1,2,1,0,0,0])) fcelda(2);
                else {
                    fcelda(mapa.indexOf(0));
                }
            }
        }
    }
}

function jugadaganadora(num) {
    var finalizado = false;
    var trio = [0,0,0];

    for (var a = 0; a < 8; a += 3) {
        trio[0] = mapa[a]; trio[1] = mapa[a+1]; trio[2] = mapa[a+2];
        var primera = trio.indexOf(num);
        var ultima = trio.lastIndexOf(num);
        var cero = trio.indexOf(0);
        if (primera != ultima && cero != -1) {
            fcelda(a + cero);
            return true;
        }
    }
    for (var b = 0; b < 3; b++) {
        trio[0] = mapa[b]; trio[1] = mapa[b+3]; trio[2] = mapa[b+6];
        var primeraa = trio.indexOf(num);
        var ultimaa = trio.lastIndexOf(num);
        var ceroa = trio.indexOf(0);
        if (primeraa != ultimaa && ceroa != -1) {
            fcelda(b + ceroa * 3);
            return true;
        }
    }
    trio[0] = mapa[0]; trio[1] = mapa[4]; trio[2] = mapa[8];
    var cerof = trio.indexOf(0);
    if (trio.indexOf(num) != trio.lastIndexOf(num) && cerof != -1) {
        fcelda(cerof * 4);
        return true;
    }
    trio[0] = mapa[2]; trio[1] = mapa[4]; trio[2] = mapa[6];
    cerof = trio.indexOf(0);
    if (trio.indexOf(num) != trio.lastIndexOf(num) && cerof != -1) {
        fcelda(2 * cerof + 2);
        return true;
    }
    return false;
}

function esigual(a1, a2) {
    var igual = true;
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] != a2[i]) igual = false;
    }
    return igual;
}

function pregunta() {
    document.getElementById("final").innerHTML =
        '<button type="button" onclick="replaySmooth()" class="btn-replay">Volver a jugar</button>';
}

function replaySmooth() {
    document.getElementById("win-line").className = 'win-line';
    mapa = [0,0,0,0,0,0,0,0,0];
    jugador = 1;
    dibujar();
    document.getElementById("mensaje").textContent = "Haz tu primer movimiento";
    document.getElementById("mensaje").className = "message";
    document.getElementById("final").innerHTML = '';
    if (njugadores == 1) jugar();
}
