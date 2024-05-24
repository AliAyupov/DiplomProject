import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactPlayer from 'react-player';
import none from '../../img/balvan-foto.jpg';
import Preloader from '../common/preloader/Preloader';
import axiosInstance from '../../http/axios';

enum ItemType {
    BUTTON = 'button',
    TEXT = 'text',
    VIDEO = 'video',
    FILE = 'file',
    DESCRIPTION = 'description',
}
interface Props {
    fetchLessons(codeJSON: string): void;
    contentBD: string;
    isFetching: boolean;
    postFile(file:Blob, id:number): void;
    getFilesByLessonAndElementId(elementId: string): Promise<File[]>;
}

const CreateLesson: React.FC<Props> = ({ fetchLessons, contentBD, isFetching, postFile, getFilesByLessonAndElementId }) => {
    const [lessonElements, setLessonElements] = useState<{ id: number; type: ItemType; data?: any }[]>([]);
    const [nextId, setNextId] = useState(1);
    const [savedLessonCode, setSavedLessonCode] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<{ [id: number]: File | null }>({});
    useEffect(() => {
        const fetchInitialContent = async () => {
            const initialLessonElements = await generateInitialContent(contentBD);
            setLessonElements(initialLessonElements);

            if (initialLessonElements.length > 0) {
                const maxId = Math.max(...initialLessonElements.map(element => element.id));
                setNextId(maxId + 1); // Устанавливаем nextId на максимальное значение id + 1
            } else {
                setNextId(1); // Иначе устанавливаем nextId равным 1
            }
        };
    
        fetchInitialContent();
    }, [contentBD]);

    

    const handleRemoveElement = (id: number) => {
        const newLessonElements = lessonElements.filter((element) => element.id !== id);
        setLessonElements(newLessonElements);
    };
    const addUploadedFile = (idF: number, file: File | null) => {
    
        setUploadedFiles(prevState => ({
            ...prevState,
            [idF]: file
        }));
        console.log(uploadedFiles);
    };
    const handleUpdateElementData = (id: number, newData: any) => {
        
        const newLessonElements = lessonElements.map((element) =>
            element.id === id ? { ...element, data: newData } : element
        );
        setLessonElements(newLessonElements);
    };

    const generateInitialContent = async (jsonData: string): Promise<{ id: number; type: ItemType; data?: any }[]> => {
        try {
            const parsedData = JSON.parse(jsonData.replace(/'/g, '"'));
    
            const initialFiles: { [idF: number]: File[] } = {};
    
            const promises = parsedData.map(async (element: any, index: number) => {
                const ind = index+1;
                switch (element.type) {
                    case ItemType.BUTTON:
                        setNextId(ind);
                        return { id: ind, type: ItemType.BUTTON, data: { buttonName: element.buttonName, link: element.link } };
                    case ItemType.TEXT:
                        setNextId(ind);
                        return { id: ind, type: ItemType.TEXT, data: { text: element.text } };
                    case ItemType.VIDEO:
                        setNextId(ind);
                        return { id: ind, type: ItemType.VIDEO, data: { video: element.video } };
                    case ItemType.FILE:
                        setNextId(ind);
                        const file = await getFilesByLessonAndElementId(element.id);
                        initialFiles[element.id] = file;
                        return { id:ind, type: ItemType.FILE, data: { file:file, fileName: element.fileName } };
                    case ItemType.DESCRIPTION:
                        setNextId(ind);
                        return { id: ind, type: ItemType.DESCRIPTION, data: { description: element.description } };
                    default:
                        return null;
                }
            });
    
            const result = await Promise.all(promises);
    
            return result.filter((element: any) => element !== null);
        } catch (error) {
            console.error('Ошибка при разборе JSON:', error);
            return [];
        }
    };
    
    const handleAddElement = (type: ItemType, data?: any) => {
        setNextId(nextId+1); 
        const newLessonElements = [...lessonElements, { id: nextId, type, data }];
        setLessonElements(newLessonElements);
    };
  const generateLessonCode = () => {
    
    Object.entries(uploadedFiles).forEach(([id, file]) => {
        if (file) {
            postFile(file, parseInt(id, 10)); 
        }
    });

    let code = lessonElements.map((element) => {
       
        switch (element.type) {
            case ItemType.BUTTON:
                return `{
                    "type": "${element.type}",
                    "buttonName": "${element.data?.buttonName || ""}",
                    "link": "${element.data?.link || ""}"
                }`;
            case ItemType.TEXT:
                return `{
                    "type": "${element.type}",
                    "text": "${element.data?.text || ""}"
                }`;
            case ItemType.VIDEO:
                return `{
                    "type": "${element.type}",
                    "video": "${element.data?.video || ""}"
                }`;
            case ItemType.FILE:
                return `{
                    "id": "${element.id}",
                    "type": "${element.type}",
                    "fileName": "${element.data?.fileName || ""}"
                }`;
            case ItemType.DESCRIPTION:
                return `{
                    "type": "${element.type}",
                    "description": "${element.data?.description || ""}"
                }`;
            default:
                return "";
        }
    }).join(",");
    
    setSavedLessonCode(`[${code}]`);
    fetchLessons(`[${code}]`);
};

    const LessonElement: React.FC<{ id: number; type: ItemType; data?: any; onUpdateLink?: (id: number) => void }> = ({ id, type, data }) => {
        const [link, setLink] = useState<string>(data && data?.link || '');
        const [buttonName, setButtonName] = useState<string>(data && data?.buttonName || '');
        const [text, setText]= useState<string>(data && data?.text || '');
        const [video, setVideo]= useState<string>(data && data?.video || '');
        const [description, setDescriotion]= useState<string>(data && data?.description || '');
        const [uploadedFile, setUploadedFile] = useState<File | null>(null);
        
        console.log(id);
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
        const handleInputBlurText = () => {
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

        const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            
            if (file) {
                
                handleUpdateElementData(id, { ...data, fileName: file.name  }); 
                setUploadedFile(file);
                addUploadedFile(id, file);
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
                        onBlur={handleInputBlurText}
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
                            <label   className="file-button file-input-constructor">Загрузите файл
                                <input className="file-input-nove form-input-p"  type="file" onChange={handleFileUpload} />
                            </label>
                        </div>
                        {data && (
                            <div className="file-info">
                                <p>Имя файла: {data.fileName}</p>
                                <div className="file-actions">
                                    <button className="file-button file-input-constructor" >
                                        Посмотреть
                                    </button>
                                    <a className="file-button file-input-constructor" >
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
                {isFetching ? <Preloader key="unique_preloader_key"/> : null}
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
                <div className="center">
                    <button className="btn btn-c" onClick={generateLessonCode}>Сохранить урок</button>
                    
                </div>
            <div>
            </div>
            </div>
            
        </DndProvider>
    );
};

export default CreateLesson;