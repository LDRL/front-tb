import React, {Fragment} from 'react';
import "./CardForm.css"

interface CardFormProps {
    titulo: string;
    subtitulo: string;
    col?: number;
    noPaddingXContent?: boolean;
    noPaddingYContent?: boolean;
    action?: React.ReactNode;
    children?: React.ReactNode;
}

function CardForm({titulo, subtitulo, action, children }: CardFormProps) {
    return (
        <Fragment>
            <div className='card page-title-card'>
                <h4 className="titulo">{subtitulo} {titulo}</h4>
                {action && (
                    <div style={{ marginLeft: 'auto' }}>
                        {action}
                    </div>
                )}
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
