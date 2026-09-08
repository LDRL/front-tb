import React, {Fragment} from 'react';
import "./CardForm.css"

interface CardFormProps {
    titulo: string;
    subtitulo: string;
    col?: number;
    noPaddingXContent?: boolean;
    noPaddingYContent?: boolean;
    children?: React.ReactNode;
}

function CardForm({titulo, subtitulo, children }: CardFormProps) {
    return (
        <Fragment>
            <div className='card page-title-card'>
                <h4 className="titulo">{subtitulo} {titulo}</h4>
                
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
