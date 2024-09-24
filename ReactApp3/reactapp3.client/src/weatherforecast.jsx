import { useEffect, useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
    const [forecasts, setForecasts] = useState(); // Hava tahmini verilerini tutmak için state
    const navigate = useNavigate(); // Sayfalar arasýnda yönlendirme için kullanýlýr

    useEffect(() => {
        populateWeatherData(); // Bileþen yüklendiðinde hava tahmini verilerini çeker
    }, []);

    // NameCast sayfasýna yönlendirme iþlevi
    const handleButtonClick = () => {
        navigate('/NameCast');
    };

    // Hava tahmini verileri yüklenirken ve yüklendikten sonra gösterilecek içerik
    const contents = forecasts === undefined
        ? <p>Yükleniyor... Uygulama yüklendiðinde sayfayý yeniden baþlatýn.</p>
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
            <p>Bu sayfa hava tahminlerini göstermektedir.</p>
            {contents}
            <button onClick={handleButtonClick}>NameCast sayfasýna git</button>
        </div>
    );

    // API'den hava tahmini verilerini çeken iþlev
    async function populateWeatherData() {
        const response = await fetch('https://localhost:7299/WeatherForecast');
        const data = await response.json();
        setForecasts(data); // Verileri state'e atar
    }
}

export default App;
