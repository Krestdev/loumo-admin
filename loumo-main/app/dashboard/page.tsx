import { redirect } from 'next/navigation'

function Page() {
  redirect(
    "/dashboard/orders"
  )
}

export default Page