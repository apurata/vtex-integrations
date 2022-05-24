import React, { useState, useEffect } from 'react'


function AcuotazAddon({ clientId, amount, productQuery }: any) {
  const [loading, setLoading] = useState(true);
  const [addonHtml, setAddonHtml] = useState('');

  useEffect(() => {
    const headers = { Client_id: clientId };
    let price = amount;
    if (!price) {
      const prices = productQuery?.product?.priceRange;
      price = (
        prices.sellingPrice?.lowPrice
        || prices.sellingPrice?.highPrice
        || prices.listPrice?.lowPrice
        || prices.listPrice?.highPrice
      );
      price = Math.round(price);
    }
    if (!price) {
      setLoading(false);
      return;
    }
    fetch(
      `https://apurata.com/pos/pay-with-apurata-add-on/${price}?page=product`,
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
      (data: string) => {
        setAddonHtml(data);
      }
    ).finally(() => {
      setLoading(false);
    });
  }, []);
  if (loading) return <></>
  return <div dangerouslySetInnerHTML={{ __html: addonHtml }} />
}

export default AcuotazAddon;
