import React from "react";


interface Course {
    id: number;
    name: string;
    // Дополнительные поля, если они есть
}

interface Props {
    courses: Course[];
}

const Home: React.FC<Props> = ({ courses }) => {
    return (
        <div>
            {courses && courses.map(c => (
                <div key={c.id}>
                    <span>{c.name}</span>
                </div>
            ))}
        </div>
    );
}

export default Home;