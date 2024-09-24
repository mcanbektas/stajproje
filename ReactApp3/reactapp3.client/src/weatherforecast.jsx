import { useEffect, useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
    const [forecasts, setForecasts] = useState(); // Hava tahmini verilerini tutmak i�in state
    const navigate = useNavigate(); // Sayfalar aras�nda y�nlendirme i�in kullan�l�r

    useEffect(() => {
        populateWeatherData(); // Bile�en y�klendi�inde hava tahmini verilerini �eker
    }, []);

    // NameCast sayfas�na y�nlendirme i�levi
    const handleButtonClick = () => {
        navigate('/NameCast');
    };

    // Hava tahmini verileri y�klenirken ve y�klendikten sonra g�sterilecek i�erik
    const contents = forecasts === undefined
        ? <p>Y�kleniyor... Uygulama y�klendi�inde sayfay� yeniden ba�lat�n.</p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Temp. (S)</th>
                    <th>Temp. (K)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast => (
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.temperatureS}</td>
                        <td>{forecast.temperatureK}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                ))}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Weather Forecast</h1>
            <p>Bu sayfa hava tahminlerini g�stermektedir.</p>
            {contents}
            <button onClick={handleButtonClick}>NameCast sayfas�na git</button>
        </div>
    );

    // API'den hava tahmini verilerini �eken i�lev
    async function populateWeatherData() {
        const response = await fetch('https://localhost:7299/WeatherForecast');
        const data = await response.json();
        setForecasts(data); // Verileri state'e atar
    }
}

export default App;
