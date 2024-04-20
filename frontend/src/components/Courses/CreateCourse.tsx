import { SetStateAction, useState } from 'react';
import none from '../../img/none.png'

interface Props {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    previewImageUrl: string | null;
    errors: { [key: string]: string };
}

const CreateCourse: React.FC<Props> = ({
    handleInputChange,
    handleFileChange,
    handleFormSubmit,
    previewImageUrl,
    errors
}) => {
    const baseUrl = 'http://localhost:8000';

    const [name, setName] = useState('');
    const [nameFocused, setNameFocused] = useState(false);
    const defaultName = 'Введите название курса';

    const handleNameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setName(event.target.value);
    };

    const handleNameFocus = () => {
        setNameFocused(true);
    };

    const handleNameBlur = () => {
        setNameFocused(false);
        if (!name.trim()) {
            setName('');
        }
    };

    const [description, setDescription] = useState('');
    const [descriptionFocused, setDescriptionFocused] = useState(false);
    const defaultDescription = 'Введите описание курса';

    const handleDescriptionChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setDescription(event.target.value);
    };

    const handleDescriptionFocus = () => {
        setDescriptionFocused(true);
    };

    const handleDescriptionBlur = () => {
        setDescriptionFocused(false);
        if (!description.trim()) {
            setDescription('');
        }
    };

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
                                name="name"
                                className={`form-input form-input-p form-input-up ${nameFocused || name ? 'white-text' : 'gray-text'}`}
                                value={name}
                                onChange={handleNameChange}
                                onFocus={handleNameFocus}
                                onBlur={handleNameBlur}
                                placeholder={nameFocused || name ? '' : defaultName}
                                rows={3}
                                maxLength={69} 
                            />
                        </div>
                        <div className="image-subtitle image-subtitle-up image-subtitle-block image-subtitle-create">
                        <textarea
                            name="description"
                            className={`form-input form-input-p form-input-desc ${descriptionFocused ? 'white-text' : 'gray-text'} ${errors.description ? 'error-input' : ''}`}
                            value={description}
                            onChange={handleDescriptionChange}
                            onFocus={handleDescriptionFocus}
                            onBlur={handleDescriptionBlur}
                            placeholder={descriptionFocused || description ? '' : defaultDescription}
                            rows={4} 
                            maxLength={112}
                            />
                            {errors.description && <p className="error-message">{errors.description}</p>}
                        </div>
                        <div className="btn_start btn_start-up">
                        <input type="file" name="picture" id="file-input" className="file-input form-input-p" onChange={handleFileChange} accept="image/*" />
                            <label htmlFor="file-input" className="file-button">Загрузить новое изображение</label>
                            
                        </div>
                        
                    </div>
                    <div className='btn_save'><button type="submit" className="btn">Создать</button></div>
                </form>
            </section>
        </div>  
    </>
);}

export default CreateCourse;