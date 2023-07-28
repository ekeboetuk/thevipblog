import { useState, useContext } from 'react'

import axios from 'axios';

import Error from '../pages/error'
import { useUsers } from '../hooks/fetchers'
import { userContext } from '../index';
import { Usercard } from '../components/cards';


function Users() {
    const [users, error, isLoading, mutate] = useUsers()
    const [view, setView] = useState('List');
	const {token} = useContext(userContext)

    const toggleUserActivation = async(id, status)=>{
        mutate(users.map((user) => {
            if(user.id === id) {
                    return {...user, isActive: !status}
                }else{
                    return user
                }
            }),
            await axios.patch('http://localhost:3001/user', {
                id: id,
                status: !status
            })
        )
    }

    const handleDeleteUser = async(userId) => {
        mutate(users.filter((user)=>{
                return user._id !== userId
            }),
            await axios.delete(`http://localhost:3001/user/${userId}`)
        )
    }

    if(isLoading){
        return <div id="message" className="mx-3 p-2"><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Loading...</div>
    } else if(error) {
        return <Error />
    } else {
        return (
            <div className="p-3 d-flex flex-column flex-fill">
                <div className="d-flex justify-content-left align-items-center mb-2">
                    <h6 className="mb-0 pe-2">View As:</h6>
                    <div className="bg-light p-2 rounded-5 px-4">
                        <label className="pe-3"><input type="radio" name="view" value="Table" /> Table</label>
                        <label className="pe-3"><input type="radio" name="view" value="List" defaultChecked={true} onChange={()=>setView('List')}/> List</label>
                        <label><input type="radio" name="view" value="Grid"  onChange={()=>setView('Grid')}/> Grid</label>
                    </div>
                </div>
                {view === 'Grid' ?
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                        {users?.length>0 ?
                            users.map((user) => (
                                <div key={user._id} className="col text-center g-4">
                                    <Usercard user = {user} toggleUserActivation={toggleUserActivation} />
                                </div>
                            )):
                            <div id="message" className="mx-3 p-2"><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Loading...</div>
                        }
                    </div>:
                    <table className="table table-striped">
                        <tbody>
                        {users.map((user, index) => (
                            <tr key={index} id="userdetails" className={!user.isActive?"opacity-50":undefined}>
                                <td className="border-0 p-3 bg-light">
                                    <div className="listing d-flex flex-fill justify-content-between">
                                        <img src="/assets/icon.png" style={{height: "60px"}} alt="Avatar" className="square bg-white rounded-circle p-2 me-2" />
                                        <div className="d-flex flex-column me-auto">
                                            <h6 className="fw-bold">{user.name}</h6>
                                            <small className="">{user.email}</small>
                                            <small className="">{user.type}</small>
                                        </div>
                                        {user.email!=="admin@afriscope.ng" && token?.name!==user.name &&
                                            <small className="d-flex no-wrap align-self-center">
                                                <i type="button" className="fa-solid fa-trash pe-3" onClick={()=>handleDeleteUser(user._id)}></i>
                                                <i type="button" className="fa-regular fa-pen-to-square pe-3"></i>
                                                <i type="button" className={`fa-regular ${user.isActive?"fa-eye-slash":"fa-eye"}`} onClick={()=>toggleUserActivation(user._id, user.isActive)}></i>
                                            </small>
                                        }
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}

export default Users;