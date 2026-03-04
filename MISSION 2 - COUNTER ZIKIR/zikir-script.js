
const counterNumber = document.getElementById('counterNumber');
const btnAdd = document.getElementById('btnAdd');
const btnReset = document.getElementById('btnReset');
const notificationArea = document.getElementById('notificationArea');

let currentCount = 0;
const targetCount = 33;

function updateDisplay() {
    counterNumber.textContent = currentCount;

    counterNumber.classList.remove('pulse');
    void counterNumber.offsetWidth;
    counterNumber.classList.add('pulse');
}

function checkTarget() {
    if (currentCount === targetCount) {
        showNotification();
    } else {
        hideNotification();
    }
}

function showNotification() {
    notificationArea.innerHTML = '<div class="notification"> Alhamdulillah! Target tercapai</div>';
}

function hideNotification() {
    notificationArea.innerHTML = '';
}

btnAdd.addEventListener('click', function() {
    currentCount++;
    updateDisplay();
    checkTarget();
    
    this.classList.add('active');
    setTimeout(() => {
        this.classList.remove('active');
    }, 200);
});

btnReset.addEventListener('click', function() {
    currentCount = 0;
    updateDisplay();
    hideNotification();
    
    this.classList.add('active');
    setTimeout(() => {
        this.classList.remove('active');
    }, 200);
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        btnAdd.click();
    }
    
    if (event.code === 'KeyR') {
        event.preventDefault();
        btnReset.click();
    }
});
updateDisplay();
