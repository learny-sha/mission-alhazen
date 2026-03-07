const NISAB_GRAMS = 85;
const ZAKAT_RATE = 0.025; 

const zakatTypeSelect = document.getElementById('zakatType');
const goldPriceInput = document.getElementById('goldPrice');

const incomeForm = document.getElementById('incomeForm');
const monthlySalaryInput = document.getElementById('monthlySalary');
const otherIncomeInput = document.getElementById('otherIncome');

const goldForm = document.getElementById('goldForm');
const goldAmountInput = document.getElementById('goldAmount');

const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');

const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const resultCard = document.getElementById('resultCard');
const totalValue = document.getElementById('totalValue');
const nisabValue = document.getElementById('nisabValue');
const zakatStatus = document.getElementById('zakatStatus');
const zakatAmount = document.getElementById('zakatAmount');

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka);
}

function parseInputValue(input) {
    const value = parseFloat(input.value) || 0;
    return value < 0 ? 0 : value;
}


function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showResult() {
    resultCard.style.display = 'block';

    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function hideResult() {
    resultCard.style.display = 'none';
}

function switchForm() {
    const selectedType = zakatTypeSelect.value;
    
    if (selectedType === 'income') {
        incomeForm.style.display = 'block';
        goldForm.style.display = 'none';
    } else if (selectedType === 'gold') {
        incomeForm.style.display = 'none';
        goldForm.style.display = 'block';
    }
    
    hideResult();
    hideError();
}

function validateIncomeForm() {
    const goldPrice = parseInputValue(goldPriceInput);
    const monthlySalary = parseInputValue(monthlySalaryInput);
    const otherIncome = parseInputValue(otherIncomeInput);
    
    if (goldPrice <= 0) {
        showError('⚠️ Mohon masukkan harga emas per gram yang valid.');
        return false;
    }
    
    if (monthlySalary === 0 && otherIncome === 0) {
        showError('⚠️ Mohon masukkan minimal gaji bulanan atau penghasilan lain.');
        return false;
    }
    
    return true;
}

function validateGoldForm() {
    const goldPrice = parseInputValue(goldPriceInput);
    const goldAmount = parseInputValue(goldAmountInput);
    
    if (goldPrice <= 0) {
        showError('⚠️ Mohon masukkan harga emas per gram yang valid.');
        return false;
    }
    
    if (goldAmount <= 0) {
        showError('⚠️ Mohon masukkan jumlah emas yang Anda miliki dalam gram.');
        return false;
    }
    
    return true;
}

function calculateIncomeZakat() {
    if (!validateIncomeForm()) {
        return;
    }
   
    const goldPrice = parseInputValue(goldPriceInput);
    const monthlySalary = parseInputValue(monthlySalaryInput);
    const otherIncome = parseInputValue(otherIncomeInput);
    
    const totalMonthlyIncome = monthlySalary + otherIncome;
    
    const totalAnnualIncome = totalMonthlyIncome * 12;
    
    const nisab = goldPrice * NISAB_GRAMS;
    
    const isObligatory = totalAnnualIncome >= nisab;
    
    const zakatAmountValue = isObligatory ? totalAnnualIncome * ZAKAT_RATE : 0;
    displayResults(totalAnnualIncome, nisab, isObligatory, zakatAmountValue);
}

function calculateGoldZakat() {
    if (!validateGoldForm()) {
        return;
    }
    
    const goldPrice = parseInputValue(goldPriceInput);
    const goldAmount = parseInputValue(goldAmountInput);
    
    const totalGoldValue = goldAmount * goldPrice;
    
    const nisab = goldPrice * NISAB_GRAMS;
    
    const isObligatory = totalGoldValue >= nisab;
    
    const zakatAmountValue = isObligatory ? totalGoldValue * ZAKAT_RATE : 0;
    displayResults(totalGoldValue, nisab, isObligatory, zakatAmountValue);
}

function displayResults(total, nisab, isObligatory, zakatAmountValue) {
    hideError();
    
    totalValue.textContent = formatRupiah(total);
    nisabValue.textContent = formatRupiah(nisab);
    zakatAmount.textContent = formatRupiah(zakatAmountValue);
    
    if (isObligatory) {
        zakatStatus.textContent = 'Wajib Zakat';
        zakatStatus.className = 'badge status-badge obligatory';
    } else {
        zakatStatus.textContent = 'Tidak Wajib Zakat';
        zakatStatus.className = 'badge status-badge not-obligatory';
    }
    
    showResult();
}

function resetCalculator() {
    monthlySalaryInput.value = '0';
    otherIncomeInput.value = '0';
    goldAmountInput.value = '0';
    goldPriceInput.value = '1078000';
    
    zakatTypeSelect.value = 'income';
    switchForm();
    
    hideResult();
    hideError();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

zakatTypeSelect.addEventListener('change', switchForm);

calculateBtn.addEventListener('click', () => {
    const selectedType = zakatTypeSelect.value;
    
    if (selectedType === 'income') {
        calculateIncomeZakat();
    } else if (selectedType === 'gold') {
        calculateGoldZakat();
    }
});

resetBtn.addEventListener('click', resetCalculator);

const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.value < 0) {
            this.value = 0;
        }
    });
});

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        calculateBtn.click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    switchForm();
    
    goldPriceInput.value = '1078000';
    
    console.log('✅ Kalkulator Zakat berhasil diinisialisasi');
    console.log('📋 Menggunakan Bootstrap 5.3.0');
});
