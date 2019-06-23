const Node = (firstName, lastName) => {
  const description = `${firstName} ${lastName}`;
  const node = Object(Symbol(description));
  return Object.assign(node, {
    firstName,
    lastName,
    get fullName() {
      return description;
    }
  });
};

const A = Node('Amir', 'Abdolrazaghi');
const B = Node('Bella', 'Robin');
const C = Node('Ce', 'Yen');
const D = Node('Darius', 'Zen');

console.log(A.fullName);

const graph = {
  [A]: [
    B,
    C
  ],
  [D]: [
    C
  ]
};
