window.addEventListener('load', () => {

  let circuitData = {
    "devices": {
      input1: { "label": "Cᵢₙ", "type": "Button", "bits": 1, },
      input2: { "label": "A", "type": "Button", "bits": 1, },
      input3: { "label": "B", "type": "Button", "bits": 1, },

      gate1_1: { "type": "Xor", "inputs": 2, },
      gate1_2: { "type": "Xor", "inputs": 2, },

      output1: { "label": "S", "type": "Lamp", "bits": 1, },
      output2: { "label": "Cₒᵤₜ", "type": "Lamp", "bits": 1, },

      gate2: { "type": "And", "inputs": 2, },
      gate3: { "type": "And", "inputs": 2, },
      gate4: { "type": "Or", "inputs": 2, },
    },

    "connectors": [
      { from: { "id": "input2", "port": "out" }, to: { "id": "gate1_1", "port": "in1" } },
      { from: { "id": "input3", "port": "out" }, to: { "id": "gate1_1", "port": "in2" } },

      { from: { "id": "gate1_1", "port": "out" }, to: { "id": "gate1_2", "port": "in1" } },
      { from: { "id": "input1", "port": "out" }, to: { "id": "gate1_2", "port": "in2" } },
      { from: { "id": "gate1_2", "port": "out" }, to: { "id": "output1", "port": "in" } },

      { from: { "id": "input2", "port": "out" }, to: { "id": "gate2", "port": "in1" } },
      { from: { "id": "input3", "port": "out" }, to: { "id": "gate2", "port": "in2" } },

      { from: { "id": "input1", "port": "out" }, to: { "id": "gate3", "port": "in1" } },
      { from: { "id": "gate1_1", "port": "out" }, to: { "id": "gate3", "port": "in2" } },

      { from: { "id": "gate2", "port": "out" }, to: { "id": "gate4", "port": "in1" } },
      { from: { "id": "gate3", "port": "out" }, to: { "id": "gate4", "port": "in2" } },

      { from: { "id": "gate4", "port": "out" }, to: { "id": "output2", "port": "in" } },

    ],

    "subcircuits": {}
  }

  const circuit = new digitaljs.Circuit(circuitData);
  circuit.displayOn(document.getElementById("full-adder"));
  circuit.start();

  let equation = document.getElementById("full-adder-equation");

  bit1 = 0
  bit2 = 0
  bit3 = 0

  circuit._graph.getCell('input1').on("change:outputSignals", (_, bits) => {
    bit1 = (bits.out._avec[0] & 1);
    equation.textContent = String.raw` \begin{array}{cc} & _${bit1} \\ &  ${bit2} \\ +  &  ${bit3} \\ \hline _${(bit2 & bit3) | (bit1 & (bit2 ^ bit3))} & ${bit1 ^ bit2 ^ bit3} \end{array} `
    MathJax.typeset();
  });

  circuit._graph.getCell('input2').on("change:outputSignals", (_, bits) => {
    bit2 = (bits.out._avec[0] & 1);
    equation.textContent = String.raw` \begin{array}{cc} & _${bit1} \\ &  ${bit2} \\ +  &  ${bit3} \\ \hline _${(bit2 & bit3) | (bit1 & (bit2 ^ bit3))} & ${bit1 ^ bit2 ^ bit3} \end{array} `
    MathJax.typeset();
  });

  circuit._graph.getCell('input3').on("change:outputSignals", (_, bits) => {
    bit3 = (bits.out._avec[0] & 1);
    equation.textContent = String.raw` \begin{array}{cc} & _${bit1} \\ &  ${bit2} \\ +  &  ${bit3} \\ \hline _${(bit2 & bit3) | (bit1 & (bit2 ^ bit3))} & ${bit1 ^ bit2 ^ bit3} \end{array} `
    MathJax.typeset();
  });
})

