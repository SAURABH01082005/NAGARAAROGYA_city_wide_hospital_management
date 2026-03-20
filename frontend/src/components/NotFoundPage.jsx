import React from 'react'

function NotFoundPage() {
  return (
      <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 m-20">
          <div className="max-w-2xl mx-auto">
            <label htmlFor="search" className="block text-5xl font-bold mb-3 text-center md:text-left">
              404 Page Not Found!
            </label>
           
          </div>
        </div>
  )
}

export default NotFoundPage