import Image from "next/image";

import {useRouter} from 'next/router'

export default function Logo() {
  const router = useRouter()
    return (
      <div onClick={()=>router.push('/')} className="block h-8 w-32 relative scale-150">
        <Image
          layout="fill"
          src="/logo.png"
          alt="Workflow"
          objectFit="contain"
          priority
        />
      </div>

  );
}
