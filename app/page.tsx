'use client'

import TopBar from '@/components/bars/topBar'
import Hero1 from '@/components/hero/Hero1'
import Hero2 from '@/components/hero/Hero2'
import Hero3 from '@/components/hero/Hero3'
import Hero4 from '@/components/hero/Hero4'
import Hero5 from '@/components/hero/Hero5'
import Footer from '@/components/bars/footer'

const rawUser = localStorage.getItem('fomo_user')
const parsedUser = {
  ...JSON.parse(rawUser || 'null'),
  loggedIn: true,
  userType: 'college',
}
console.log('User from localStorage:', parsedUser)

export default function Home() {
  return (
    <>
      {/* HII */}
      <TopBar theme='home' user={rawUser ? parsedUser : null} />
      <Hero1 />
      <Hero2 />
      <Hero3 />
      <Hero4 />
      <Hero5 />
      <Footer />
    </>
  )
}
