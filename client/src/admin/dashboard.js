import { useEffect } from 'react';

function Dashboard() {
    useEffect(()=>{
        document.title = "Afriscope Administrator - Dashboard"
        window.scrollTo({top:0,left:0,behavior:'smooth'})
    },[])

    return (
        <section className="">
            Dashboard
        </section>
    )
}

export default Dashboard