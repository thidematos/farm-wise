'use strict';

// ---------------------- Seletores ------------------------------

const hints = document.querySelector('.hints');
const hintsLi = document.querySelector('.hints-li');
const benefits = document.querySelector('#benefits');
const loading = document.querySelector('#loading');
const loadingLocal = document.querySelector('#loadingLocal');
const loadingPlantio = document.querySelector('#loadingPlantio');
const responses = document.querySelector('#responses');
const btnRecomendations = document.querySelector('#question');
const cardsContainer = document.querySelector('#cardsContainer');
const cards = document.querySelectorAll('.cards');
const mainCrud = document.querySelector(`#mainCrud`);
const radios = document.querySelectorAll('.radio');
const labels = document.querySelectorAll('label');
const weather = document.querySelector('#weather');
const weatherH2 = document.querySelector('.weather-h2');
const weatherLI = document.querySelector('.weather-li');
const plantio = document.querySelector('.plantio');
const plantioH2 = document.querySelector('.plantio-h2');
const plantioLi = document.querySelector('.plantio-li');
const btnPlantio = document.querySelector('#btnPlantio');
const btnTryAgain = document.querySelector('#tryAgain');
const navLinks = document.querySelectorAll('.nav-lin');
const btnPass = document.querySelectorAll('.btnPass');

// ------------------------ Main Functions -----------------------

let recomendation;

function fetchRecomendation(type, place, municipio) {
  fetch(`/type/${type}/place/${place}/mun/${municipio}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json.text);
      recomendation = json.text
        .replaceAll('\n', '')
        .replace('.', '')
        .replaceAll(' ', '')
        .split(',');
      console.log(recomendation);
    })
    .catch((error) => console.error('Error:', error))
    .finally(() => {
      hints.classList.remove('hidden');
      hintsLi.innerHTML = '';
      recomendation.forEach((e, i) => {
        let str = `<li class="recomendationLi">${i + 1} - ${e}</li>`;
        hintsLi.insertAdjacentHTML('beforeend', str);
        benefits.classList.remove('hidden');
      });
    });
}

function fetchWhy(recomendations, UF, mun) {
  recomendations.forEach((e, i) => {
    fetch(`/elementWhy/${e}/placeWhy/${UF}/munWhy/${mun}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.error?.message) {
          console.log(`erro`);
        } else {
          document.querySelector('.swiper').classList.remove('hidden');
          let strNew = `<div class="swiper-slide">
          <h4 class='swiper-h4'>${e}</h4>
          <p class="swiper-p ">${json.text}</p>
        </div>`;
          document
            .querySelector('.swiper-wrapper')
            .insertAdjacentHTML(`beforeend`, strNew);
        }
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => {
        if (i === recomendations.length - 1) {
          loading.classList.add('hidden');
          btnPlantio.classList.remove('hidden');
          const pagination = `<div class="swiper-pagination"></div>`;
          document
            .querySelector('.swiper-wrapper')
            .insertAdjacentHTML('afterend', pagination);
        }
      });
  });
}

function fetchWeather(UF, mun) {
  fetch(`/placeWeather/${UF}/munWeather/${mun}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.error?.message) {
        console.log(`erro`);
      } else {
        weather.classList.remove('hidden');
        weatherH2.classList.remove('hidden');
        let local = `<h3 class='cityName'>${mun} - ${UF}</h3>`;
        weatherH2.insertAdjacentHTML('afterend', local);
        let strNew = `<li class="cityText">${json.text}</li>`;
        weatherLI.insertAdjacentHTML(`beforeend`, strNew);
      }
      fetchImage(UF, mun);
    })
    .catch((error) => console.error('Error:', error))
    .finally(() => {
      loadingLocal.classList.add('hidden');
    });
}

function fetchImage(UF, mun) {
  const place = [mun, UF];
  const strPlace = place.join(',');
  let results;
  fetch(`/placeImage/${strPlace}`)
    .then((response) => response.json())
    .then((json) => {
      results = json;
      console.log(json);
      const newHTMLImg = `<img class= "w-full cityImg xl:w-1/2" src=${json[0]} alt="">`;
      weatherLI.insertAdjacentHTML('beforeend', newHTMLImg);
    })
    .finally(() => {
      let counter = 0;
      btnPass.forEach((e) => {
        e.addEventListener('click', () => {
          if (e.value === 'up' && counter < results.length - 1) {
            counter++;
            weatherLI.lastElementChild.src = results[counter];
          } else if (e.value === 'down' && counter > 0) {
            counter--;
            weatherLI.lastElementChild.src = results[counter];
          } else if (e.value === 'down' && counter === 0) {
            counter = results.length - 1;
            weatherLI.lastElementChild.src = results[counter];
          } else if (e.value === 'up' && counter === results.length - 1) {
            counter = 0;
            weatherLI.lastElementChild.src = results[counter];
          }
        });
      });
    });
}

function fetchPlant(recomendations, UF, mun) {
  recomendations.forEach((e, i) => {
    fetch(`/elementPlant/${e}/placePlant/${UF}/munPlant/${mun}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.error?.message) {
          console.log(`erro`);
        } else {
          document.querySelector('.swiperPlant').classList.remove('hidden');
          let strNew = `<div class="swiper-slide">
          <h4 class='swiper-h4'>${e}</h4>
          <p class="swiper-p">${json.text}</p>
        </div>`;
          document
            .querySelector('.swiper-wrapperPlant')
            .insertAdjacentHTML(`beforeend`, strNew);
        }
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => {
        if (i === recomendations.length - 1) {
          loadingPlantio.classList.add('hidden');
          btnTryAgain.classList.remove('hidden');
          const pagination = `<div class="swiper-pagination"></div>`;
          document
            .querySelector('.swiper-wrapperPlant')
            .insertAdjacentHTML('afterend', pagination);
        }
      });
  });
}

