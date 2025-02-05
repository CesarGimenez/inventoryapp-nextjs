'use client'

import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import { usePayment } from '../usePayment'

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComponentUsingSearchParams />
    </Suspense>
  );
};

const ComponentUsingSearchParams = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const { dataDetail: paymentDetail } = usePayment(id as string)
  
  return (
    <div>
      {
        paymentDetail && (
          <div>
            {
              JSON.stringify(paymentDetail, null, 2)
            }
          </div>
        )
      }
    </div>
  )
};

export default Page
