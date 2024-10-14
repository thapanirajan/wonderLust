const form = document.getElementById("form");
const title = document.getElementById("title");
const description = document.getElementById("description");
const image = document.getElementById("image");
const country = document.getElementById("country");
const price = document.getElementById("price");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (checkInputs()) {
    form.submit();
  }
});

function checkInputs() {
  const titleValue = title.value.trim();
  const descriptionValue = description.value.trim();
  const imageValue = image.value.trim();
  const priceValue = price.value.trim();
  const countryValue = country.value.trim();

  isValid = true;
  if (titleValue === "") {
    setErrorFor(title, "Title cannot be empty");
    isValid = false;
  } else {
    setSuccessFor(title);
  }

  //description
  if (descriptionValue === "") {
    setErrorFor(description, "description cannot be empty");
    isValid = false;
  } else {
    setSuccessFor(description);
  }

  //image
  setSuccessFor(image);

  //price
  if (priceValue === "") {
    setErrorFor(price, "price cannot be blank");
    isValid = false;
  } else if (!isPrice(priceValue)) {
    setErrorFor(price, "Invalid price");
    isValid = false;
  } else {
    setSuccessFor(price);
  }

  //country
  if (countryValue === "") {
    setErrorFor(country, "Country cannot be blank");
    isValid = false;
  } else {
    setSuccessFor(country);
  }
  return isValid;
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  small.innerText = message;
  formControl.className = "form-control error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}
function isPrice(price) {
  return /^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{1,2})?$/.test(price);
}
