// Functions remaining:
// 1. Delete each link over 10th if there is more than 10 pairs !!-- DONE --!!
// 2. Realise copy button functionality
// 3. Add a tag to a short link(and a CSS styling) !!-- DONE --!!
// 4. Work on required validation from a task(show error states if field is empty) !!-- DONE --!! + regex validation
// 5. Change an order of showing new pair !!-- DONE --!!
// 6. Add removing error states on type !!-- DONE --!!


const form = document.querySelector('form');
const inputField = document.querySelector('input[type="text"]');
const errorMessage = document.getElementById('errormessage');
const linkField = document.querySelector('.linkfield');
const links = document.querySelector('.links');

const addErrorState = (errorMessage, inputField) => {
  if (errorMessage.classList.contains('hidden') && !inputField.classList.contains('error')) {
    errorMessage.classList.remove('hidden');
    inputField.classList.add('error');
  }
}

const removeErrorState = (errorMessage, inputField) => {
  if (!errorMessage.classList.contains('hidden') && inputField.classList.contains('error')) {
    errorMessage.classList.add('hidden');
    inputField.classList.remove('error');
  }
}

const validatePattern = (string) => {
  const pattern = /([a-z]+\.[a-z]+)/g;
  let check = pattern.exec(string);
  return check;
}

// Copies link and changes button's look for a 2 seconds to show that the link is copied!

const copyLink = (e) => {
  const newLink = e.target.parentNode.querySelector('.newlink').textContent;
  navigator.clipboard.writeText(newLink);

  e.target.textContent = 'Copied!';
  e.target.classList.add('copied');

  setTimeout(() => {
    e.target.textContent = 'Copy';
    e.target.classList.remove('copied');
  }, 2000)
}

// Little UI sweet. Removes an error state when you enter anything into input

form.addEventListener('keydown', (e) => {
  if (!inputField.value) {
    removeErrorState(errorMessage, inputField)
  } else if ((inputField.classList.contains('error')) && (e.key === 'Backspace')) { // Deletes whole string if it doesn't fit the format
    inputField.value = '';
    removeErrorState(errorMessage, inputField)
  }
});

// Main function. Adds Submit event listener and sends API request 
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let input = inputField.value;
  input = input.toLowerCase();

  console.log(input);

  if (!input) {
    addErrorState(errorMessage, inputField);
    errorMessage.textContent = 'Empty string';
  } else if (!validatePattern(input)) {
    addErrorState(errorMessage, inputField);
    errorMessage.textContent = 'Wrong format of link';
  } else {
    removeErrorState(errorMessage, inputField);

    const inputUrl = input.includes('https://') ? input : `https://${input}`;
    const shortUrl = await getData(inputUrl);


    if (shortUrl) {
      localStorage.setItem(`longLink${localStorage.length}`, inputUrl);
      localStorage.setItem(`shortLink${localStorage.length - 1}`, shortUrl);
      createField(localStorage.getItem(`longLink${localStorage.length - 2}`), localStorage.getItem(`shortLink${localStorage.length - 2}`));
      inputField.value = '';
    } else {
      addErrorState(errorMessage, inputField);
      errorMessage.textContent = 'Too many requests or wrong request!';
    }

    if (links.childElementCount > 10) {  // Checks if there is more than 10 child elements(11 with form) and deletes last one
      const lastElement = links.lastChild;
      links.removeChild(lastElement);
    }
  }
})


// Receiving short link from an API 

const getData = async (inputUrl) => {
  const url = 'https://spoo.me/';
  const data = new URLSearchParams();
  data.append('url', inputUrl);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: data
    });

    if (response.ok) {
      result = await response.json();
      const link = await result.short_url;
      console.log(link);
      return await link;
    }
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
  }
};

// Creating a field with an old/new link pair

const createField = (oldLink, newLink) => {
  const linkInner = document.querySelector('.linkinner');
  if (newLink) {
    const fieldBody = ` <div class="linkinner">
                        <p class="oldlink">${oldLink.slice(8)}</p>
                        <div class="line"></div>
                        <a href="${newLink}" class="newlink" target="_blank">${newLink}</a>
                      </div>
                      <button class="copy">Copy</button>`
    const newElem = document.createElement('div');
    newElem.classList.add('link');
    newElem.innerHTML = fieldBody;

    const copyButton = newElem.querySelector('.copy');
    copyButton.addEventListener('click', e => copyLink(e));

    if (links.firstChild) {
      links.insertBefore(newElem, links.firstChild);
    } else {
      links.appendChild(newElem);
    }
  }
}

// Loading old requests from a local storage(if exist). But not more than 10

if (localStorage.length) {
  let length = localStorage.length;
  if (localStorage.length > 20) {
    length = 20;
  }
  for (let i = length; i >= 2; i -= 2) {
    createField(localStorage.getItem(`longLink${localStorage.length - i}`), localStorage.getItem(`shortLink${localStorage.length - i}`));
  }
}
