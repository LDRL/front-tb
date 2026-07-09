import { CSSProperties, useState } from 'react';
import { ClipLoader } from 'react-spinners';

interface LoadMaskProps {
    loading?: boolean
}

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  
function LoadMask({loading}: LoadMaskProps){
    // const [loading, setLoading] = useState(true)
    const [color] = useState("#ffffff")

    return (
        <>
            {
                loading && (
                    <div className="sweet-loading">                     
                    <ClipLoader
                      color={color}
                      loading={loading}
                      cssOverride={override}
                      size={150}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                )    
            }
        </>
     )
}

export default LoadMask;