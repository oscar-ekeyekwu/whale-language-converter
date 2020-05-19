//Get elements
const userInput = document.querySelector('#userInput'),
  form = document.querySelector('#inputForm'),
  resultPlaceholder = document.querySelector('#convertedInput');

//UI class
class UI {
  static addTranslatedToList(translatedObject) {
    resultPlaceholder.innerHTML += `
      <li class="translatedList" id="${translatedObject.translatedID}">
      Translation of (${translatedObject.input}) : 
        ${translatedObject.translated.toUpperCase()}
        
        <a href="#" class="delete u-pull-right">x</a>
      </li>    
    `;
  }
}
//convert to whale language
form.addEventListener('submit', (e) => {
  
  //show loader
  document.querySelector('#loading').style.display = 'block';

  //hide list display
  document.querySelector('.list-container').style.display = 'none';

  //settime out for display
  setTimeout(display, 2000);

  e.preventDefault();
});

//display translated
const display = () => {
  //validate input
  if (userInput.value === '' || userInput.value === null) {
    showAlert('Please provide an input', 'error');
  } else {
    const vowels = ['a', 'e', 'i', 'o', 'u'];

    //trim and split user input into words
    const input = userInput.value.trim();
    if (!checkInputForVowels(input, vowels)) {
      showAlert('Ensure that your Input contains vowels. ', 'error');
    } else {
      let translated = [];
      //loop through each words in the input
      for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < vowels.length; j++) {
          if (input[i] === vowels[j]) {
            translated.push(input[i]);
          }
        }
        if (input[i] === 'e') {
          translated.push(input[i]);
        }
        if (input[i] === 'u') {
          translated.push(input[i]);
        }
      }

      let translatedID = UniqueID.setID();

      let inputObject = {
        input,
        translated: translated.join(''),
        translatedID,
      };
      UI.addTranslatedToList(inputObject);
      showAlert('Input Has Been Translated', 'success');
      Store.storeTranslated(inputObject);
    }
  }

  clearField();
  //hide loader
  document.querySelector('#loading').style.display = 'none';
  
  //show list display
  document.querySelector('.list-container').style.display = 'block';
};
//check if input contains vowels
const checkInputForVowels = (input, vowels) => {
  let result;
  for (let i = 0; i < vowels.length; i++) {
    let vowel = vowels[i];
    switch (vowel) {
      case 'a':
        if (input.includes(vowel)) {
          result = true;
        }
        break;
      case 'e':
        if (input.includes(vowel)) {
          result = true;
        }
        break;
      case 'i':
        if (input.includes(vowel)) {
          result = true;
        }
        break;
      case 'o':
        if (input.includes(vowel)) {
          result = true;
        }
        break;
      case 'u':
        if (input.includes(vowel)) {
          result = true;
        }
        break;
      default:
        result = false;
        break;
    }
  }
  return result;
};

const showAlert = (message, className) => {
  //create alert div
  const div = document.createElement('div');
  div.className = `alert ${className}`;
  div.appendChild(document.createTextNode(message));

  //get containers
  const container = document.querySelector('.container');
  const row = document.querySelector('.row');

  //insert alert div
  container.insertBefore(div, row);

  //Timeout after 3s
  setTimeout(function () {
    document.querySelector('.alert').remove();
  }, 3000);
};
const clearField = () => {
  userInput.value = '';
};

//remove from UI
resultPlaceholder.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    e.target.parentElement.remove();
    showAlert('Removed!', 'success');
    Store.removeTranslated(parseInt(e.target.parentElement.getAttribute('id')));
  }
});

//store in LS
class Store {
  static getTranslated() {
    let translated;
    if (localStorage.getItem('translated') === null) {
      translated = [];
    } else {
      translated = JSON.parse(localStorage.getItem('translated'));
    }
    return translated;
  }
  static storeTranslated(translatedObject) {
    const translated = Store.getTranslated();
    translated.push(translatedObject);
    localStorage.setItem('translated', JSON.stringify(translated));
  }
  static displayTranslated() {
    const translated = Store.getTranslated();

    translated.forEach(function (item) {
      UI.addTranslatedToList(item);
    });
  }
  static removeTranslated(translatedID) {
    let translated = Store.getTranslated();
    translated.forEach((item, index) => {
      if (item.translatedID === translatedID) {
        translated.splice(index, 1);
      }
    });
    localStorage.setItem('translated', JSON.stringify(translated));
  }
}

//assign uiqueID
class UniqueID {
  static setID() {
    let randomID = Math.floor(Math.random() * 1000 + 1);

    if (this.getIDs(randomID) === 'exists' || this.getIDs(randomID) === '') {
      return randomID;
    }
  }

  //get all IDs of list and check if it already exist
  static getIDs(id) {
    let lists = document.querySelectorAll('.translatedList');

    let returnValue = '';
    lists.forEach((list) => {
      if (parseInt(list.getAttribute('id')) === id) {
        returnValue = 'exists';
      }
    });

    return returnValue;
  }
}

//display translated from LS
document.addEventListener('DOMContentLoaded', Store.displayTranslated);
