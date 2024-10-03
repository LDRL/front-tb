// import React, { Component } from 'react';
// import Loader from 'react-loader-spinner';
// import PropTypes from 'prop-types';
// import classnames from 'classnames';
import { CSSProperties, useState } from 'react';
import Loading from '../Loading';
import { ClipLoader } from 'react-spinners';

// require('./LoadMask.css');

// class LoadMask extends Component {
//     static propTypes = {
//       radius: PropTypes.bool,
//       loading: PropTypes.bool.isRequired,
//       dark: PropTypes.bool,
//       blur: PropTypes.bool,
//       light: PropTypes.bool,
//     };

//     static defaultProps = {
//       radius: false,
//       dark: false,
//       blur: false,
//       light: false,
//       noShowLoader: false,
//       noShowLoaderInfo: false,
//       noShowInfoColumn: false,
//     };

//     render() {
//       const {
//         noShowLoader, noShowLoaderInfo, title, message, noShowInfoColumn,
//         children, radius, dark, light, blur, loading, type="Triangle"
//       } = this.props;

//       return (
//         <div className="load-mask">
//           {!noShowLoader && loading && (
//             <div
//               className={classnames(`loader-container d-flex ${noShowInfoColumn ? 'flex-row align-items-center' : 'flex-column justify-content-center'}`, {
//                 radius,
//                 dark,
//                 light,
//               })}
//             >
//               <Loader
//                 type={type}
//                 color="#035b2f"
//                 height="100"
//                 width="100"
//               />
//               { !noShowLoaderInfo && (
//                 <div className="d-flex flex-column align-items-center">
//                   <h3>{title !== undefined ? title : 'ESPERE...'}</h3>
//                   <p>{message !== undefined ? message : 'Se están completando las acciones'}</p>
//                 </div>
//               )}
//             </div>
//           )}
//           <div
//             className={classnames('load-mask-content', {
//               loading,
//               blur,
//             })}
//           >
//             {children}
//           </div>
//         </div>
//       );
//     }
// }

// export default LoadMask;

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
    const [color, setColor] = useState("#ffffff")

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