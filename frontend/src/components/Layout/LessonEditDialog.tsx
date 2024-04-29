import React, { useState } from 'react';

interface LessonEditDialogProps {
    lessonId: number;  
    initialLessonName: string;
    activeModuleId: number | null;
    onClose: () => void;
    onSave: (lessonId: number, dataUpdate: any) => void; 
}

const LessonEditDialog: React.FC<LessonEditDialogProps>= ({ lessonId, initialLessonName, onClose, onSave, activeModuleId }) => {

    const [lessonName, setLessonName] = useState(initialLessonName);

    const handleSaveClick = () => {
        onSave(lessonId, [lessonName, activeModuleId]);
    
        onClose();
    };
    return (
        <div className="dialog-backdrop">
            <div className="dialog-content">
                <div className="dialog-header">
                    <h4>Редактировать название урока</h4>
                </div>
                <div className="dialog-body">
                    <input
                        type="text"
                        placeholder="Введите новое название модуля"
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

export default LessonEditDialog;
