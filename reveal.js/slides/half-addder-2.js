window.addEventListener('load', () => {

  let circuitData = {
    "devices": {
      input1: { "label": "A", "type": "Button", "bits": 1, },
      input2: { "label": "B", "type": "Button", "bits": 1, },
      output1: { "label": "C_out", "type": "Lamp", "bits": 1, },
      output2: { "label": "S", "type": "Lamp", "bits": 1, },
      gate1: { "type": "And", "inputs": 2, },
      gate2: { "type": "Xor", "inputs": 2, }
    },

    "connectors": [
      { "from": { "id": "input1", "port": "out" }, "to": { "id": "gate1", "port": "in1" } },
      { "from": { "id": "input2", "port": "out" }, "to": { "id": "gate1", "port": "in2" } },

      { "from": { "id": "input1", "port": "out" }, "to": { "id": "gate2", "port": "in1" } },
      { "from": { "id": "input2", "port": "out" }, "to": { "id": "gate2", "port": "in2" } },

      { "from": { "id": "gate1", "port": "out" }, "to": { "id": "output1", "port": "in" } },
      { "from": { "id": "gate2", "port": "out" }, "to": { "id": "output2", "port": "in" } },
    ],

    "subcircuits": {}
  }

  const circuit = new digitaljs.Circuit(circuitData);
  circuit.displayOn(document.getElementById("half-adder-2"));
  circuit.start();

  let equation = document.getElementById("half-adder-equation-2");

  let bit1 = 0;
  let bit2 = 0;

  circuit._graph.getCell('input1').on("change:outputSignals", (_, bits) => {
    bit1 = (bits.out._avec[0] & 1);
    equation.textContent = String.raw`\begin{array}{cccc} & ${bit1} \\ + & ${bit2} \\ \hline _${bit1 & bit2} & ${bit1 ^ bit2} \end{array}`
    MathJax.typeset();
  });

  circuit._graph.getCell('input2').on("change:outputSignals", (_, bits) => {
    bit2 = (bits.out._avec[0] & 1);
    equation.textContent = String.raw`\begin{array}{cccc} & ${bit1} \\ + & ${bit2} \\ \hline _${bit1 & bit2} & ${bit1 ^ bit2} \end{array}`
    MathJax.typeset();
  });
})

