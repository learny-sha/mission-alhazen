if (document.querySelector('.shalat-card')) {
    
    // DOM Elements - Shalat
    const shalatCheckboxes = document.querySelectorAll('.shalat-checkbox');
    const shalatProgressBar = document.getElementById('shalatProgress');
    const shalatPercentage = document.getElementById('shalatPercentage');
    const shalatStatus = document.getElementById('shalatStatus');
    const saveShalatBtn = document.getElementById('saveShalat');

    const targetPagesInput = document.getElementById('targetPages');
    const readPagesInput = document.getElementById('readPages');
    const targetCompleteCheckbox = document.getElementById('targetComplete');
    const quranProgressBar = document.getElementById('quranProgress');
    const quranPercentage = document.getElementById('quranPercentage');
    const quranStatus = document.getElementById('quranStatus');
    const saveQuranBtn = document.getElementById('saveQuran');

    const dailyProgress = document.getElementById('dailyProgress');
    const dailyStatus = document.getElementById('dailyStatus');

    const successMessage = document.getElementById('successMessage');

    function calculateShalatProgress() {
        const totalShalat = shalatCheckboxes.length;
        let completedShalat = 0;

        shalatCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                completedShalat++;
            }
        });

        const percentage = Math.round((completedShalat / totalShalat) * 100);
        
        shalatProgressBar.style.width = percentage + '%';
        shalatPercentage.textContent = percentage + '%';

        if (percentage === 0) {
            shalatStatus.textContent = 'Belum optimal';
        } else if (percentage <= 40) {
            shalatStatus.textContent = 'Belum optimal';
        } else if (percentage <= 80) {
            shalatStatus.textContent = 'Cukup baik';
        } else if (percentage < 100) {
            shalatStatus.textContent = 'Hampir lengkap';
        } else {
            shalatStatus.textContent = 'MasyaAllah lengkap! 🌟';
        }

        saveShalatToLocalStorage();
        
        updateDailyProgress();

        return percentage;
    }

    function saveShalatToLocalStorage() {
        const shalatData = {};
        shalatCheckboxes.forEach(checkbox => {
            const shalatName = checkbox.getAttribute('data-shalat');
            shalatData[shalatName] = checkbox.checked;
        });
        localStorage.setItem('shalatData', JSON.stringify(shalatData));
    }

    function loadShalatFromLocalStorage() {
        const savedData = localStorage.getItem('shalatData');
        if (savedData) {
            const shalatData = JSON.parse(savedData);
            shalatCheckboxes.forEach(checkbox => {
                const shalatName = checkbox.getAttribute('data-shalat');
                if (shalatData[shalatName]) {
                    checkbox.checked = true;
                }
            });
            calculateShalatProgress();
        }
    }

    function calculateQuranProgress() {
        const target = parseFloat(targetPagesInput.value) || 0;
        const read = parseFloat(readPagesInput.value) || 0;
        const isComplete = targetCompleteCheckbox.checked;

        let percentage = 0;

        if (isComplete) {
            percentage = 100;
        } else if (target > 0) {
            percentage = Math.min(Math.round((read / target) * 100), 100);
        }

        quranProgressBar.style.width = percentage + '%';
        quranPercentage.textContent = percentage + '%';

        if (percentage === 0) {
            quranStatus.textContent = 'Masih bisa ditambah';
        } else if (percentage < 50) {
            quranStatus.textContent = 'Masih bisa ditambah';
        } else if (percentage < 90) {
            quranStatus.textContent = 'Hampir selesai, semangat!';
        } else if (percentage < 100) {
            quranStatus.textContent = 'Hampir selesai, semangat!';
        } else {
            quranStatus.textContent = 'Target tercapai! 🌟';
        }

        saveQuranToLocalStorage();
        updateDailyProgress();

        return percentage;
    }

    function saveQuranToLocalStorage() {
        const quranData = {
            target: targetPagesInput.value,
            read: readPagesInput.value,
            complete: targetCompleteCheckbox.checked
        };
        localStorage.setItem('quranData', JSON.stringify(quranData));
    }

    function loadQuranFromLocalStorage() {
        const savedData = localStorage.getItem('quranData');
        if (savedData) {
            const quranData = JSON.parse(savedData);
            targetPagesInput.value = quranData.target || 20;
            readPagesInput.value = quranData.read || 0;
            targetCompleteCheckbox.checked = quranData.complete || false;
            calculateQuranProgress();
        }
    }

    function updateDailyProgress() {
        const shalatPerc = calculateShalatProgress();
        const quranPerc = calculateQuranProgress();
        
        const average = Math.round((shalatPerc + quranPerc) / 2);
        
        dailyProgress.textContent = average + '%';

        if (average === 0) {
            dailyStatus.textContent = 'Belum ada aktivitas';
        } else if (average < 40) {
            dailyStatus.textContent = 'Mulai dengan baik';
        } else if (average < 70) {
            dailyStatus.textContent = 'Terus tingkatkan';
        } else if (average < 100) {
            dailyStatus.textContent = 'Sangat baik!';
        } else {
            dailyStatus.textContent = 'Sempurna! MasyaAllah 🌟';
        }
    }

    function showSuccessMessage() {
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }

    shalatCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateShalatProgress);
    });

    targetPagesInput.addEventListener('input', calculateQuranProgress);
    readPagesInput.addEventListener('input', calculateQuranProgress);
    targetCompleteCheckbox.addEventListener('change', calculateQuranProgress);

    saveShalatBtn.addEventListener('click', () => {
        saveShalatToLocalStorage();
        showSuccessMessage();
    });

    saveQuranBtn.addEventListener('click', () => {
        saveQuranToLocalStorage();
        showSuccessMessage();
    });
    loadShalatFromLocalStorage();
    loadQuranFromLocalStorage();
    updateDailyProgress();
}

