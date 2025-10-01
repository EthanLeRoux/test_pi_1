import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [motions, setMotions] = useState([]) // store motions
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch motion records from API
  useEffect(() => {
    const fetchMotions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/motion/all') // replace with your API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMotions(data)
      } catch (err) {
        console.error('Error fetching motions:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMotions()
  }, [])

  return (
    <>
      <nav className="navbar">
        <h1>Ping Patrol Security</h1>
      </nav>

      <div className="container">
        {loading && <p>Loading motions...</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && motions.length === 0 && <p>No motion records found.</p>}
        <div className="cards">
          {!loading &&
            !error &&
            motions.map((motion) => (
              <div className="card" key={motion._id}>
                <div className="image-placeholder">📷</div>
                <div className="card-content">
                  <p>
                    <strong>Duration:</strong> {motion.motionDuration}s
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(motion.motionDatetime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Location:</strong> Lat {motion.motionLocation.lat}, Long {motion.motionLocation.long}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default App
