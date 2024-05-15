import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LessonCreationDialogProps {
    onClose: () => void;
    onSave: (lesson_name: string, module_id: number) => void;
    activeModuleId: number | null;
}

const LessonCreationDialog: React.FC<LessonCreationDialogProps> = ({ onClose, onSave, activeModuleId }) => {
    const navigate = useNavigate();
    const [lessonName, setLessonName] = useState('');
    const handleSaveClick = () => {
      
        if (activeModuleId !== null) {
            onSave(lessonName, activeModuleId);
        } else {
            console.error('Ошибка: ID модуля не может быть null');
        }
        onClose(); 
        
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog-content">
                <div className="dialog-header">
                    <h4>Создать урок</h4>
                </div>
                <div className="dialog-body">
                    <input
                        type="text"
                        placeholder="Введите название урока"
                        value={lessonName}
                        onChange={e => setLessonName(e.target.value)}
                        className="dialog-input"
                        maxLength={30}
                    />
                </div>
                <div className="dialog-footer">
                    <button onClick={onClose} className="dialog-button">
                        Отмена
                    </button>
                    <button
                        onClick={handleSaveClick}
                        disabled={!lessonName.trim()}
                        className="dialog-button dialog-button-primary"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonCreationDialog;

