export function formatDate(date, fmt) {
  let yy = (/y+/).exec(fmt);
  if (yy) {
    fmt = fmt.replace(yy[0], (date.getFullYear() + '').substr(4 - yy[0].length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    let d = (new RegExp(`${k}`)).exec(fmt);
    if (d) {
      let str = o[k] + '';
      fmt = fmt.replace(d[0], d[0].length === 1 ? str : addZeroFn(str));
    }
  }
  return fmt;
}

function addZeroFn(str) {
  return ('00' + str).substr(str.length);
}
