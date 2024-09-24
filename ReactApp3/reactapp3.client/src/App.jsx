import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NameCast from "./namecast";
import WeatherForecast from "./weatherforecast";
import NameCastPostForm from './namecastpost';
import User from './User'; // User bileþenini import et
import Card from './Card';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WeatherForecast />} />
                <Route path="/NameCast" element={<NameCast />} />
                <Route path="/NameCastPost" element={<NameCastPostForm />} />
                <Route path="/User" element={<User />} />  
                <Route path="/Card" element={<Card />} />  
            </Routes>
        </BrowserRouter>
    );
}
