export function print(path, layer) {
  const printedValues = [];

  if (layer.route) {
    layer.route.stack.forEach((value) => {
      printedValues.push(...print(path.concat(split(layer.route.path)), value));
    });
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach((value) => {
      printedValues.push(...print(path.concat(split(layer.regexp)), value));
    });
  } else if (layer.method) {
    const printedValue = `${layer.method.toUpperCase()} ${process.env.URL_SERVER}/${path.concat(split(layer.regexp)).filter(Boolean).join('/')}`;
    printedValues.push(printedValue);
    console.log(printedValues)
  }

  return printedValues;
}


function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

