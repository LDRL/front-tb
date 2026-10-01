import React, {Fragment} from 'react';
import "./CardForm.css"

interface CardFormProps {
    titulo: string;
    subtitulo: string;
    col?: number;
    noPaddingXContent?: boolean;
    noPaddingYContent?: boolean;
    action?: React.ReactNode;
    leadingAction?: React.ReactNode;
    children?: React.ReactNode;
}

function CardForm({titulo, subtitulo, action, leadingAction, children }: CardFormProps) {
    const hasLeading = !!leadingAction;

    return (
        <Fragment>
            <div className={`card page-title-card${hasLeading ? ' page-title-card--leading' : ''}`}>
                {leadingAction && (
                    <div className="leading-action">
                        {leadingAction}
                    </div>
                )}
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
