import React, { useState } from 'react';

interface ModuleCreationDialogProps {
    onClose: () => void;
    onSave: (moduleName: string) => void;
}

const ModuleCreationDialog: React.FC<ModuleCreationDialogProps> = ({ onClose, onSave }) => {
    const [moduleName, setModuleName] = useState('');

    const handleSaveClick = () => {
        onSave(moduleName);
        onClose(); 
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog-content">
                <div className="dialog-header">
                    <h4>Создать модуль</h4>
                </div>
                <div className="dialog-body">
                    <input
                        type="text"
                        placeholder="Введите название модуля"
                        value={moduleName}
                        onChange={e => setModuleName(e.target.value)}
                        className="dialog-input"
                        maxLength={37}
                    />
                </div>
                <div className="dialog-footer">
                    <button onClick={onClose} className="dialog-button">
                        Отмена
                    </button>
                    <button
                        onClick={handleSaveClick}
                        disabled={!moduleName.trim()}
                        className="dialog-button dialog-button-primary"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModuleCreationDialog;

