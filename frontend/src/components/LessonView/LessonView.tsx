import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import Preloader from '../common/preloader/Preloader';
import { textSpanContainsTextSpan } from 'typescript';

enum ItemType {
    BUTTON = 'button',
    TEXT = 'text',
    VIDEO = 'video',
    FILE = 'file',
    DESCRIPTION = 'description',
    HOMEWORK = 'homework',
}

interface Props {
    contentBD: string;
    isFetching: boolean;
    getFilesByLessonAndElementId(elementId: string): Promise<File[]>;
    postFiles(files: { id: string; file: File }[]): void;
}

interface LessonElement {
    id: number;
    type: ItemType;
    data?: any;
}

const LessonView: React.FC<Props> = ({ contentBD, isFetching, getFilesByLessonAndElementId, postFiles }) => {
    const [lessonElements, setLessonElements] = useState<LessonElement[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<{ id: string; file: File }[]>([]);

    const handleUpdateElementData = (id: number, newData: any) => {
        const newLessonElements = lessonElements.map((element) =>
            element.id === id ? { ...element, data: newData } : element
        );
        setLessonElements(newLessonElements);
    };
    useEffect(() => {
        const fetchInitialContent = async () => {
            const initialLessonElements = await generateInitialContent(contentBD);
            setLessonElements(initialLessonElements);
        };

        fetchInitialContent();
    }, [contentBD]);
    
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newUploadedFiles = [...uploadedFiles];
            for (let i = 0; i < files.length; i++) {
                // Создаем уникальный идентификатор для файла
                const fileId = `file_${Date.now()}_${i}`;
                newUploadedFiles.push({ id: fileId, file: files[i] });
            }
            setUploadedFiles(newUploadedFiles);
        }
    };

    const generateInitialContent = async (jsonData: string): Promise<LessonElement[]> => {
        try {
            const parsedData = JSON.parse(jsonData.replace(/'/g, '"'));

            const promises = parsedData.map(async (element: any, index: number) => {
                switch (element.type) {
                    case ItemType.BUTTON:
                        return { id: index, type: ItemType.BUTTON, data: { buttonName: element.buttonName, link: element.link } };
                    case ItemType.TEXT:
                        return { id: index, type: ItemType.TEXT, data: { text: element.text } };
                    case ItemType.VIDEO:
                        return { id: index, type: ItemType.VIDEO, data: { video: element.video } };
                    case ItemType.FILE:
                        const file = await getFilesByLessonAndElementId(element.fileId);
                        return { id: index, type: ItemType.FILE, data: { file: file, fileId: element.fileId, fileName: element.fileName } };
                    case ItemType.DESCRIPTION:
                        return { id: index, type: ItemType.DESCRIPTION, data: { description: element.description } };
                    case ItemType.HOMEWORK:
                        const homeworkFile = await getFilesByLessonAndElementId(element.fileId);
                        return { id: index, type: ItemType.HOMEWORK, data: { file: homeworkFile, fileId: element.fileId, fileName: element.fileName, description: element.description } };
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

    const LessonElement: React.FC<LessonElement> = ({ id, type, data }) => {
        switch (type) {
            case ItemType.BUTTON:
                return (
                    <div className="width-container center">
                    <a href={data.link} target="_blank" rel="noopener noreferrer">
                        <button className="input-constructor">
                            {data.buttonName}
                        </button>
                    </a>
                    </div>
                );
            case ItemType.TEXT:
                return (
                    <div className="form-input-lesson form-input-up width-container">
                        {data.text}
                    </div>
                );
            case ItemType.VIDEO:
                return (
                    <div className="video-container width-container">
                        <ReactPlayer className="player" width="80%"  url={data.video} controls={true} />
                    </div>
                );
            case ItemType.FILE:
                return (
                    <div className="file-info center">
                        <p>Файл: {data.fileName}</p>
                        <div className="file-actions">
                            <button className="file-button file-input-constructor" onClick={() => handleViewFile(data)}>Посмотреть</button>
                            <a className="file-button file-input-constructor"  onClick={() => handleDownloadFile(data)}>Скачать</a>
                        </div>
                    </div>
                );
            case ItemType.DESCRIPTION:
                return (
                    <div className="form-input-desctiption form-input-p form-input-desc width-container ">
                        <p>{data.description}</p>
                    </div>
                );
            case ItemType.HOMEWORK:
                return (
                    <div className="file-upload-container width-container"> 
                         <div className="form-input-lesson form-input-up width-container">Домашнее задание</div>
                         <p className="form-input-desctiption form-input-p form-input-desc width-container " style={{ textAlign: 'left' }}> {data.description}</p>
                        <div className="file-info center ">
                            <p>Файл: {data.fileName}</p>
                            <div className="file-actions">
                                <button className="file-button file-input-constructor" onClick={() => handleViewFile(data)}>Посмотреть</button>
                                <a className="file-button file-input-constructor"  onClick={() => handleDownloadFile(data)}>Скачать</a>
                            </div>
                        </div>
                        <div className='center'>
                        <div className="file-upload-container width-container">
                            <div className="file-container center">
                                <label   className="file-button file-input-constructor">Загрузите файл
                                    <input className="file-input-nove form-input-p"  type="file" onChange={handleFileUpload} />
                                </label>
                            </div>
                            {uploadedFiles.map((uploadedFile, index) => (
                                    <div key={index} className="file-info center">
                                        <p>Имя файла: {uploadedFile.file.name}</p>
                                        <div className="file-actions">
                                            <button className="file-button file-input-constructor" onClick={() => handleViewFile({ file: [uploadedFile.file] })}>Посмотреть</button>
                                            <a className="file-button file-input-constructor" onClick={() => handleDownloadFile({ file: [uploadedFile.file] })}>Скачать</a>
                                        </div>
                                    </div>
                                ))}
                        <div className="center">
                            <button className="btn btn-c" onClick={()=>postFiles(uploadedFiles)}>Отправить домашнее задание</button>
                        </div>
                    </div>
                        </div>
                    </div>
                    
                );
            default:
                return null;
        }
    };

    const handleViewFile = async (data: any) => {
        if (data.file[0]?.id) {
            const files = await getFilesByLessonAndElementId(data.file[0].id);
            if (files.length > 0) {
                const file_field = data.file[0].file_field;
                const file = files[0];
                if (file && file_field) {
                    const url = `${baseUrl}/${file_field}`;
                    window.open(url, '_blank');
                }
            }
        }
    };

    const handleDownloadFile = async (data: any) => {
        if (data.file[0]?.id) {
            const files = await getFilesByLessonAndElementId(data.file[0].id);
            if (files.length > 0) {
                const file_field = data.file[0].file_field;
                const file = files[0];
                if (file && file_field) {
                    const url = `${baseUrl}/${file_field}`;
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('File not found or server error');
                    }
                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = file_field || 'download';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(downloadUrl);
                    document.body.removeChild(a);
                }
            }
        }
    };

    const baseUrl = 'http://localhost:8000';

    return (
        <div className='wrapper'>
                <div className="lesson-constructor">
                    <div className="width-container">
                    {isFetching ? <Preloader /> : null}
                    {lessonElements.map((element, index) => (
                        <LessonElement key={index} id={element.id} type={element.type} data={element.data} />
                    ))}
                    </div>
                </div>
        </div>
    );
};

export default LessonView;
