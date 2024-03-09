import { useEffect } from 'react';

function Dashboard() {
    useEffect(()=>{
        document.title = "Afriscope Administrator - Dashboard"
    })

    return (
        <section className="">
            Dashboard
        </section>
    )
}

export default Dashboard