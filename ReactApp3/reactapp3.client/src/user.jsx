import { useState } from 'react';

const User = () => {
    // Kullan�c� hangi i�lemi se�ti�ini takip eden state (kullan�c� olu�turma, listeleme, detaylar� alma, silme)
    const [selectedAction, setSelectedAction] = useState('');
    // T�m kullan�c�lar� tutan state
    const [users, setUsers] = useState([]);
    // Yeni kullan�c� bilgileri i�in gerekli state'ler
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [surname, setSurname] = useState('');
    const [title, setTitle] = useState('');
    // Silinmesi istenen kullan�c� ID'si
    const [userIdToDelete, setUserIdToDelete] = useState('');
    // Detaylar� al�nacak kullan�c� ID'si
    const [userIdToFetch, setUserIdToFetch] = useState('');
    // Detaylar� al�nan kullan�c�y� tutan state
    const [fetchedUser, setFetchedUser] = useState(null);

    // Aksiyon se�ildi�inde �a�r�lan fonksiyon
    const handleSelectChange = (e) => {
        setSelectedAction(e.target.value);
        resetFields(); // Se�im de�i�ti�inde formu s�f�rlar
    };

    // Form alanlar�n� s�f�rlamak i�in kullan�lan fonksiyon
    const resetFields = () => {
        setUsername('');
        setFirstname('');
        setSurname('');
        setTitle('');
    };

    // Kullan�c� olu�turma formunun g�nderimi
    const handleSubmitCreateUser = async (e) => {
        e.preventDefault();

        // Title de�erini enum olarak ayarl�yoruz (backend enum de�erlerini bekledi�i i�in)
        let titleValue;

        switch (title) {
            case 'Asistan':
                titleValue = 0;
                break;
            case 'Orta':
                titleValue = 1;
                break;
            case 'K�demli':
                titleValue = 2;
                break;
            case 'Y�netici':
                titleValue = 3;
                break;
            default:
                titleValue = null;
                break;
        }

        if (titleValue === null) {
            alert("L�tfen ge�erli bir ba�l�k se�in.");
            return;
        }

        // Backend'e g�nderilecek userDto objesi
        const userDto = {
            userName: username,
            firstName: firstname,
            surName: surname,
            title: titleValue  // Title'� enum olarak g�nderiyoruz
        };

        try {
            // Kullan�c� olu�turma iste�i
            const response = await fetch('https://localhost:7299/User/CreateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDto),  // JSON format�nda do�ru �ekilde g�nderiyoruz
            });

            if (!response.ok) {
                // Hata durumunda, backend'den gelen hatay� alert ile g�steriyoruz
                const errorText = await response.text();

                // �zel durum: E�er ayn� kullan�c� ad� varsa �zel bir mesaj g�steriyoruz
                if (errorText.includes("Bu kullan�c� ad�yla kullan�c� mevcut")) {
                    alert("Bu kullan�c� ad� zaten mevcut! L�tfen ba�ka bir kullan�c� ad� se�in.");
                } else {
                    alert(`Kullan�c� olu�turulamad�: ${errorText}`);
                }
            } else {
                alert('Kullan�c� ba�ar�yla olu�turuldu');
                resetFields(); // Alanlar� temizleme i�lemi
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Bir hata olu�tu. L�tfen tekrar deneyin.');
        }
    };

    // T�m kullan�c�lar� listeleyen fonksiyon
    const fetchAllUsers = async () => {
        try {
            const response = await fetch('https://localhost:7299/User/GetAllUsers');
            if (!response.ok) throw new Error('kullanicilar alinamadi');

            const data = await response.json();
            console.log("API Yan�t�:", data);
            setUsers(data); // API'den gelen kullan�c�lar� state'e set eder
        } catch (error) {
            console.error('Hata:', error);
        }
    };

    // Belirli bir kullan�c�n�n detaylar�n� getiren fonksiyon
    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`https://localhost:7299/User/GetUserDetails?id=${userIdToFetch}`);
            if (!response.ok) {
                throw new Error('girilen ID ile eslesen kullanici bulunamadi');
            }

            const data = await response.json();

            if (!data || !data.id) {
                // E�er kullan�c� bulunamad�ysa
                throw new Error('Girilen ID ile e�le�en kullan�c� bulunamad�.');
            }

            // Kullan�c� detaylar�n� al ve kart bilgilerini ekle
            const userWithCardDetails = {
                ...data,
                card: data.card ? data.card : { // E�er kart bilgisi yoksa varsay�lan de�erlerle doldur
                    type: 'null',
                    description: 'null',
                    department: 'null',
                    recordStatus: 'null',
                    recordTime: null,
                },
            };

            setFetchedUser(userWithCardDetails); // Kullan�c� detaylar�n� state'e set et
        } catch (error) {
            alert(error.message); // Hata mesaj�n� alert ile g�ster
        }
    };

    // Kullan�c�y� silen fonksiyon
    const deleteUser = async () => {
        try {
            const response = await fetch(`https://localhost:7299/User/DeleteUser?id=${userIdToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('gonderilen id ile eslesen kullanici yok');
            }

            alert('Kullan�c� ba�ar�yla silindi');
            resetFields(); // Silindikten sonra formu s�f�rla
        } catch (error) {
            alert(error.message); // Hata mesaj�n� alert ile g�ster
        }
    };

    // Kullan�c� i�lemlerine g�re farkl� form veya tablo render eden fonksiyon
    const renderComponent = () => {
        switch (selectedAction) {
            case 'createUser':
                // Kullan�c� olu�turma formu
                return (
                    <form onSubmit={handleSubmitCreateUser} style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
                            <label>Kullanici Adi:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
                            <label>Ad:</label>
                            <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
                            <label>Soyad:</label>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
                            <label>Baslik:</label>
                            <select
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="">Secin...</option>
                                <option value="Asistan">Asistan</option>
                                <option value="Orta">Orta</option>
                                <option value="K�demli">K�demli</option>
                                <option value="Y�netici">Y�netici</option>
                            </select>
                        </div>
                        <button type="submit" style={{ padding: '10px', borderRadius: '4px', backgroundColor: '#28a745', color: '#fff', border: 'none' }}>Kaydet</button>
                    </form>
                );
            case 'getAllUsers':
                // T�m kullan�c�lar� listeleyen tablo
                return (
                    <div>
                        <h2 style={{ textAlign: 'center' }}>Tum Kullanicilari Getir</h2>
                        <button onClick={fetchAllUsers} style={{ padding: '8px 16px', marginBottom: '10px', display: 'block', margin: '0 auto' }}>Kullanicilari Al</button>
                        {users.length > 0 && (
                            <>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '10%' }}>ID</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '20%' }}>Kullanici Adi</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '20%' }}>Ad</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '20%' }}>Soyad</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '20%' }}>Baslik</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '20%' }}>Kart Tipi</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '20%' }}>Aciklama</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '20%' }}>Departman</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '20%' }}>Kayit Durumu</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', width: '20%' }}>Kayit Zamani</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{user.id}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{user.username}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>{user.firstName}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>{user.surName}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>{user.title}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{user.card ? user.card.type : 'null'}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{user.card ? user.card.description : 'null'}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{user.card ? user.card.department : 'null'}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{user.card ? user.card.recordStatus : 'null'}</td>
                                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{user.card ? new Date(user.card.recordTime).toLocaleString() : 'null'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                );

            case 'getUserDetails':
                // Kullan�c� detaylar�n� getirme formu ve detaylar
                return (
                    <div>
                        <input
                            type="text"
                            value={userIdToFetch}
                            onChange={(e) => setUserIdToFetch(e.target.value)}
                            placeholder="Kullanici ID'si"
                            style={{ marginBottom: '10px', padding: '8px', width: '200px' }}
                        />
                        <button onClick={fetchUserDetails} style={{ padding: '8px 16px' }}>Detaylari Getir</button>

                        {fetchedUser && (
                            <div style={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '20px' }}>
                                <h3 style={{ textAlign: 'center' }}>Kullanici ve Kart Bilgileri</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>ID</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Kullanici Adi</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Ad</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Soyad</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Baslik</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Kart Tipi</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Aciklama</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Departman</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Kayit Durumu</th>
                                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>Kayit Zamani</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.id}</td>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.userName || 'null'}</td>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.firstName || 'null'}</td>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.surName || 'null'}</td>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.title}</td>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.cards.length > 0 ? fetchedUser.cards[0].type : 'null'}</td>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.cards.length > 0 ? fetchedUser.cards[0].description : 'null'}</td>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.cards.length > 0 ? fetchedUser.cards[0].department : 'null'}</td>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.cards.length > 0 ? fetchedUser.cards[0].recordStatus : 'null'}</td>
                                            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{fetchedUser.cards.length > 0 && fetchedUser.cards[0].recordTime ? new Date(fetchedUser.cards[0].recordTime).toLocaleString() : 'null'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );

            case 'deleteUser':
                // Kullan�c� silme formu
                return (
                    <div>
                        <input
                            type="text"
                            value={userIdToDelete}
                            onChange={(e) => setUserIdToDelete(e.target.value)}
                            placeholder="Silinecek Kullanici ID'si"
                        />
                        <button onClick={deleteUser}>Sil</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Kullanici Islemleri</h1>
            {/* Kullan�c� i�lemi se�imi */}
            <select onChange={handleSelectChange} value={selectedAction}>
                <option value="">Bir islem secin...</option>
                <option value="createUser">Kullanici Olustur</option>
                <option value="getAllUsers">Tum Kullanicilari Getir</option>
                <option value="getUserDetails">Kullanici Detaylarini Getir</option>
                <option value="deleteUser">Kullanici Sil</option>
            </select>
            {renderComponent()} {/* Se�ilen i�leme g�re ilgili form veya tablo render edilir */}
        </div>
    );
};

export default User;
