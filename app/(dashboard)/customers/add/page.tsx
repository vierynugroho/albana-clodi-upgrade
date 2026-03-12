'use client'

import CustomerForm from '@/components/customer/CustomerForm'
import { Card, CardTitle } from '@/components/ui/card'

const Page = () => {
 
  return (
    <Card className="space-y-6 border-0">
      <CardTitle className="p-2 text-2xl font-bold">
        Tambah Data Customer
      </CardTitle>

      <CustomerForm />      
      
    </Card>
  )
}

export default Page
