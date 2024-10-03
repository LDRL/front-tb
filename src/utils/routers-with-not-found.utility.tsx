import { Route, Routes } from 'react-router-dom'

interface Props {
    children: JSX.Element[] | JSX.Element;
}

function RoutersWitNotFound({children}: Props) {
  return (
    <Routes>
        {children}
        <Route path="*" element={<div> Not found</div>}/>
    </Routes>
  )
}

export default RoutersWitNotFound