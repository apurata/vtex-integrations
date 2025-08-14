import React, { useEffect, useState } from 'react';

function AcuotazHeadBand({ clientId }: any) {
  const [loading, setLoading] = useState(true);
  const [headerHtml, setHeaderHtml] = useState('');

  useEffect(() => {
    fetch(
      `https://apurata.com/pos/acuotaz-head-band`,
      {
        headers: {
          'Client_id': clientId,
        },
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
        setHeaderHtml(data);
      }
    ).catch(console.error)
    .finally(() => {
      setLoading(false);
    });
  }, [clientId]);

  if (loading) return <></>

  return (
    <div
      style={{
        position: 'static',
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1
      }}
      dangerouslySetInnerHTML={{ __html: headerHtml }}
    />
  )
}

export default AcuotazHeadBand;
