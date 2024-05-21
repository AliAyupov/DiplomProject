import React, { useState } from 'react';

interface Props {
    onClose: () => void;
    onSave: (mail: string, setError: (message: string) => void) => void;
}

const TutorCreateDialog: React.FC<Props> = ({ onClose, onSave }) => {
    const [mail, setMail] = useState('');
    const [error, setError] = useState('');

    const handleSaveClick = () => {
        setError(''); // Сбросить ошибку перед сохранением
        onSave(mail, (message: string) => {
            setError(message);
            
            if (!message) {
                onClose();
            }
        });
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog-content">
                <div className="dialog-header">
                    <h4>Назначить преподавателя</h4>
                </div>
                <div className="dialog-body">
                    <input
                        type="text"
                        placeholder="Введите почту пользователя"
                        value={mail}
                        onChange={e => setMail(e.target.value)}
                        className="dialog-input"
                        maxLength={30}
                    />
                    {error && <div className="error-message">{error}</div>}
                </div>
                <div className="dialog-footer">
                    <button onClick={onClose} className="dialog-button">
                        Отмена
                    </button>
                    <button
                        onClick={handleSaveClick}
                        disabled={!mail.trim()}
                        className="dialog-button dialog-button-primary">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorCreateDialog;
