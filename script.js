/* by kenzie */


// функция генерирует поле для ввода
function createFormInput(name) {
  const inputBox = document.createElement('div');
  const input = document.createElement('input');
  const inputLabel = document.createElement('label');
  const inputBtn = document.createElement('button');

  // styles
  inputBox.className = 'input-box input-group mb-4';
  input.type = 'tel';
  input.className = 'form-control input-filed';
  input.style.padding = '10px 15px 10px 15px';
  inputLabel.textContent = name;
  inputLabel.style.fontStyle = 'italic'
  inputBtn.textContent = '⛌';
  inputBtn.style.fontSize = '22px'
  inputBtn.style.padding = '0px 14px'
  inputBtn.style.zIndex = '1000'
  inputBtn.className = 'btn btn-danger';

  // очищаем поле при условии, что юзер подтвердит удаление
  inputBtn.addEventListener('click', (e) => {
    e.preventDefault();
    input.value = confirm('Очистить поле?') ? '' : input.value;
  });

  // добавим все элементы инпута в специальный контейнер
  inputBox.append(inputLabel, input, inputBtn);

  // вернем все в виде объекта с вспомогательными методами
  return {
    inputBox,
    input,
    inputLabel,
    inputBtn,
    calculate() { // метод вычисляет значение в инпуте
      return eval(this.input.value);
    },
    format() { // метод форматирует значение в инпуте
      let formatter = Intl.NumberFormat('ru');

      if (this.calculate()) {
        return formatter.format(this.calculate());
      }

      return 0;
    }
  }
}

// функция генерирует форму со всеми полями
function createForm() {
  const form = document.createElement('form');

  // const formInpChecksOAS = createFormInput('Чеки (ЗДУ)');
  // const formInpTurnoverOAS = createFormInput('Оборот (ЗДУ)');
  // const formInpChecks = createFormInput('Чеки');
  const formInpTurnover = createFormInput('Оборот');
  const formInpAcessories = createFormInput('Аксы');
  const formInpServices = createFormInput('Услуги');
  const formInstallingApps = createFormInput('Установка МПК');

  // тесты
  // formInpChecksOAS.input.value = '4'
  // formInpTurnoverOAS.input.value = '599+419'
  // formInpChecks.input.value = '10'
  // formInpTurnover.input.value = '201911'
  // formInpAcessories.input.value = '419+1274+4395+799+8000'
  // formInpServices.input.value = '599+999+1799+1990+4999'
  // formInstallingApps.input.value = '2'

  const formBtnWrapper = document.createElement('div');
  const formBtn = document.createElement('button');
  const formBtnClear = document.createElement('button');

  // formInpChecksOAS.input.placeholder = 'Количество чеков с заказом доп. услуг...';
  // formInpTurnoverOAS.input.placeholder = 'Оборот доп. услуг...'
  // formInpChecks.input.placeholder = 'Общее количество чеков...';
  formInpTurnover.input.placeholder = 'Общий оборот...';
  formInpAcessories.input.placeholder = '999+999+999...';
  formInpServices.input.placeholder = '999+999+999...';
  formInstallingApps.input.placeholder = 'Кол-во установленных приложений...'

  form.className = 'input-group mb-3 mt-4';
  formBtn.className = 'btn form-btn btn-success';
  formBtnClear.className = 'btn form-btn btn-danger mb-2 form-btn-clear';
  formBtnWrapper.style.width = '100%';
  formBtnClear.textContent = 'Очистить';
  formBtn.textContent = 'Скопировать и отправить';

  formBtnWrapper.append(formBtnClear, formBtn);
  form.append(/*formInpChecksOAS.inputBox, formInpTurnoverOAS.inputBox, formInpChecks.inputBox,*/ formInpTurnover.inputBox, formInpAcessories.inputBox, formInpServices.inputBox, formInstallingApps.inputBox, formBtnWrapper);

  return {
    form,
    // formInpChecksOAS,
    // formInpChecks,
    // formInpTurnoverOAS,
    formInpTurnover,
    formInpAcessories,
    formInpServices,
    formInstallingApps,
    formBtn,
    formBtnClear,
  }
}

// функция вычисляет процент значение от общего оборота продаж
const calculatePercentage = (a, b) => b / a * 100;

// функция очищает все поля при условии, что юзер подтвердит удаление
function clearInputs(inputsArray) {
  for (let i = 1; i <= inputsArray.length; i++) {
    inputsArray[i - 1].input.value = '';
  }
}

// блок с результатом
function showResult(value) {
  const resultBox = document.createElement('div');
  const resultText = document.createElement('div');

  resultText.textContent = value;
  resultText.style.fontStyle = 'italic'
  resultBox.style = 'mt-3'

  resultBox.append(resultText);

  return { resultBox, resultText };
}

// сборка приложения
const app = document.getElementById('app');
const appContainer = document.createElement('div'); // контейнер

const formGroup = document.createElement('div'); // обёртка для формы
const appForm = createForm(); // форма

// const checksOAS = appForm.formInpChecksOAS;
// const checks = appForm.formInpChecks;
// const turnoverOAS = appForm.formInpTurnoverOAS;
const turnover = appForm.formInpTurnover;
const acessories = appForm.formInpAcessories;
const services = appForm.formInpServices;
const installinggApps = appForm.formInstallingApps;
const nFilter = appForm.formInpNFilter;
const battery = appForm.formInpBattery;

appContainer.className = 'container';
formGroup.style.display = 'flex';

appContainer.append(appForm.form);
app.append(appContainer);

// при нажатии на "применить" выполняется вычисление, форматирование и копирование данных в буфер обмена
appForm.formBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const resultInfo = 
`Оборот: ${turnover.format()}
Аксы: ${acessories.format()} (${calculatePercentage(turnover.calculate(), acessories.calculate()).toFixed(2)}%)
Услуги: ${services.format()} (${calculatePercentage(turnover.calculate(), services.calculate()).toFixed(2)}%)
МПК: ${installinggApps.format()}`;

  // const result = showResult(resultInfo);
  // appContainer.append(result.resultBox);

  navigator.clipboard.writeText(resultInfo).then(function () {
    alert(`Данные успешно скопированы в буфер обмена!
Оборот: ${turnover.format()}
Аксы: ${acessories.format()} (${calculatePercentage(turnover.calculate(), acessories.calculate()).toFixed(2)}%)
Услуги: ${services.format()} (${calculatePercentage(turnover.calculate(), services.calculate()).toFixed(2)}%)
МПК: ${installinggApps.format()}`);
  }, function (err) {
    alert('Произошла ошибка при копировании текста: ', err);
  });


  window.open('https://t.me/share/url?url=' + encodeURIComponent(resultInfo), '_blank');
  
  console.log(resultInfo);
});

// при нажатии на "очистить" очищаем поля при подтверждении юзера
appForm.formBtnClear.addEventListener('click', (e) => {
  e.preventDefault();

  if (!confirm('Удалить все?')) return;
  clearInputs([/*checks,*/ installinggApps, turnover, acessories, services]);
});
