const AsyncQueue = require('../AsyncQueue');

const dialog = {
  media: {
    vars: {
      accountId: ''
    }
  }
};

const watch = (object, property, cb) => new Proxy(object, {
  set: (target, prop, value) => {
    if (prop === property) {
      cb(prop, value);
    }
    return target[prop] = value;
  }
});

const queue = new AsyncQueue();

dialog.media.vars = watch(dialog.media.vars, 'accountId', (prop, value) => {
  queue.add([prop, value]);
});

const run = async() => {
  for await (const [prop, value] of queue) {
    console.log(prop, value);
  }
}

run();

dialog.media.vars.accountId = '12345';

dialog.media.vars.test = 'Hello';

dialog.media.vars.accountId = '45216';
