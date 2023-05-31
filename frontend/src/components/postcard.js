import logo from '../images/logo.png'
import '../styles.css'

function Postcard({image, title, content, category }) {
    return (
      <div className="d-flex square border-primary rounded-5">
        <div className="flex-fill">
            <img src={image} alt={title} />
        </div>
        <div className="flex-fill">
            <div className="d-inline-flex ">
                <img src={logo} width="100px" height="100px" className="bg-secondary square rounded-circle" alt="Afriscope Logo" />
                <div>
                    <h6>{category}</h6>
                    <p>Post Time Here</p>
                </div>
            </div>
            <h4>{title}</h4>
            <p>{content}</p>
            <div className="d-inline-flex">
                Meta Here
            </div>
        </div>
      </div>
    );
  }
  
  export default Postcard;