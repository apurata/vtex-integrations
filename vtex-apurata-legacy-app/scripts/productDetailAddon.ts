(function () {
  var rawPrice = document.getElementsByClassName("productPrice");
  if (!rawPrice) return;
  var parsedPrice = (rawPrice[0].textContent || '').match(/\d*\.\d*/) || [];
  if (!parsedPrice) return;
  var price = parsedPrice[0];
  var clientID = localStorage.getItem('AcuotazClientID') || '';
  const headers = { Client_id: clientID };
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
      rawPrice[0].insertAdjacentHTML('afterend', rawHTML);;
    }
  );
})()
