import 'regenerator-runtime/runtime'
import SearchBar from '@/components/ui/SearchBar'
import ButtonOfSignout from '@/components/ui/buttons/ButtonOfSignout'
import { getSession } from 'next-auth/react'
import ButtonToSignin from '@/components/ui/buttons/ButtonToSignin';

export default async function Home() {

  const session = await getSession();
  console.log("session :", session);

  return (
    <div>
      <SearchBar />
      <h1 className='text-xl'>메인페이지입니다.</h1>
      { session?.user == null ?
        <ButtonToSignin />  :
        <ButtonOfSignout /> 
      }
      <div className='text-3xl'>
        {session?.user?.data?.name || "로그인이 필요합니다."}
      </div>
    </div>
  )
}
