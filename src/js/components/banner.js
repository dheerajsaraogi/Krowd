import React from 'react'
import '../../css/banner.css'

const banner = ({ Heading }) => {

    return(
        <div className="block-31" style={{position: 'relative'}}>
        <div className="owl-carousel loop-block-31 ">
            <div className="block-30 block-30-sm item" style={{backgroundImage: 'url("../img/bg_1.jpg")'}} data-stellar-background-ratio="0.5">
            <div className="container">
                <div className="row align-items-center justify-content-center text-center">
                <div className="col-md-9">
                    <h2 className="heading mb-5">Crowd-funding Platform Using Smart Contracts</h2>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>

        /* <div className="container-fluid gradient" >

            <figure>
                <img className="img-fluid" src={"../../public/feature1.jpg"}alt="" style={{width:100+"%", height: 90+"vh" }}/>
            </figure>
            <h1 className="text-grey" id="heading" style={{ textAlign:"center", marginTop: -25 + "%", marginBottom: 25 +"%"}}>{ Heading }</h1>
        
        </div> */
    
    )
}

export default banner