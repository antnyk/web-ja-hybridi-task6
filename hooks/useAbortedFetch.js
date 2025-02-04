import { useEffect, useState, useRef } from "react";

const useAbortedFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const controllerRef = useRef()

  useEffect(() => {
    getData(url)
  }, [url])

  const getData = (url) => {
    if (controllerRef.current){
      controllerRef.current.abort()
    }
    controllerRef.current = new AbortController()
    const signal = controllerRef.current.signal

    setLoading(true)
    fetch(url, {signal})
      .then(res => res.json())
      .then((json) => {
        setLoading(false)
        setData(json)
      }).catch((error) => {
        setError(error)
        setLoading(false)
      })
  }

  return { data, loading, error}
}

export default useAbortedFetch
