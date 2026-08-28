// game.js
document.addEventListener("DOMContentLoaded", () => {
    const timeLimit = 15 * 60; // 15 minutos en segundos
    let timeLeft = localStorage.getItem("escapeTimeLeft");

    // Iniciar temporizador si no existe
    if (!timeLeft) {
        timeLeft = timeLimit;
        localStorage.setItem("escapeTimeLeft", timeLeft);
    }

    const timerDisplay = document.getElementById("timer");

    const updateTimer = setInterval(() => {
        timeLeft--;
        localStorage.setItem("escapeTimeLeft", timeLeft);

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        
        if (timerDisplay) {
            timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            // Cambiar a rojo si quedan menos de 3 minutos
            if (timeLeft < 180) timerDisplay.style.color = "#ff4444"; 
        }

        if (timeLeft <= 0) {
            clearInterval(updateTimer);
            localStorage.removeItem("escapeTimeLeft");
            window.location.href = "gameover.html"; // Redirigir si pierden
        }
    }, 1000);
});

// Función para validar la puerta actual
function checkAnswer(correctAnswer, nextDoor) {
    const input = document.getElementById("answerInput").value.trim().toLowerCase();
    const errorMsg = document.getElementById("errorMessage");
    
    if (input === correctAnswer.toLowerCase()) {
        window.location.href = nextDoor;
    } else {
        errorMsg.style.display = "block";
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 500);
    }
}

// Agrega esto en tu game.js

function initPuzzle(correctWord, nextDoorUrl) {
    const container = document.getElementById("letter-slots");
    container.innerHTML = ""; // Limpiar contenedor
    
    // Generar una caja por cada letra
    for (let i = 0; i < correctWord.length; i++) {
        if (correctWord[i] === " ") {
            let space = document.createElement("span");
            space.style.width = "20px"; // Espacio entre palabras
            container.appendChild(space);
        } else {
            let input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.className = "letter-input";
            input.dataset.index = i;
            
            // Pasar automáticamente a la siguiente caja al escribir
            input.addEventListener("input", function() {
                if (this.value) {
                    let next = this.nextElementSibling;
                    while (next && next.tagName !== "INPUT") next = next.nextElementSibling;
                    if (next) next.focus();
                }
            });
            container.appendChild(input);
        }
    }

    // Sobreescribimos el botón para usar esta nueva lógica
    window.checkCurrentPuzzle = function() {
        let inputs = container.querySelectorAll(".letter-input");
        let allCorrect = true;
        let errorMsg = document.getElementById("errorMessage");

        inputs.forEach(input => {
            let letterIndex = input.dataset.index;
            let expectedLetter = correctWord[letterIndex].toLowerCase();
            let typedLetter = input.value.toLowerCase();

            if (typedLetter === expectedLetter) {
                input.classList.add("correct");
                input.disabled = true; // Bloquea la letra correcta
            } else {
                allCorrect = false;
                if (!input.classList.contains("correct")) {
                    input.value = ""; // Borra la letra si es incorrecta
                    input.classList.add("shake"); // Tiembla
                    setTimeout(() => input.classList.remove("shake"), 400);
                }
            }
        });

        if (allCorrect) {
            errorMsg.style.display = "none";
            setTimeout(() => window.location.href = nextDoorUrl, 600); // Redirige tras un breve éxito
        } else {
            errorMsg.style.display = "block";
            document.body.classList.add("shake");
            setTimeout(() => document.body.classList.remove("shake"), 500);
        }
    };
}