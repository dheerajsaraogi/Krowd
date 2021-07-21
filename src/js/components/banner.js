import React from 'react'
import '../../css/banner.css'


const banner = ({ Heading }) => {

    return(
        <div className="container-fluid gradient" >

            <figure>
                <img className="img-fluid" src={"../../public/feature1.jpg"}alt="" style={{width:100+"%", height: 90+"vh" }}/>
            </figure>
            <h1 className="text-grey" id="heading" style={{ textAlign:"center", marginTop: -25 + "%", marginBottom: 25 +"%"}}>{ Heading }</h1>
        
    </div>
    
    )
}

export default banner