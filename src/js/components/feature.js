import React from 'react'



const feature = props => {
  return (
    <div className="container-fluid" style={{marginTop: 5+"%"}}>

    <div className="row" style={{marginBottom: 5+"rem"}}>
        <div className="offset-1 col-md-8 col-xl-6 heading">
            <h2 className="display-3" id="feature-heading">How It Works</h2>
            {/* <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis, itaque atque.Omnis, itaque atque.Omnis, itaque atque.</p> */}
        </div>
    </div>

    {/* <div className="row my-sm-4">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
            <figure> 
                <img className="img-fluid" src="https://pbs.twimg.com/profile_banners/803884128076578816/1545578522/1500x500" alt="feature image" width="600" height="500"/>
            </figure>
        </div>
        <div className="col-md-6 col-lg-4 d-flex flex-column justify-content-center align-items-start center">
            <div className="header">
                <i className="fa fa-inr shadow mb-4 feature"></i>
                <h2 className="features-subheading display-6">Invest easily and<br/>safely from home</h2>
            </div>
            <p className="my-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere minima, reiciendis illo mollitia dolores cum pariatur odio porro repudiandae dicta tempora quibusdam. Perferendis, similique blanditiis?</p>
            <button className="btn btn-light btn-lg shadow mt-1">LEARN MORE <i className="	fa fa-long-arrow-right"></i></button>
        </div>
    </div>

    <div className="row d-md-none my-5">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
            <figure> 
                <img className="img-fluid" src="https://pbs.twimg.com/profile_banners/803884128076578816/1545578522/1500x500" alt="feature image" width="600" height="500"/>
            </figure>
        </div>
        <div className="col-md-6 col-lg-4 d-flex flex-column justify-content-center align-items-start center">
            <div className="header">
                <i className="fa fa-sun-o shadow mb-4 feature"></i>
                <h2 className="features-subheading display-6">Make your future<br/>become brighter</h2>
            </div>
            <p className="my-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere minima, reiciendis illo mollitia dolores cum pariatur odio porro repudiandae dicta tempora quibusdam. Perferendis, similique blanditiis?</p>
            <button className="btn btn-light btn-lg shadow mt-1">LEARN MORE <i className="	fa fa-long-arrow-right"></i></button>
        </div>
    </div> */}



    <div className="row d-md-none my-5">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
            <figure> 
                <img className="img-fluid" src={"../../public/feature1.jpg"}alt="feature image" width="600" height="500"/>
            </figure>
        </div>
        <div className="col-md-6 col-lg-4 d-flex flex-column justify-content-center align-items-start center">
            <div className="header">
                <small>Do This</small>
                <h2 className="features-subheading display-6">Make donation to a<br/>Fundraiser</h2>
            </div>
            <p className="my-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere minima, reiciendis illo mollitia dolores cum pariatur odio porro repudiandae dicta tempora quibusdam. Perferendis, similique blanditiis?</p>
            <button className="btn btn-light btn-lg shadow mt-1">LEARN MORE <i className="	fa fa-long-arrow-right"></i></button>
        </div>
    </div>


    <div className="row my-5 d-none d-md-flex">
        <div className="col-md-6 offset-lg-2 col-lg-4 d-flex flex-column justify-content-center align-items-start">
            {/* <i className="fa fa-sun-o shadow mb-4 feature py-3 m-0"></i> */}
            <small>DO THIS</small>
            <h2 className="features-subheading display-6">Make donation to a Fundraiser</h2>
            <p className="my-4">The Donors can browse through the different fundraisers and select a favourable fundraiser in which they would like to donate.</p>
            <button className="btn btn-light btn-lg shadow mt-1">LEARN MORE <i className="	fa fa-long-arrow-right"></i></button>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
            <figure> 
                <img className="img-fluid" src={"../../public/feature1.jpg"} alt="feature image" width="600" height="500"/>
            </figure>
        </div>
    </div>


    <div className="row">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
            <figure> 
                <img className="img-fluid" src={"../../public/feature2.jpg"} alt="feature image" width="600" height="500"/>
            </figure>
        </div>
        <div className="col-md-6 col-lg-4  center d-flex flex-column justify-content-center align-items-start">
            <div className="header">
                {/* <i className="fa fa-shield shadow mb-4 feature"></i> */}
                <small>OR THIS</small>
                <h2 className="features-subheading display-6">Create Your Fundraising Campaign</h2>
            </div>
            <p className="my-4">Interested authorities can create fundraisers and campaings for a certain cause and deploy it on our platform to collect funds.</p>
            <button className="btn btn-light btn-lg shadow mt-1">LEARN MORE <i className="	fa fa-long-arrow-right"></i> </button>
        </div>
    </div>


    </div>
  )
}
export default feature
