import React, { useEffect } from 'react'
import { Scanner } from '../../assets'

const ScannerPage = () => {
  useEffect(() => {
    console.log('Rendering Scanner image with animation');
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <img 
        src={Scanner} 
        alt="Scanner" 
        style={{ 
          width: '300px', 
          height: 'auto', 
          animation: 'pulse 2s infinite' 
        }}
      />
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default ScannerPage
