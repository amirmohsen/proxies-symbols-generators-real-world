const Node = (description) => Symbol(description);

const A = Node('A');
const B = Node('B');
const C = Node('C');
const D = Node('D');

const graph = {
  [A]: [
    B,
    C
  ],
  [D]: [
    C
  ]
};
