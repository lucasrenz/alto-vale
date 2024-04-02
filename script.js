function selectRoute(button) {
    var routeButtons = document.querySelectorAll('.route-btn');
    routeButtons.forEach(function(btn) {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');
}

function selectVehicle(button) {
    var vehicleButtons = document.querySelectorAll('.vehicle-btn');
    vehicleButtons.forEach(function(btn) {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');
}

function calculateCarroPasseioSapucaia(distance) {
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

function calculateCarroPasseioCapao(distance) {
    if (distance <= 100) {
        return 175;
    } else {
        return 175 + (distance - 100) * 0.80;
    }
}

function calculateCarroUtilitario(distance) {
    if (distance <= 100) {
        return 230;
    } else if (distance <= 150) {
        return 260;
    } else if (distance <= 200) {
        return 290;
    } else if (distance <= 250) {
        return 320;
    } else if (distance <= 300) {
        return 350;
    } else {
        return 410;
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

function calculateEarnings(route, vehicle, distance, stops) {
    var earnings = 0;

    if (route === "sapucaia") {
        if (vehicle === "passeio") {
            earnings += calculateCarroPasseioSapucaia(distance);
        } else if (vehicle === "utilitario") {
            earnings += calculateCarroUtilitario(distance);
        }
    } else if (route === "capao" && vehicle === "passeio") {
        earnings += calculateCarroPasseioCapao(distance);
    } else {
        alert("Rota em Capão da Canoa disponível para cálculo apenas com veículo de passeio. Contate o gestor da calculadora para correção.");
    }

    earnings += calculateStopsCost(stops);

    return earnings;
}

function calculate() {
    var selectedRouteButton = document.querySelector('.route-btn.selected');
    var selectedVehicleButton = document.querySelector('.vehicle-btn.selected');

    if (!selectedRouteButton) {
        alert("Por favor, escolha uma rota.");
        return;
    }

    if (!selectedVehicleButton) {
        alert("Por favor, escolha um tipo de veículo.");
        return;
    }

    var route = selectedRouteButton.getAttribute('data-route');
    var vehicle = selectedVehicleButton.getAttribute('data-vehicle');
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

    calculateBtn.disabled = true;
    overlay.style.display = "block";
    showLoading();

    setTimeout(function() {
        var total = calculateEarnings(route, vehicle, distance, stops);
        var totalKM = distance > 100 ? distance : 100; // Mínimo de 100km para calcular o valor por km
        var totalStopsCost = calculateStopsCost(stops);
        var totalValuePerKM = total / totalKM;
        var currentDate = new Date();

        result.innerHTML = `
            <ul>
                <li style="font-size: 14px;">KM Rodados: <span style="font-weight: bold; color: black;">R$ ${total.toFixed(2)}</span></li>
                <li style="font-size: 14px;">Paradas: <span style="font-weight: bold; color: black;">R$ ${totalStopsCost.toFixed(2)}</span></li>
                <li style="font-size: 14px;">Total: <span style="font-weight: bold; color: black;">R$ ${(total + totalStopsCost).toFixed(2)}</span></li>
                <li style="font-size: 14px;">Valor por KM: <span style="font-weight: bold; color: black;">R$ ${totalValuePerKM.toFixed(2)}</span></li>
                <li style="font-size: 12px;">Data do Cálculo ${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}</li>
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
    document.querySelector('.vehicle-btn.selected').classList.remove('selected'); // Remover seleção de veículo
}
