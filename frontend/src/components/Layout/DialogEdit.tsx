import React, { useState } from 'react';

interface ModuleEditDialogProps {
    id: number;  
    initialModuleName: string; 
    onClose: () => void;
    onSave: (id: number, moduleName: string) => void; 
}

const ModuleEditDialog: React.FC<ModuleEditDialogProps> = ({ id, initialModuleName, onClose, onSave }) => {
    const [moduleName, setModuleName] = useState(initialModuleName);

    const handleSaveClick = () => {
        onSave(id, moduleName);
        onClose();
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog-content">
                <div className="dialog-header">
                    <h4>Редактировать модуль</h4>
                </div>
                <div className="dialog-body">
                    <input
                        type="text"
                        placeholder="Введите новое название модуля"
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

export default ModuleEditDialog;
