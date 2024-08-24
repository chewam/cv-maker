import React from "react"

const Logo = () => {
  return (
    <a href="/" className="-m-1.5 p-1.5">
      <span className="sr-only">CV Maker</span>
      <div className="logo-container">
        <svg
          className="logo-star"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="50"
          height="50"
        >
          <path d="M12 2L16 12L12 22L8 12L12 2Z" />
          <path d="M2 12L12 16L22 12L12 8L2 12Z" />
        </svg>
        <svg
          className="logo-smallStar"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="25"
          height="25"
        >
          <path d="M12 2L16 12L12 22L8 12L12 2Z" />
          <path d="M2 12L12 16L22 12L12 8L2 12Z" />
        </svg>
      </div>
    </a>
  )
}

export default Logo
