import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactPlayer from 'react-player';

// Определение типов перетаскиваемых элементов
enum ItemType {
    BUTTON = 'button',
    TEXT = 'text',
    VIDEO = 'video',
    FILE = 'file',
    DESCRIPTION = 'description',
}

const CreateLesson = () => {
    const [lessonElements, setLessonElements] = useState<{ type: ItemType }[]>([]);
    
    // Компонент элемента урока
    const LessonElement: React.FC<{ type: ItemType }> = ({ type }) => {
        const [videoLink, setVideoLink] = useState('');
        const [uploadedFile, setUploadedFile] = useState<File | null>(null);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setVideoLink(e.target.value);
        };

        const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                setUploadedFile(files[0]);
            }
        };

        const [{ isOver }, drop] = useDrop({
            accept: [ItemType.BUTTON, ItemType.TEXT, ItemType.VIDEO, ItemType.FILE, ItemType.DESCRIPTION],
            drop: (item: any) => handleDrop(item),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        });

        const handleRemoveElement = () => {
            const newLessonElements = lessonElements.filter((element) => element.type !== type);
            setLessonElements(newLessonElements);
        };

        let content = null;
        switch (type) {
            case ItemType.BUTTON:
                content = (
                    <>
                        <input placeholder='Название кнопки' type='text' className="input-constructor" />
                        <input placeholder='Ссылка' type='text' className="input-link" />
                    </>
                );
                break;
            case ItemType.TEXT:
                content = (
                    <textarea
                        name="courseName"
                        className={`form-input-lesson form-input-up`}
                        placeholder="Введите заголовок"
                        rows={3}
                    />
                );
                break;
            case ItemType.VIDEO:
                content = (
                    <>
                        <input
                            placeholder='Ссылка на видео'
                            type='text'
                            className="input-constructor"
                            value={videoLink}
                            onChange={handleInputChange}
                        />
                        <ReactPlayer url={videoLink} controls={true} />
                    </>
                );
                break;
            case ItemType.FILE:
                content = (
                    <div className="file-upload-container">
                        <div className="file-container">
                            <input className="file-input-nove form-input-p " id="file-input" type="file" onChange={handleFileUpload} />
                            <label htmlFor="file-input" className="file-button">Загрузите файл</label>
                        </div>
                        {uploadedFile && (
                            <div className="file-info">
                                <p>Имя файла: {uploadedFile.name}</p>
                                <div className="file-actions">
                                    <button onClick={() => window.open(URL.createObjectURL(uploadedFile), '_blank')}>
                                        Посмотреть
                                    </button>
                                    <a href={URL.createObjectURL(uploadedFile)} download={uploadedFile.name}>
                                        Скачать
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                );
                break;
            case ItemType.DESCRIPTION:
                content = (
                    <textarea
                        name="description"
                        className={`form-input-desctiption form-input-p form-input-desc`}
                        placeholder="Введите описание"
                        rows={4}
                    />
                );
                break;
            default:
                content = null;
        }

        return (
            <div className="element-constructor">
                <div className='delete'>
                    <button className="btn btn-c btn-del" onClick={handleRemoveElement}>🗑</button>
                </div>
                <div ref={drop} className={`lesson-element ${isOver ? 'over' : ''}`}>
                    {content}
                </div>
            </div>
        );
    };

    // Компонент кнопки для перетаскивания
    const DraggableButton: React.FC<{ type: ItemType }> = ({ type }) => {
        const [, drag] = useDrag({
            type,
            item: { type },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        const handleAddElement = () => {
            const newLessonElements = [...lessonElements, { type }];
            setLessonElements(newLessonElements);
        };

        return (
            <button onClick={handleAddElement} ref={drag} className={`draggable-item draggable-${type}`}>
                {type === ItemType.BUTTON ? (
                    <button className="button-constructor">Кнопка</button>
                ) : type === ItemType.TEXT ? (
                    <button className="button-constructor">Заголовок</button>
                ) : type === ItemType.VIDEO ? (
                    <button className="button-constructor">Видео</button>
                ) : type === ItemType.DESCRIPTION? (
                    <button className="button-constructor">Описание</button>
                ) : type === ItemType.FILE ? (
                    <button className="button-constructor">Файл</button>
                ) : null}
            </button>
        );
    };

    // Функция для обработки события сброса
    const handleDrop = (item: any) => {
        if ([ItemType.BUTTON, ItemType.TEXT, ItemType.VIDEO, ItemType.FILE, ItemType.DESCRIPTION].includes(item.type)) {
            const newLessonElements = [...lessonElements, { type: item.type }];
            setLessonElements(newLessonElements);
        }
    };

    // Функция для перемещения элемента вверх
    const handleMoveUp = (index: number) => {
        if (index > 0) {
            const newLessonElements = [...lessonElements];
            [newLessonElements[index - 1], newLessonElements[index]] = [newLessonElements[index], newLessonElements[index - 1]];
            setLessonElements(newLessonElements);
        }
    };

    // Функция для перемещения элемента вниз
    const handleMoveDown = (index: number) => {
        if (index < lessonElements.length - 1) {
            const newLessonElements = [...lessonElements];
            [newLessonElements[index], newLessonElements[index + 1]] = [newLessonElements[index + 1], newLessonElements[index]];
            setLessonElements(newLessonElements);
        }
    };

    // Компонент холста урока
    const LessonCanvas: React.FC = () => {
        const [, drop] = useDrop({
            accept: [ItemType.BUTTON, ItemType.TEXT, ItemType.VIDEO, ItemType.FILE, ItemType.DESCRIPTION],
            drop: (item: any) => handleDrop(item),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        });

        return (
            <div className="lesson-canvas" ref={drop}>
                {lessonElements.map((element, index) => (
                    <div className="backgroud-element" key={index}>
                        <LessonElement type={element.type} />
                        <button className='btn-const' onClick={() => handleMoveUp(index)} disabled={index === 0}>
                            ↑
                        </button>
                        <button className='btn-const' onClick={() => handleMoveDown(index)} disabled={index === lessonElements.length - 1}>
                            ↓
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="lesson-constructor">
                <div className="lesson-elements">
                    <DraggableButton type={ItemType.BUTTON} />
                    <DraggableButton type={ItemType.TEXT} />
                    <DraggableButton type={ItemType.VIDEO} />
                    <DraggableButton type={ItemType.FILE} />
                    <DraggableButton type={ItemType.DESCRIPTION} />
                </div>
                <LessonCanvas />
            </div>
        </DndProvider>
    );
};
export default CreateLesson;
