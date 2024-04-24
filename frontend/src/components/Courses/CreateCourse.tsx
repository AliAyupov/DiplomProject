import { useState } from 'react';
import none from '../../img/balvan-foto.jpg';


interface Props {
    handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    previewImageUrl: string | null;
    errors: { [key: string]: string };
    setCourseName:(courseName: string) => void;
    setCourseDescription:(description: string) => void;
    setImages: (picture: string) => void;
    courseNameCreate: string;
    descriptionCreate: string;
    picture:string;
}

const CreateCourse: React.FC<Props> = ({
    handleFormSubmit,
    handleFileChange,
    errors,
    setCourseName,
    setCourseDescription,
    setImages,
    courseNameCreate,
    descriptionCreate,
    previewImageUrl,
}) => {
    const baseUrl = 'http://localhost:8000';
    const defaultName = 'Введите название курса';
    const defaultDescription = 'Введите описание курса';
    const [nameFocused, setNameFocused] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);
    const [localCourseName, setLocalCourseName] = useState('');
    const [localDescription, setLocalDescription] = useState('');
    const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalCourseName(event.target.value);
        setCourseName(event.target.value);
    };

    const handleNameFocus = () => setNameFocused(true);
    const handleNameBlur = () => setNameFocused(false);
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalDescription(event.target.value);
        setCourseDescription(event.target.value)
    };
    const handleDescriptionFocus = () => setDescriptionFocused(true);
    const handleDescriptionBlur = () => setDescriptionFocused(false);
    
    return (      
            <><div className="wrapper"> 
                <div className="margin"></div>
                <section>
                <form onSubmit={handleFormSubmit} encType="multipart/form-data" className='form form-create'>
                    {previewImageUrl ? (
                        <img src={previewImageUrl} alt="Preview" className="wrapper-img-c" />
                    ) : (
                        <img src={none} alt="Изображение отсутствует" className="wrapper-img-c" />
                    )}
                    <div className="grid-absolut-c grid-absolut-create">
                        <div className="image-title image-title-up">
                        <textarea
                                name="courseName"
                                className={`form-input form-input-p form-input-up ${nameFocused || localCourseName ? 'white-text' : 'gray-text'}`}
                                value={localCourseName}
                                onChange={handleNameChange}
                                onFocus={handleNameFocus}
                                onBlur={handleNameBlur}
                                placeholder={nameFocused || localCourseName ? '' : defaultName}
                                rows={3}
                                maxLength={69} 
                            />
                        </div>
                        <div className="image-subtitle image-subtitle-up image-subtitle-block image-subtitle-create">
                        <textarea
                            name="description"
                            className={`form-input form-input-p form-input-desc ${localDescription ? 'white-text' : 'gray-text'} ${errors.description ? 'error-input' : ''}`}
                            value={localDescription}
                            onChange={handleDescriptionChange}
                            onFocus={handleDescriptionFocus}
                            onBlur={handleDescriptionBlur}
                            placeholder={descriptionFocused || localDescription ? '' : defaultDescription}
                            rows={4} 
                            maxLength={112}
                            />
                            {errors.description && <p className="error-message">{errors.description}</p>}
                        </div>
                        <div className="btn_start btn_start-up btn_start-create">
                            <input type="file" name="picture" id="file-input" className="file-input form-input-p" onChange={handleFileChange} accept="image/*" />
                            <label htmlFor="file-input" className="file-button file-button-create">Загрузить новое изображение</label>   
                        </div>
                    </div>
                    <div className='btn_save'><button type="submit" className="btn">Сохранить</button></div>
                </form>
            </section>
        </div>  
    </>
);}

export default CreateCourse;