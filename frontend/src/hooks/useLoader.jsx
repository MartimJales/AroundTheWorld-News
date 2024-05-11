import { useState } from 'react'

function useLoader() {
    const [loading, setLoading] = useState(true)

    return { loading, setLoading }
}

export default useLoader