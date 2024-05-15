import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactPlayer from 'react-player';
import none from '../../img/balvan-foto.jpg';

enum ItemType {
    BUTTON = 'button',
    TEXT = 'text',
    VIDEO = 'video',
    FILE = 'file',
    DESCRIPTION = 'description',
}

const CreateLesson = () => {
    const [lessonElements, setLessonElements] = useState<{ id: number; type: ItemType; data?: any }[]>([]);
    const [nextId, setNextId] = useState(1);
    const [savedLessonCode, setSavedLessonCode] = useState<string>('');

    const handleAddElement = (type: ItemType, data?: any) => {
        const newLessonElements = [...lessonElements, { id: nextId, type, data }];
        setLessonElements(newLessonElements);
        setNextId(nextId + 1);
    };

    const handleRemoveElement = (id: number) => {
        const newLessonElements = lessonElements.filter((element) => element.id !== id);
        setLessonElements(newLessonElements);
    };

    const handleUpdateElementData = (id: number, newData: any) => {
        const newLessonElements = lessonElements.map((element) =>
            element.id === id ? { ...element, data: newData } : element
        );
        setLessonElements(newLessonElements);
    };

    const generateLessonCode = () => {
        let code = lessonElements.map((element) => {
            switch (element.type) {
                case ItemType.BUTTON:
                    return `<button>${element.data?.buttonName || 'Кнопка'}</button>`;
                case ItemType.TEXT:
                    return `<p>${element.data || 'Текст'}</p>`;
                case ItemType.VIDEO:
                    return `<video src="${element.data}" controls></video>`;
                case ItemType.FILE:
                    return `<a href="${element.data}" download>Скачать файл</a>`;
                case ItemType.DESCRIPTION:
                    return `<p>${element.data || 'Описание'}</p>`;
                default:
                    return '';
            }
        }).join('');
        
        setSavedLessonCode(code);
    };

    const LessonElement: React.FC<{ id: number; type: ItemType; data?: any; onUpdateLink?: (id: number) => void }> = ({ id, type, data }) => {
        const [link, setLink] = useState<string>(data && data?.link || '');
        const [buttonName, setButtonName] = useState<string>(data && data?.buttonName || '');
        const [text, setText]= useState<string>(data && data?.text || '');
        const [video, setVideo]= useState<string>(data && data?.video || '');
        const [description, setDescriotion]= useState<string>(data && data?.description || '');
        const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setLink(event.target.value);
        };
        const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setVideo(event.target.value);
        };
        const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setDescriotion(event.target.value);
        };
        const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setText(event.target.value);
        };
        const handleButtonNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setButtonName(event.target.value);
        };
        const handleInputBlurOne = () => {
            handleUpdateElementData(id, { ...data, buttonName });
        };
        const handleInputBlur = () => {
            handleUpdateElementData(id, {...data, text});
            
        };
        const handleInputBlurVideo = () => {
            handleUpdateElementData(id, {...data, video});
            
        };
        const handleInputBlurDescription = () => {
            handleUpdateElementData(id, {...data, description});
            
        };
        const handleInputBlurTwo = () => {
            handleUpdateElementData(id, { ...data, link });
        };

        const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                handleUpdateElementData(id, files[0]);
            }
        };

        const handleRemove = () => {
            handleRemoveElement(id);
        };

        let content = null;
        let contentTwo = null;
        switch (type) {
            case ItemType.BUTTON:
                content = (
                    <>
                        <div>
                            <input
                                placeholder='Название кнопки'
                                type='text'
                                name="buttonName"
                                className="input-constructor"
                                value={buttonName}
                                onBlur={handleInputBlurOne}
                                onChange={handleButtonNameChange}
                            />
                        </div>
                    </>
                );
                contentTwo = (
                    <>
                        <div>
                            <input
                                placeholder='Ссылка'
                                type='text'
                                name="link"
                                className="input-link"
                                value={link}
                                onChange={handleLinkChange}
                                onBlur={handleInputBlurTwo}
                            />
                        </div>
                    </>
                );
                break;
            case ItemType.TEXT:
                content = (
                    <textarea
                        name="courseName"
                        className={`form-input-lesson form-input-up`}
                        placeholder="Введите заголовок"
                        value={text}
                        onBlur={handleInputBlur}
                        onChange={handleTextChange}
                    />
                );
                break;
            case ItemType.VIDEO:
                content = (
                    <>
                        <input
                            placeholder='Ссылка на видео'
                            type='text'
                            className="input-link"
                            value={video}
                            onBlur={handleInputBlurVideo}
                            onChange={handleVideoChange}
                        />
                        
                        <div className='video-container'>
                            {data ? (
                                <div className='player-wrapper'>
                                    <ReactPlayer className="player" width="100%" height="100%" url={data} controls={true} />
                                </div>
                            ) : (
                                <img className='video-none' src={none} alt="Картинка" />
                            )}
                        </div>
                    </>
                );
                break;
            case ItemType.FILE:
                content = (
                    <div className="file-upload-container">
                        <div className="file-container">
                            <input className="file-input-nove form-input-p" id="file-input" type="file" onChange={handleFileUpload} />
                            <label htmlFor="file-input" className="file-button file-input-constructor">Загрузите файл</label>
                        </div>
                        {data && (
                            <div className="file-info">
                                <p>Имя файла: {data.name}</p>
                                <div className="file-actions">
                                    <button className="file-button file-input-constructor" onClick={() => window.open(URL.createObjectURL(data), '_blank')}>
                                        Посмотреть
                                    </button>
                                    <a className="file-button file-input-constructor" href={URL.createObjectURL(data)} download={data.name}>
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
                        value={description}
                        onBlur={handleInputBlurDescription}
                        onChange={handleDescriptionChange}
                    />
                );
                break;
            default:
                content = null;
        }

        return (
            <div className="element-constructor">
                <div className='delete'>
                    <button className="btn btn-c btn-del" onClick={handleRemove}>🗑</button>
                </div>
                <div className={`lesson-element`}>
                    {content}
                    {contentTwo ? contentTwo : ''}
                </div>
            </div>
        );
    };

    const DraggableButton: React.FC<{ type: ItemType }> = ({ type }) => {
        const [, drag] = useDrag({
            type,
            item: { type },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        return (
            <button onClick={() => handleAddElement(type)} ref={drag} className={`draggable-item draggable-${type}`}>
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

    const handleDrop = (item: any) => {
        if ([ItemType.BUTTON, ItemType.TEXT, ItemType.VIDEO, ItemType.FILE, ItemType.DESCRIPTION].includes(item.type)) {
            handleAddElement(item.type);
        }
    };

    const handleMoveUp = (index: number) => {
        if (index > 0) {
            const newLessonElements = [...lessonElements];
            [newLessonElements[index - 1], newLessonElements[index]] = [newLessonElements[index], newLessonElements[index - 1]];
            setLessonElements(newLessonElements);
        }
    };

    const handleMoveDown = (index: number) => {
        if (index < lessonElements.length - 1) {
            const newLessonElements = [...lessonElements];
            [newLessonElements[index], newLessonElements[index + 1]] = [newLessonElements[index + 1], newLessonElements[index]];
            setLessonElements(newLessonElements);
        }
    };

    

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
                        <button className='btn-const' onClick={() => handleMoveUp(index)} disabled={index === 0}>
                            ↑
                        </button>
                        <button className='btn-const-one' onClick={() => handleMoveDown(index)} disabled={index === lessonElements.length - 1}>
                            ↓
                        </button>
                        <LessonElement id={element.id} type={element.type} data={element.data} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='wrapper'>
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
            </div>
            <button onClick={generateLessonCode}>Сохранить урок</button>
            <div>
                <h2>Сохраненный JSX код урока:</h2>
                <pre>{savedLessonCode}</pre>
            </div>
        </DndProvider>
    );
};

export default CreateLesson;
