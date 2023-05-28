const inputQuestion = document.querySelector('#inputQuestion');
const answerIA = document.querySelector('#answer');
const formQuestion = document.querySelector('#formQuestion');
const mainPattern = document.querySelector('#mainPattern');
const loadingProsa = document.querySelector('#loadingProsa');
const suggestions = document.querySelectorAll('.btnIdea');
const sendCultivo = document.querySelectorAll('.sendCultivo');

answerIA.readOnly = true;
const patternQuestion = `Explique o papel do cooperativismo agrícola no Brasil, destacando suas principais características, benefícios e impacto na economia rural, por favor!`;

function patternAnswer(question) {
  fetch(`/pattern/${question}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.error?.message) {
        console.log(`Error: ${json.error?.message}`);
      } else if (json.text) {
        let str = `<p class="headerProsa">Wise:</p>
        <p class='pProsa'>${json.text}</p>`;
        mainPattern.insertAdjacentHTML('beforeend', str);
      }
    })
    .catch((error) => console.error('Error:', error))
    .finally(() => {
      loadingProsa.classList.add('hidden');
    });
}

function sendQuestion(question) {
  fetch(`/pattern/${question}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (answerIA.value) answerIA.value += '\n';
      if (json.error?.message) {
        answerIA.value += `Error: ${json.error.message}`;
      } else if (json.text) {
        let text = json.text.replaceAll('\n', '') || 'Sem resposta';
        if (text.includes('R:')) text = text.replace('R:', '');
        answerIA.value += '\nR: ' + text;
      }
    })
    .catch((error) => console.error('Error:', error))
    .finally(() => {
      inputQuestion.value = '';
      inputQuestion.disabled = false;
      inputQuestion.focus();
      suggestions.forEach((e) => {
        e.disabled = false;
      });
      sendCultivo.forEach((e) => {
        e.disabled = false;
      });
    });

  if (answerIA.value) answerIA.value += '\n\n\n';

  answerIA.value += `Eu: ${question}`;
  inputQuestion.value = 'Aguarde eu pensar em algo...';
  inputQuestion.disabled = true;
}

formQuestion.addEventListener('submit', (e) => {
  e.preventDefault();
  let question = inputQuestion.value;
  sendQuestion(question);
});

window.addEventListener('load', () => {
  loadingProsa.classList.remove(`hidden`);
  patternAnswer(patternQuestion);
});

suggestions.forEach((element) => {
  element.addEventListener('click', (e) => {
    const suggestedQuestion = e.target.textContent.replaceAll('\n', ' ').trim();
    console.log(suggestedQuestion);
    inputQuestion.value = suggestedQuestion;
    suggestions.forEach((element2) => {
      element2.disabled = true;
    });
    document.querySelector('#inputQuestion').scrollIntoView();
    sendQuestion(inputQuestion.value);
  });
});

sendCultivo.forEach((element) => {
  element.addEventListener('click', (e) => {
    if (element.previousElementSibling.value) {
      element.previousElementSibling.classList.remove('errorBorder');
      let suggestedQuestion =
        element.previousElementSibling.previousElementSibling.textContent.replace(
          '...',
          ' '
        ) + element.previousElementSibling.value;
      inputQuestion.value = suggestedQuestion;
      sendCultivo.forEach((element2) => {
        element2.disabled = true;
      });
      document.querySelector('#inputQuestion').scrollIntoView();
      sendQuestion(suggestedQuestion);
      element.previousElementSibling.value = '';
    } else {
      element.previousElementSibling.placeholder =
        'Insira algo à ser cultivado!';
      element.previousElementSibling.classList.add('errorBorder');
    }
  });
});
