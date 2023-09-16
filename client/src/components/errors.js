import React from 'react'
import { Link } from 'react-router-dom'

export const Error = () => {
    return (
        <div className="container-md text-center my-5 py-5">
            <h1 className="fs-1 fw-semibold text-brand">404</h1>
            <h5 className="fw-semibold">Page not found</h5>
            <p>Oops! The page you are looking for does not exist. it might have been moved or deleted</p>
            <Link className="text-white btn-primary px-3 py-2 fw-semibold" to="/" type="button"><i className="fas fa-home pe-2"></i>Back to home</Link>
        </div>
    )
}

export const Empty = ({ text }) => {
    return(
        <div className="w-100 p-5 text-center align-self-center">
            <img src="/media/no_post.png" width="50px" className="pb-3" alt="nopost" />
            <h6 className="fw-bold">{text}</h6>
        </div>
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
      return this.props.fallback;
    }

    return this.props.children;
  }
}