if (document.querySelector('.puasa-card')) {
    
    // DOM Elements
    const currentDayElement = document.getElementById('currentDay');
    const todayFastingCheckbox = document.getElementById('todayFasting');
    const calendarGrid = document.getElementById('calendarGrid');
    const puasaProgressBar = document.getElementById('puasaProgressBar');
    const puasaPercentage = document.getElementById('puasaPercentage');
    const puasaDays = document.getElementById('puasaDays');
    const puasaStatusText = document.getElementById('puasaStatusText');
    const puasaProgress = document.getElementById('puasaProgress');
    const puasaStatus = document.getElementById('puasaStatus');
    const savePuasaBtn = document.getElementById('savePuasa');
    const successMessage = document.getElementById('successMessage');

    let currentDay = parseInt(localStorage.getItem('currentRamadhanDay')) || 1;
    
    let fastingData = JSON.parse(localStorage.getItem('fastingData')) || {};

    function generateCalendar() {
        calendarGrid.innerHTML = '';
        
        for (let day = 1; day <= 30; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (fastingData[day]) {
                dayElement.classList.add('completed');
            }
            
            const dayNumber = document.createElement('span');
            dayNumber.className = 'day-number-cal';
            dayNumber.textContent = day;
            
            dayElement.appendChild(dayNumber);
            
            dayElement.addEventListener('click', () => {
                toggleFastingDay(day);
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }

    function toggleFastingDay(day) {
        if (fastingData[day]) {
            delete fastingData[day];
        } else {
            fastingData[day] = true;
        }
        
        saveFastingData();
        generateCalendar();
        updateProgress();
    }

    function updateProgress() {
        const completedDays = Object.keys(fastingData).length;
        const percentage = Math.round((completedDays / 30) * 100);
        
        puasaProgressBar.style.width = percentage + '%';
        puasaPercentage.textContent = percentage + '%';
        puasaDays.textContent = completedDays;
        puasaProgress.textContent = percentage + '%';

        if (percentage === 0) {
            puasaStatusText.textContent = 'Awal yang baik, tetap semangat!';
            puasaStatus.textContent = 'Awal yang baik';
        } else if (percentage <= 30) {
            puasaStatusText.textContent = 'Awal yang baik, tetap semangat!';
            puasaStatus.textContent = 'Awal yang baik';
        } else if (percentage <= 70) {
            puasaStatusText.textContent = 'Konsisten, pertahankan! 💪';
            puasaStatus.textContent = 'Konsisten';
        } else if (percentage < 100) {
            puasaStatusText.textContent = 'Sedikit lagi selesai, semangat! 🌟';
            puasaStatus.textContent = 'Sedikit lagi';
        } else {
            puasaStatusText.textContent = 'MasyaAllah, Ramadhan penuh tercapai! 🎉';
            puasaStatus.textContent = 'Sempurna!';
        }
    }

    function updateCurrentDay() {
        currentDayElement.textContent = currentDay;
        
        // Check if today is already marked
        if (fastingData[currentDay]) {
            todayFastingCheckbox.checked = true;
        } else {
            todayFastingCheckbox.checked = false;
        }
    }

    function saveFastingData() {
        localStorage.setItem('fastingData', JSON.stringify(fastingData));
    }

    function saveCurrentDay() {
        localStorage.setItem('currentRamadhanDay', currentDay);
    }

    function showSuccessMessage() {
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }

    // Today fasting checkbox
    todayFastingCheckbox.addEventListener('change', () => {
        if (todayFastingCheckbox.checked) {
            fastingData[currentDay] = true;
        } else {
            delete fastingData[currentDay];
        }
        
        saveFastingData();
        generateCalendar();
        updateProgress();
    });

    // Save button
    savePuasaBtn.addEventListener('click', () => {
        saveFastingData();
        saveCurrentDay();
        showSuccessMessage();
    });

    generateCalendar();
    updateCurrentDay();
    updateProgress();
}

console.log('✅ Ramadhan To-Do List berhasil dimuat');
console.log('🌙 Ramadhan Mubarak 1446 H');
