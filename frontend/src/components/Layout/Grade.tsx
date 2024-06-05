import React, { useState } from 'react';

interface GradeDialogProps {
    onClose: () => void;
    onSave: (grade: number) => void;
}

const GradeDialog: React.FC<GradeDialogProps> = ({ onClose, onSave }) => {
    const [grade, setGrade] = useState<number | null>(null);

    const handleSaveClick = () => {
        if (grade !== null) {
            onSave(grade);
            onClose();
        }
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog-content">
                <div className="dialog-header">
                    <h4>Выставить оценку</h4>
                </div>
                <div className="dialog-body">
                    <div className="grade-options">
                        {[1, 2, 3, 4, 5].map(value => (
                            <label key={value} className="grade-option">
                                <input className='zoom'
                                    type="radio"
                                    name="grade"
                                    value={value}
                                    checked={grade === value}
                                    onChange={() => setGrade(value)}
                                />
                                {value}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="dialog-footer">
                    <button onClick={onClose} className="dialog-button">
                        Отмена
                    </button>
                    <button
                        onClick={handleSaveClick}
                        disabled={grade === null}
                        className="dialog-button dialog-button-primary"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GradeDialog;
