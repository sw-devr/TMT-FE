'use client'

import { getRandomNickname } from "@/actions/signup/getRandomNickname";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { postSignup } from "@/actions/signup/postSignup";


export default function signup(){
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showPasswordCheck, setShowPasswordCheck] = useState<boolean>(true);
  const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
  const [passwordValue, setPasswordValue] = useState<boolean>(false);
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [phoneNumberString, setPhoneNumberString] = useState<string>('')
  const [randomNickname , setRandomNickname] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[4]) {
      inputRefs.current[4].value = randomNickname;
    }
  }, [randomNickname]);
// 랜덤닉네임 생성
async function handleRandomNickname() {
  try {
    const data = await getRandomNickname();
    setRandomNickname(data.data);
    console.log("data:", data.data);
  } catch (error) {
    console.error("Failed to fetch random nickname:", error);
  }
}
// 하이픈 제거
function removeHyphens(phoneNumber : string | undefined) {
  return phoneNumber?.replace(/-/g, '');
}
// 회원가입 api
async function handleSignup(event: React.FormEvent) {
  event.preventDefault();

  let name = inputRefs.current[0]?.value;
  let phoneNumber = removeHyphens(inputRefs.current[1]?.value);
  let password = inputRefs.current[3]?.value;
  let nickName = inputRefs.current[4]?.value;

  if(!name || !phoneNumber || !password || !nickName){
    alert("모든 값을 채워주세요")
  }else{
    const res = await postSignup(name, phoneNumber, password, nickName);
    console.log("res :", res);
    console.log("name :", name, "phoneNumber :",phoneNumber, "password :", password, "nickName :", nickName)
    if(!res.isSuccess){
      if(res.code === 1005){
        alert("중복된 전화번호입니다.")
        inputRefs.current[1]?.focus();
      }
      if(res.code === 1000){
        alert("중복된 닉네임입니다.")
        inputRefs.current[4]?.focus();
      }
    }else{
      if (typeof nickName !== 'undefined') {
        localStorage.setItem("nickName", nickName);
      }
      location.href="/member/signup/complete"
    }
  }

}

const passwordValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
  let newPassword = event.target.value;
  var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/
  setPassword1(newPassword)
  setPasswordValue(regExp.test(newPassword));
}

const passwordConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
  let newConfirmPassword = event.target.value;
  setPassword2(newConfirmPassword)
  if(password1 !== password2){
    setPasswordCheck(true)
  }else if(password1 === password2){
    setPasswordCheck(false)
  }
}

const parsingPhoneNumber = (num: string) => {
  return num
      .replace(/[^0-9]/g, '')
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
      .replace(/(-{1,2})$/g, '')
}

  return(
    <>
      <div className="flex mx-10 justify-between mt-10 mb-16">
        <h1 className="text-lg text-[#7d00d0] font-extrabold">회원가입</h1>
        <Link className="rounded-full bg-[#f6f7f9] flex justify-center items-center w-5 h-5" href={"/member/signin"}>
          <Image width="20" height="20" src="https://img.icons8.com/ios/20/000000/multiply.png" alt="cancel"/>
        </Link>
      </div>
      <form>
        <div className="w-80 mx-auto my-6">
          <label htmlFor="name" className="text-sm my-1 block">이름 <span className="text-red-500">*</span></label>
          <input name="name" type="text" id="name" required minLength={2} ref={(el) => {inputRefs.current[0] = el}} className="border-[2px] rounded-lg w-80 h-10 mx-auto block px-4 text-sm placeholder-[#aea0e5]"/>
        </div>
        <div className="w-80 mx-auto my-6">
          <label htmlFor="phone" className="text-sm my-1 block">전화번호 <span className="text-red-500 ">*</span></label>
          <input name="phone" id="phone" type="tel" onChange={(e) => setPhoneNumberString(parsingPhoneNumber(e.target.value))} value={phoneNumberString} required ref={(el) => {inputRefs.current[1] = el}} placeholder="하이픈(-)은 빼고 입력해주세요" className="border-[2px] rounded-lg w-80 h-10 mx-auto px-4 text-sm placeholder-[#aea0e5] inline"/>
        </div>
        <div className="w-80 mx-auto my-6">
          <label htmlFor="password" className="text-sm my-1 block">비밀번호 <span className="text-red-500">*</span></label>
          <div className="relative">
            <input id="password" placeholder={"8자 이상 비밀번호를 입력해주세요"} onChange={passwordValidation} type={showPassword ? "password" : "text"} name="password" required ref={(el) => {inputRefs.current[2] = el}} className="border-[2px] rounded-lg w-80 h-10 mx-auto block my-2 px-4 text-sm placeholder-[#aea0e5]"/>
            { showPassword ?
              <Image width="20" height="20" src="https://img.icons8.com/ios-glyphs/20/visible--v1.png" alt="visible--v1" className="absolute right-5 top-2" onClick={()=>{setShowPassword(false)}}/> :
              <Image width="20" height="20" src="https://img.icons8.com/material/20/closed-eye.png" alt="closed-eye" className="absolute right-5 top-2" onClick={()=>{setShowPassword(true)}}/>
            }
          </div>
          {passwordValue ?(password1 ? <p className="text-xs text-green-500">사용가능한 비밀번호 입니다.</p> : "") : (password1 ? <p className="text-xs text-red-500">비밀번호는 영어 숫자 8~20자로 조합 되어야합니다.</p> : "")}
          <div className="relative">
            <input placeholder={"비밀번호를 다시 입력해주세요"} onChange={passwordConfirm} type={showPasswordCheck ? "password" : "text"} name="passwordCheck" required ref={(el) => {inputRefs.current[3] = el}} className="border-[2px] rounded-lg w-80 h-10 mx-auto block my-4 px-4 text-sm placeholder-[#aea0e5]"/>
            { showPasswordCheck ?
              <Image width="20" height="20" src="https://img.icons8.com/ios-glyphs/20/visible--v1.png" alt="visible--v1" className="absolute right-5 top-2" onClick={()=>{setShowPasswordCheck(false)}}/> :
              <Image width="20" height="20" src="https://img.icons8.com/material/20/closed-eye.png" alt="closed-eye" className="absolute right-5 top-2" onClick={()=>{setShowPasswordCheck(true)}}/>
            }
          </div>
          {password1 === password2 ? (password2 ? <p className="text-xs text-green-500">비밀번호가 일치합니다.</p> : "") : (password2 ? <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다.</p> : "")}
        </div>
        <div className="w-80 mx-auto my-6">
          <label htmlFor="nickName" className="text-sm my-1 block">닉네임 <span className="text-red-500">*</span></label>
          <input name="nickName" id="nickName" type="text" required ref={(el) => {inputRefs.current[4] = el}} className="border-[2px] rounded-lg w-56 h-10 mx-auto px-4 text-sm placeholder-[#aea0e5] inline"/>
          <input type="button" value={"자동생성"} onClick={handleRandomNickname} className="w-20 bg-[#7d00d0] font-bold text-white rounded-md ml-4 h-10 inline text-sm border-[1px] px-2" />
        </div>

        <input type="submit" value={"가입하기"} onClick={handleSignup} className="bg-[#7d00d0] text-white text-sm font-semibold rounded-lg w-80 h-10 mx-auto block my-6 absolute bottom-4 left-0 right-0"/>
      </form>
    </>
  )
}