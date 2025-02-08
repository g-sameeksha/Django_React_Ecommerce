import React, { useState } from 'react'

const ResetPasswordPage = () => {
    const [email,SetEmail] = useState("");
    const [emailVerified ,SetemailVerified] = useState(false)

    
  return (
    emailVerified?<div className='container border'>
    <div>
        <div>
password
        </div>
        <div>
confirm password
        </div>
        
    </div>
</div>:<div className='container border  shadow my-5 p-5 w-50'>
    <div className='card border-0 gap-5'> 
        <div className='card-header'>
             <h3>Reset Password email: </h3>
        </div>
        <div >
            <input className='p-2 w-100'
            placeholder='Enter your email'
            value={email}
            onChange={(e)=>SetEmail(e.target.value)}
            >
              
            </input>
        
        </div>
        <div>
            <button className='btn btn-primary'>Verify email</button>

        </div>
        
    </div>
</div>
  )
}

export default ResetPasswordPage