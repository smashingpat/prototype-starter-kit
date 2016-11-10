import React from 'react'

const Button = ({
    children,
    onClick
}) => (
    <button className="btn btn-default" onClick={onClick}>
        {children}
    </button>
)

export default Button
