const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector("#swap-icon");

// Populating Select Dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const API_KEY = "023485b5d80277ca9f8bcdb0";

// Fetch and Update Exchange Rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value.trim();

  if (amtVal === "" || isNaN(amtVal) || Number(amtVal) <= 0) {
    amtVal = 1;
    amount.value = "1";
  } else {
    amtVal = Number(amtVal);
  }

  msg.innerText = "Getting exchange rate...";

  try {
    const URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurr.value}/${toCurr.value}/${amtVal}`;
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data.conversion_result;

    if (!rate) {
      msg.innerText = "Exchange rate not available.";
      return;
    }

    msg.innerText = `${amtVal} ${fromCurr.value} = ${rate.toLocaleString()} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
  }
};

// Update Country Flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Currency Swap Functionality
swapBtn.addEventListener("click", () => {
  let tempCurr = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = tempCurr;

  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

// Event Listeners
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});