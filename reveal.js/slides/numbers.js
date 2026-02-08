let toBinInput = document.getElementById("tobin-input");
let fromBinInput = document.getElementById("frombin-input");

function toBinary(n) {
  out = "";
  while (n !== 0) {
    out = `${n % 2}` + out;
    n = Math.floor(n / 2);
  }
  return out;
}

function fromBinary(bin) {
  let n = 0;
  for (let i = bin.length - 1; i >= 0; i--) {
    if (bin[bin.length - i - 1] === "1") n += Math.pow(2, i);
  }
  return n;
}

toBinInput.addEventListener("input", () => {
  fromBinInput.value = toBinary(toBinInput.value);
});

fromBinInput.addEventListener("input", () => {
  toBinInput.value = fromBinary(fromBinInput.value);
});
