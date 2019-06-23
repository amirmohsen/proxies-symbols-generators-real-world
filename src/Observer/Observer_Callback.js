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

dialog.media.vars = watch(dialog.media.vars, 'accountId', (prop, value) => {
  console.log(prop, value);
});

dialog.media.vars.accountId = '12345';

dialog.media.vars.test = 'Hello';

dialog.media.vars.accountId = '45216';
