import React, { useState, useEffect } from 'react'

import { useProduct } from 'vtex.product-context'

import { getDefaultSeller } from './modules/seller'

function AcuotazAddon({ clientId }: any) {
  const productContextValue = useProduct()
  const seller = getDefaultSeller(productContextValue?.selectedItem?.sellers)
  const commercialOffer = seller?.commertialOffer
  const sellingPriceValue = commercialOffer?.Price
  const [loading, setLoading] = useState(true);
  const [addonHtml, setAddonHtml] = useState('');

  useEffect(() => {
    const headers = { Client_id: clientId };
    if (!sellingPriceValue) {
      setLoading(false);
      return;
    }
    fetch(
      `https://apurata.com/pos/pay-with-apurata-add-on/${sellingPriceValue}?page=product`,
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
