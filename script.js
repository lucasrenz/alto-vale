function calculate() {
    var route = document.querySelector('.route-btn.selected').getAttribute('data-route');
    var distance = parseInt(document.getElementById("distance").value);
    var stops = parseInt(document.getElementById("stops").value);
    var result = document.getElementById("result");
    var total = 0;

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
            <li>DIÁRIA: R$ ${diaria.toFixed(2)}</li>
            <li>PARADAS: R$ ${stopsCost.toFixed(2)}</li>
            <li>-----------------------------------</li>
            <li>TOTAL: R$ ${total.toFixed(2)}</li>
            <li>Data do Cálculo ${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}</li>
        </ul>
    `;

    result.style.display = "block";
    document.querySelector('.calculator-container').style.backgroundColor = "#1a0d39";
}

function calculateNormalRoute(distance) {
    if (distance <= 100) {
        return 175.00;
    } else if (distance <= 150) {
        return 205.00;
    } else if (distance <= 200) {
        return 235.00;
    } else if (distance <= 250) {
        return 265.00;
    } else if (distance <= 300) {
        return 295.00;
    } else {
        return 325.00;
    }
}

function calculateLitoralRoute(distance) {
    var cost = 175.00;
    if (distance > 100) {
        cost += (distance - 100) * 0.80;
    }
    return cost;
}

function calculateStopsCost(stops) {
    var cost = 0;
    if (stops <= 60) {
        cost += stops * 0.50;
    } else if (stops <= 90) {
        cost += 60 * 0.50 + (stops - 60) * 1.20;
    } else {
        cost += 60 * 0.50 + 30 * 1.20 + (stops - 90) * 0.90;
    }
    return cost;
}

document.querySelectorAll('.route-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.route-btn').forEach(function(btn) {
            btn.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});
