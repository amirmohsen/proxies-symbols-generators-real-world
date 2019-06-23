class Node {
  constructor(description) {
    this.description = description;
  }
}

const graphValues = {
  A: new Node('A'),
  B: new Node('B'),
  C: new Node('C'),
  D: new Node('D')
};

const graphRelationships = {
  A: [
    'B',
    'C'
  ],
  D: [
    'C'
  ]
};
