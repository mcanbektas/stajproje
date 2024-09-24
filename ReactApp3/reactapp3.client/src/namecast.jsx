import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NameCast() {
    const [namecasts, setNamecasts] = useState([]); // Rastgele NameCast verileri
    const navigate = useNavigate(); // Baþka sayfaya yönlendirme iþlevi

    useEffect(() => {
        async function fetchNameCasts() {
            try {
                // Backend'den NameCast verilerini çeker
                const response = await fetch('https://localhost:7299/NameCast/GetNameCast');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setNamecasts(data); // Gelen veriyi state'e atar
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        fetchNameCasts(); // Sayfa yüklendiðinde çaðrýlýr
    }, []);

    const handleButtonClick = () => {
        // NameCastPost sayfasýna yönlendirme yapar
        navigate('/NameCastPost');
    };

    // Veriler yüklenirken gösterilecek içerik
    const contents = namecasts.length === 0
        ? <p><em>Yukleniyor... Lutfen ASP.NET backend baslatildiginda sayfayý yenileyin.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Ad</th>
                    <th>Soyad</th>
                    <th>Dogum Yili</th>
                    <th>Sehir</th>
                    <th>Yas</th>
                </tr>
            </thead>
            <tbody>
                {namecasts.map((namecast, index) =>
                    <tr key={index}>
                        <td>{namecast.name}</td>
                        <td>{namecast.surname}</td>
                        <td>{namecast.birthofyear}</td>
                        <td>{namecast.city}</td>
                        <td>{namecast.age}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Name Cast</h1>
            <p>rastgele ad, soyad, doðum yýlý, þehir ve yaþ bilgileri döner.</p>
            {contents}
            <button onClick={handleButtonClick} className="action-button">namecastpost git</button>
        </div>
    );
}

export default NameCast;
