import React from 'react'
// import '../../css/footer.css'


const footer = () => {

  
  return(
    //   <div className="col-6, pt-5" style={{backgroundColor:"black"}}>
    //       <h3 className="text-white">About Us</h3>
    //   </div>

    <div className="container-fluid px-0 mt-5">
          <div style={{height: 150+"px", overflow: "hidden"}} >
            <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{height: 100+"%", width: 100 + "%"}}>
                <path d="M-4.22,83.38 C166.76,-100.16 314.61,269.89 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{stroke: "none", fill: "#25262f"}}></path>
            </svg>
         </div>

         <div className="footer" style={{backgroundColor: "#25262f"}}>
            
         <div className="row ">
        <div className="col-md-12 center">
            <h2 className="display-4 footer-heading text-white center" style={{width: 100 +"vw", textAlign: 'center'}}>Start Growing with Krowd</h2>
        </div>
        <div className="col-md-12 center btn-subscribe" style={{textAlign:"center"}}>
            <button className="btn btn-outline-primary text-white mt-5">FOLLOW US NOW</button>
        </div>
    </div>
    <br />
      <br />
    <hr color="white" width="100%"/>
    <div className="row">
      <div className="offset-3 col-md-2 d-flex justify-content-center">
          <ul className="list, text-white">
            <li className="mb-3 fontsize12">Media</li>
              <li className="mb-3 fontsize12">Twitter</li>
              <li className="mb-3 fontsize12">Youtube</li>
              <li className="mb-3 fontsize12">Pinterest</li>
              <li className="fontsize12">Github</li>
          </ul>
      </div>
      <div className="col-md-2 d-flex justify-content-center">
        <ul className="list, text-white">
          <li className="mb-3 fontsize12">About Us</li>
            <li className="mb-3 fontsize12">Terms</li>
            <li className="mb-3 fontsize12">Privacy</li>
            <li className="mb-3 fontsize12">Copyright</li>
            <li className="fontsize12">Contact Us</li>
        </ul>
    </div>

    <div className="col-md-2 d-flex justify-content-center">
      <ul className="list, text-white">
        <li className="mb-3 fontsize12">Other</li>
          <li className="mb-3 fontsize12">Sitemap</li>
          <li className="mb-3 fontsize12">Blog</li>
          <li className="mb-3 fontsize12">FAQ</li>
      </ul>
  </div>
    
{/* 
  <div className="col-5 col-lg-2 d-flex justify-content-center">
    <ul className="list, text-white">
      <li className="mb-1 fontsize12">Follow Us</li>
      <div className="d-lg-flex"> 
        <li><i className="fa fa-facebook social" style={{paddingLeft: 15+"px"}}></i></li>
      <li><i className="fa fa-linkedin social" ></i></li>
      <li><i className="fa fa-twitter social" ></i></li>
      </div>
    </ul>
  </div> */}

    
    </div>
        </div>
    </div>

    

 

  )
}

export default footer