function reset() {
  //Resetting
  weather.classList.add('hidden');
  document.querySelector('.cityText')?.remove();
  document.querySelector('.cityName')?.remove();
  document.querySelector('.cityImg')?.remove();
  document.querySelectorAll('.recomendationLi')?.forEach((e) => {
    e.remove();
  });
  document.querySelectorAll('.swiper-slide')?.forEach((e) => {
    e.remove();
  });
  weatherH2.classList.add('hidden');
  hints.classList.add('hidden');
  benefits.classList.add('hidden');
  benefits.disabled = false;
  btnPlantio.classList.add('hidden');
  btnPlantio.disabled = false;
  btnTryAgain.classList.add('hidden');
  //End of Reset
}

// -------------------------- IBGE API --------------------------------

// UF
const selectUF = document.querySelector('#selectUF');

const urlUF = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`;
window.addEventListener('load', async () => {
  const request = await fetch(urlUF);
  const response = await request.json();
  const siglas = response
    .map((element) => {
      return element.sigla;
    })
    .sort();
  console.log(siglas);
  siglas.forEach((sigla) => {
    const html = `<option value="${sigla}">${sigla}</option>`;
    selectUF.insertAdjacentHTML('beforeend', html);
  });
});

// MUNICIPIOS

const selectCity = document.querySelector('#selectCity');
selectUF.addEventListener('change', async (e) => {
  selectCity.innerHTML =
    '<option value="default" disabled selected>Municipio</option>';
  const request = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${e.target.value}/municipios`
  );
  const response = await request.json();
  const municipios = response
    .map((e) => {
      return e.nome;
    })
    .sort();
  municipios.forEach((municipio) => {
    const html = `<option value="${municipio}">${municipio}</option>`;
    selectCity.insertAdjacentHTML('beforeend', html);
  });
});

// -----------------------------  BUTTONS  --------------------------------

// Selecting Types of Plants
labels.forEach((label) => {
  label.addEventListener('change', (e) => {
    labels.forEach((e) => {
      e.parentElement.classList.remove('selected');
    });
    console.log(e);
    e.target.parentElement.parentElement.classList.add('selected');
  });
});

// Main Crud Event
let checkedTarget;

mainCrud.addEventListener('submit', (e) => {
  e.preventDefault();
  reset();
  radios.forEach((e) => {
    if (e.checked) {
      checkedTarget = e.id;
    }
  });
  console.log(checkedTarget);
  const UF = selectUF.value;
  const mun = selectCity.value;
  loadingLocal.classList.remove('hidden');
  fetchWeather(UF, mun);
  fetchRecomendation(checkedTarget, UF, mun);
});

// Secondary Crud
benefits.addEventListener('click', (e) => {
  const UF = selectUF.value;
  const mun = selectCity.value;
  loading.classList.remove('hidden');
  fetchWhy(recomendation, UF, mun);
  benefits.disabled = true;
});

btnPlantio.addEventListener('click', (e) => {
  const UF = selectUF.value;
  const mun = selectCity.value;
  loadingPlantio.classList.remove('hidden');
  fetchPlant(recomendation, UF, mun);
  btnPlantio.disabled = true;
});

btnTryAgain.addEventListener('click', (e) => {
  reset();
  window.scrollTo(0, 0);
});
