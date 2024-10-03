import React, { CSSProperties, Fragment} from 'react';
import "./CardForm.css"

interface CardFormProps {
    titulo: string;
    subtitulo: string;
    col?: number;
    noPaddingXContent?: boolean;
    noPaddingYContent?: boolean;
    children?: React.ReactNode;
}





function CardForm({titulo, subtitulo, col = 8, noPaddingXContent, noPaddingYContent, children }: CardFormProps) {

    // const {noPaddingXContent, noPaddingYContent} = props;
    return (
        <Fragment>
            {/* className="d-flex align-items-baseline ml-3" style={{position: "relative", borderBottom:"2px solid #359D9E" }} */}

            <div className='card ml-3'>
                {/* <img src={require(`assets/img/icons/${props.icon}.png`)} alt="Usuario" className="title_img mr-2"/> */}
                {/* <img src={require('assets/img/icons/linea.png')} alt="Linea" className="title_img mr-2"/> */}
                <h2 className="mr-2 titulo">{titulo}</h2>
                {/* <img src={require('assets/img/icons/linea.png')} alt="Linea" className="title_img mr-2"/> */}
                <span className="subtitulo">{subtitulo}</span>
            </div>

            <div className="mb-4 card-tabla">
                <div>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </Fragment>

    )
}

export default CardForm;
