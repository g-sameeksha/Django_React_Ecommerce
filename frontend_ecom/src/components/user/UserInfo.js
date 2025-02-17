import React from 'react'
import { BiEdit } from 'react-icons/bi'
import { FcEditImage } from 'react-icons/fc'
import { DateFormattor } from '../../utils/DateFormattor'
import api, { BASE_URL } from '../../utils/api'
const UserInfo = ({user}) => {
  return (
    <div>
        <div className='row mb-4'>
            <div className='col-md-3 py-3 card'>
                <img  
                 src={`https://ui-avatars.com/api/?name=${user.username || "User"}&background=random`} 
                    className="img-fluid rounded mb-3 mx-auto"
                    style={{ height: "80px", width: "80px", objectFit: "cover" }}
                  />
                <h3 className='mx-auto'>{user.username}</h3>
                <p className='mx-auto text-muted'>{user.email}</p>
                <button className='btn ' style={{backgroundColor:"#6050DC",color:'white'}}><BiEdit className='me-2'/>Edit Profile</button>

            </div>
            <div className='col-md-9'>
            <div className='card'>
                <div className='card-header' style={{backgroundColor:"#6050DC",color:'white'}}>
                <h5> Account OverView</h5>
                </div>
                <div className='card-body'>
                    <div className='row '>
                        <div className='col-md-6'>
                            <p><strong>Full name : {user.first_name} {user.last_name}</strong></p>
                            <p><strong>Email : {user.email} </strong></p>
                            <p><strong>Phone : {user.phone}</strong></p>
                        </div>
                        <div className='col-md-6'>
                        <p><strong>City : {user.city} </strong></p> 
                        <p><strong>Address : {user.address} </strong></p> 
                        <p><strong>Member since : {DateFormattor(user.date_joined)}</strong></p>
                        </div>

                    </div>
                </div>
            </div>

        </div>


        </div>
       
    </div>
  )
}

export default UserInfo