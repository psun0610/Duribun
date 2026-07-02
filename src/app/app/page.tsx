import { redirect } from 'next/navigation'

const ProtectedAppPage = () => {
    redirect('/app/places')
}

export default ProtectedAppPage
