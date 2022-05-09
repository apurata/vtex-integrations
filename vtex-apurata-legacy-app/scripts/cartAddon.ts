(function () {
  if (!window.location.href.includes('/#/cart')) return;
  var rawPrice = document.getElementsByClassName('monetary');
  if (!rawPrice) return;
  var parsedPrice = (rawPrice[rawPrice.length - 1].textContent || '').match(/\d*\.\d*/) || [];
  if (!parsedPrice) return;
  var price = parsedPrice[0];
  var clientID = localStorage.getItem('AcuotazClientID') || '';
  const headers = { Client_id: `${clientID}` };
  fetch(
    `https://apurata.com/pos/pay-with-apurata-add-on/${price}`,
    {
      method: 'GET',
      headers,
    },
  ).then(
    (response: any) => {
      return response.text();
    },
    () => {
      throw new Error();
    },
  ).then(
    (rawHTML: string) => {
      document.getElementsByClassName('summary-totalizers')[0].insertAdjacentHTML('afterend', rawHTML);
    }
  );
})()
