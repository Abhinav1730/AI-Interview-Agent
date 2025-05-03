import Image from 'next/image'
import React from 'react'

function InterviewComplete() {
  return (
    <div>
      <div>
        <Image src={'/check.jpg'} alt='tick' width={100} height={100}/>
      </div>
    </div>
  )
}

export default InterviewComplete
