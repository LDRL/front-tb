import { CSSProperties, useState } from "react";
import { GridLoader, MoonLoader } from "react-spinners";


interface LoaderProps {
    loading: boolean;
}

const override: CSSProperties = {
    display: "block",        
    margin: "auto",           
    borderColor: "red",       
    position: "absolute",     
    top: "50%",               
    left: "50%",              
    transform: "translate(-50%, -50%)", 
    zIndex: 9999,             
  };




function Loading({loading}: LoaderProps) {
    const [color] = useState("#66bde9")

    return (
        <div className="sweet-loading">
          <GridLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={24}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
    );
}

export default Loading;