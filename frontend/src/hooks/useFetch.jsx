import React, { useEffect, useState } from 'react'

function useFetch(url) {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [])

    return { error, loading, data }
}

export default useFetch