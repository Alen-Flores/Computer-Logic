import circuitData from './circuits/carry-propagate.json' with { type: 'json' };

window.addEventListener('load', () => {
  console.log(circuitData);
  const circuit = new digitaljs.Circuit(circuitData);
  circuit.displayOn(document.getElementById("carry-propagate"));
  circuit.start();
})

