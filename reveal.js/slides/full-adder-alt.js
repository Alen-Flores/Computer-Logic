import circuitData from './circuits/full-adder-alt.json' with { type: 'json' };

window.addEventListener('load', () => {
  console.log(circuitData);
  const circuit = new digitaljs.Circuit(circuitData);
  circuit.displayOn(document.getElementById("full-adder-alt"));
  circuit.start();
})

