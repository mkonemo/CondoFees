exports.getDate = function() {
  let today = new Date();
  let options = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }

  return today.toLocaleDateString('it-IT', options);
}

exports.getDay = function() {
  let today = new Date();
  let options = {
    weekday: 'short'
  }

  return today.toLocaleDateString('en-us', options);
}
