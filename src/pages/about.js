import { useEffect } from 'react';

function About() {
    useEffect(()=>{
        document.title = "Afriscope Blog - About Us"
        window.scrollTo({top:0,left:0,behavior:'smooth'})
    },[])

    return (
        <>
            <section className="container-md">
                <h2 className="border-left">About Us</h2>
                <p className="">Started as a bootcamp project for a set of aspiring developers and culminated into a full-fletched web application still under development to serve as a general purpose blog where you can get all kinds of information. Here to excite your interest as well as keep you informed, engaged and involved as you are welcomed to sign up to interact in the comment sections or write us a note to contribute as an Editor.</p>
            </section>
            <section className='container-fluid' style={{backgroundColor: 'rgba(116, 65, 93, 0.25)'}}>
                <div className="container-md" style={{padding: "0 20px"}}>
                    <h2 className="border-left">Team Members</h2>
                    <div className="row row-cols-1 row-cols-md-5 gy-4">
                        <div className="photo-card col p-2">
                            <img src="media/photo-placeholder-male.jpeg" className="w-100" alt='Cordinator'/>
                            <div className="caption d-flex flex-column align-items-center p-2">
                                <h4 className="text-uppercase">Ndifreke Eduo</h4>
                                <em className="fst-italic">Cordinator</em>
                            </div>
                        </div>
                        <div className="photo-card col p-2">
                            <img src="media/photo-placeholder-female.jpeg" className="w-100" alt='Training Supervisor'/>
                            <div className="caption d-flex flex-column align-items-center p-2">
                                <h4 className="text-uppercase">Dunke</h4>
                                <em className="fst-italic">QA Engineer</em>
                            </div>
                        </div>
                        <div className="photo-card col p-2 bg-brand text-white rounded">
                            <img src="media/team/ekebo-brown.jpeg" className="w-100" alt='Lead Developer'/>
                            <div className="caption d-flex flex-column align-items-center p-2">
                                <h4 className="text-uppercase">Ekebo Brown</h4>
                                <em className="fst-italic">Lead Developer</em>
                            </div>
                        </div>
                        <div className="photo-card col p-2">
                            <img src="media/photo-placeholder-male.jpeg" className="w-100" alt='UI/UX Designer'/>
                            <div className="caption d-flex flex-column align-items-center p-2">
                                <h4 className="text-uppercase">Ernest Eduo</h4>
                                <em className="fst-italic">UI/UX Designer</em>
                            </div>
                        </div>
                        <div className="photo-card col p-2">
                            <img src="media/photo-placeholder-male.jpeg" className="w-100" alt='Developer'/>
                            <div className="caption d-flex flex-column align-items-center p-2">
                                <h4 className="text-uppercase">UbonAbasi Cookey</h4>
                                <em className="fst-italic">Junior Developer</em>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="container-md">
                <h2 className="border-left">Editors</h2>
                    <div className="row row-cols-2 row-cols-md-6 gy-4">
                        <div className="col p-2">
                            <img src="media/team/goodnews-etim.jpeg" className="w-100" alt='Developer'/>
                            <div className="caption d-flex flex-column align-items-center p-2">
                                <h5 className="text-uppercase">Goodnews Etim</h5>
                                <em className="fst-italic">Chief Editor</em>
                            </div>
                        </div>
                    </div>
            </section>
        </>
    )
}

export default About