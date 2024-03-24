import React from 'react'
import { Link } from 'react-router-dom'

export const Error = ({ status, document, image, token }) => {
    const error = {
      '204': {
        description:'No Content',
        message: `No ${document}`,
        image: {
          source: image || '/media/error_no_document_(1).webp',
          width: "200px"
        }
      },
      '401': {
        description:'Access Denied',
        message: 'Content of this page is restricted for authorized users only',
        image: {
          source: image || '/media/error_no_access.png',
          width: "50px"
        }
      },
      '404': {
        description:`${document} Not Found`,
        message: `The ${document?.toLowerCase()} you are looking for cannot be found. Either it doesn't exist or it has been moved`,
        image: {
          source: image || '/media/error_404.png',
          width: "150px"
        }
      },
      '500': {
        description:'Internal Server Error',
        message: `Problem trying to connect to server.`,
        image: {
          source: image || '/media/internal_server_error.avif',
          width: "100px"
        }
      }
    }

    return (
        <section className="container-md mx-auto mb-auto text-center align-items-center" style={{textTransform:"capitalize"}}>
            <img src={error[status].image.source} width={error[status].image.width} className="pb-3" alt="error" />
            {status !== "204" && <h6 className="fw-semibold">{error[status].description.toUpperCase()}</h6>}
            <p className="mb-0">{error[status].message}{status === "500" && <Link className="text-black fw-semibold" onClick={()=>window.location.reload()}> Please retry</Link>}</p>
            {status === "401"?
              <Link className="text-white btn-primary px-3 py-2 fw-semibold" to={token?"/":"/signin"} type="button"><i className={`fas ${token?"fa-home":"fa-right-to-bracket"} pe-2`}></i>{token?"Back to home":"Sign In"}</Link>:
              (status !== "204" && status !=="500") && <Link className="text-white btn-primary px-3 py-2 my-5 fw-semibold" to="/" type="button"><i className={`fas fa-home pe-2`}></i>Back to home</Link>
            }
        </section>
    )
}

export class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = { hasError: false }
  }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

  render() {
    if (this.state.hasError) {
      return  (
        <div className="container-md mx-auto mb-auto">
          <section>
            <Error status = '500' image = '/media/error_network.png' />
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}