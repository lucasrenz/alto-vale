function selectRoute(button) {
    var routeButtons = document.querySelectorAll('.route-btn');
    routeButtons.forEach(function(btn) {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');
}

function calculateNormalRoute(distance) {
    if (distance <= 100) {
        return 175;
    } else if (distance <= 150) {
        return 205;
    } else if (distance <= 200) {
        return 235;
    } else if (distance <= 250) {
        return 265;
    } else if (distance <= 300) {
        return 295;
    } else {
        return 325;
    }
}

function calculateLitoralRoute(distance) {
    var baseCost = 175;
    var extraCostPerKm = 0.8;
    var extraDistance = distance - 100;
    if (extraDistance <= 0) {
        return baseCost;
    } else {
        return baseCost + (extraDistance * extraCostPerKm);
    }
}

function calculateStopsCost(stops) {
    var cost = 0;
    if (stops <= 60) {
        cost += stops * 0.5;
    } else if (stops <= 90) {
        cost += 60 * 0.5;
        cost += (stops - 60) * 1.20;
    } else {
        cost += 60 * 0.5;
        cost += 30 * 1.20;
        cost += (stops - 90) * 0.90;
    }
    return cost;
}

function calculate() {
    var selectedRouteButton = document.querySelector('.route-btn.selected');

    if (!selectedRouteButton) {
        alert("Por favor, escolha uma rota.");
        return;
    }

    var route = selectedRouteButton.getAttribute('data-route');
    var distanceInput = document.getElementById("distance");
    var stopsInput = document.getElementById("stops");

    var distance = parseFloat(distanceInput.value);
    var stops = parseInt(stopsInput.value);

    if (isNaN(distance) || isNaN(stops)) {
        alert("Por favor, preencha a distância e o número de paradas corretamente.");
        return;
    }

    var result = document.getElementById("result");
    var calculateBtn = document.getElementById("calculate-btn");
    var newCalculationBtn = document.getElementById("new-calculation-btn");
    var overlay = document.getElementById("overlay");
    var total = 0;

    calculateBtn.disabled = true;
    overlay.style.display = "block";
    showLoading();

    setTimeout(function() {
        if (route === "normal") {
            total += calculateNormalRoute(distance);
        } else if (route === "litoral") {
            total += calculateLitoralRoute(distance);
        }

        total += calculateStopsCost(stops);

        var currentDate = new Date();

        var diaria = (route === "normal") ? calculateNormalRoute(distance) : calculateLitoralRoute(distance);
        var stopsCost = calculateStopsCost(stops);

        result.innerHTML = `
            <ul>
                <li style="font-size: 14px;">KM Rodados: <span style="font-weight: bold; color: black;">R$ ${diaria.toFixed(2)}</li>
                <li style="font-size: 14px;">Paradas: <span style="font-weight: bold; color: black;">R$ ${stopsCost.toFixed(2)}</li>
                <li>--------------------------------------------------------</li>
                <li style="font-size: 14px;">Total: <span style="font-weight: bold; color: black;">R$ ${total.toFixed(2)}</span></li>
                <li style="font-size: 11px;">Data do Cálculo ${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}</li>
            </ul>
        `;

        result.style.display = "block";

        newCalculationBtn.style.display = "inline";

        calculateBtn.disabled = false; // Reativar o botão de cálculo
        overlay.style.display = "none"; // Remover o overlay
        removeLoading(); // Remover o ícone de carregamento

    }, 2000); // 2 segundos de atraso antes de mostrar o resultado
}

function showLoading() {
    var loadingIcon = document.createElement("div");
    loadingIcon.classList.add("loading-icon");
    document.body.appendChild(loadingIcon);
}

function removeLoading() {
    var loadingIcon = document.querySelector(".loading-icon");
    if (loadingIcon) {
        loadingIcon.remove();
    }
}

function resetCalculator() {
    document.getElementById("calculator").reset();
    document.getElementById("result").style.display = "none";
    document.getElementById("new-calculation-btn").style.display = "none";
    document.querySelector('.route-btn.selected').classList.remove('selected'); // Remover seleção de rota
}
