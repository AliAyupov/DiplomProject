import React, { useState, useRef, ReactNode } from 'react';
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const CreateLesson: React.FC = () => {
    const [lessonElements, setLessonElements] = useState<string[]>([]);
    const [draggedElement, setDraggedElement] = useState<string | null>(null);
    const columnRef = useRef<HTMLDivElement>(null);

    const addElement = (elementType: string) => {
        setLessonElements([...lessonElements, elementType]);
    };

    const removeElement = (index: number) => {
        const newLessonElements = [...lessonElements];
        newLessonElements.splice(index, 1);
        setLessonElements(newLessonElements);
    };

    const moveElement = (dragIndex: number, hoverIndex: number) => {
        const dragElement = lessonElements[dragIndex];
        const newLessonElements = [...lessonElements];
        newLessonElements.splice(dragIndex, 1);
        newLessonElements.splice(hoverIndex, 0, dragElement);
        setLessonElements(newLessonElements);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="lesson-constructor">
                <div className="lesson-elements">
                    <DraggableColumn columnRef={columnRef}>
                        <div className="element" onClick={() => addElement('video')}>
                            Video
                        </div>
                        <div className="element" onClick={() => addElement('text')}>
                            Text
                        </div>
                        <div className="element" onClick={() => addElement('file')}>
                            File
                        </div>
                    </DraggableColumn>
                </div>
                <div className="lesson-canvas" ref={columnRef}>
                    {lessonElements.map((elementType, index) => (
                        <LessonElement key={index} index={index} type={elementType} moveElement={moveElement} removeElement={removeElement} />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
};

const DraggableColumn: React.FC<{ columnRef: React.RefObject<HTMLDivElement>; children: ReactNode }> = ({ children, columnRef }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'column',
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={columnRef} className={`draggable-column ${isDragging ? 'dragging' : ''}`}>
            {children}
        </div>
    );
};

const LessonElement: React.FC<{ index: number; type: string; moveElement: (dragIndex: number, hoverIndex: number) => void; removeElement: (index: number) => void }> = ({
    index,
    type,
    moveElement,
    removeElement,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'lessonElement',
            item: { index, type },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [index]
    );

    const [, drop] = useDrop({
        accept: 'lessonElement',
        hover: (item: { index: number }, monitor: DropTargetMonitor) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveElement(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    const handleRemove = () => {
        removeElement(index);
    };

    return (
        <div ref={ref} className={`lesson-element ${isDragging ? 'dragging' : ''}`}>
            {type}
            <button onClick={handleRemove} className="remove-button">
                Remove
            </button>
        </div>
    );
};

export default CreateLesson;
