import React from 'react'

function Icon({ icon = "" }) {
    return (
        <span className="material-symbols-outlined">
            {icon}
        </span>
    )
}

export default Icon