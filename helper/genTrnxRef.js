
function genTrxnRef() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  return `CtG-${year}${month}${day}${randomNum}`;
}

module.exports = genTrxnRef;