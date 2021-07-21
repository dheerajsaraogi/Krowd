import React from 'react'

class details extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
        <div className="container-fluid" style={{marginTop: 15+"%"}}>
            <div className="row offset-lg-2">
            <h1 style={{marginBottom: 50+"px"}}>Our History</h1>
            </div>
            

            <div className="row" style={{lineHeight:2}}>
            <div className="offset-lg-2"></div>
                <div className=" col-lg-4">
                    <p>Krowd empowers you to raise money for anything that matters to you. From personal causes and events to projects and more. We’ve helped people from all over the world raise millions online.</p>
                    <p>We’ve been recognized as one of the top global crowdfunding websites and our campaigns have been featured in a vast number of leading press publications.</p>
                </div>
                <div className=" col-lg-4">
                    <p>We’re dedicated to making the lives of our campaign owners, donors and visitors happier and enriched. That could range from helping you raise money for critical medical expenses, a once-in-a-lifetime volunteer trip or to launch an exciting new business.</p>
                    <p>Being involved in so many personal and powerful plans, projects and causes drives us to do what we do.</p>
                </div>
            </div>

            <h2 style={{textAlign:"center", marginBottom: 50+"px" ,marginTop: 50+"px"}}>Developers</h2>
            <div className="row">
            <div className=" col-lg-4">
                    <p style={{textAlign:"right"}}>Umang Gupta</p>
            </div>
            <div className=" col-lg-4">
                    <p style={{textAlign:"center"}}>Dheeraj Saraogi</p>
            </div>
            <div className=" col-lg-4">
                    <p style={{textAlign:"left"}}>Vanshika Tyagi</p>
            </div>
            </div>
        </div>
    )
  }
}

export default details
