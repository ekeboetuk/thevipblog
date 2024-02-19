import { useEffect } from 'react';

function Dashboard() {
    useEffect(()=>{
        document.title = "Afriscope Administrator - Dashboard"
    })

    return (
        <div className="">
            Dashboard
        </div>
    )
}

export default Dashboard