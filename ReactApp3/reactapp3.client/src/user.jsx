import { useState } from 'react';

const User = () => {
    // Kullanýcý hangi iþlemi seçtiðini takip eden state (kullanýcý oluþturma, listeleme, detaylarý alma, silme)
    const [selectedAction, setSelectedAction] = useState('');
    // Tüm kullanýcýlarý tutan state
    const [users, setUsers] = useState([]);
    // Yeni kullanýcý bilgileri için gerekli state'ler
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [surname, setSurname] = useState('');
    const [title, setTitle] = useState('');
    // Silinmesi istenen kullanýcý ID'si
    const [userIdToDelete, setUserIdToDelete] = useState('');
    // Detaylarý alýnacak kullanýcý ID'si
    const [userIdToFetch, setUserIdToFetch] = useState('');
    // Detaylarý alýnan kullanýcýyý tutan state
    const [fetchedUser, setFetchedUser] = useState(null);

    // Aksiyon seçildiðinde çaðrýlan fonksiyon
    const handleSelectChange = (e) => {
        setSelectedAction(e.target.value);
        resetFields(); // Seçim deðiþtiðinde formu sýfýrlar
    };

    // Form alanlarýný sýfýrlamak için kullanýlan fonksiyon
    const resetFields = () => {
        setUsername('');
        setFirstname('');
        setSurname('');
        setTitle('');
    };

    // Kullanýcý oluþturma formunun gönderimi
    const handleSubmitCreateUser = async (e) => {
        e.preventDefault();

        // Title deðerini enum olarak ayarlýyoruz (backend enum deðerlerini beklediði için)
        let titleValue;

        switch (title) {
            case 'Asistan':
                titleValue = 0;
                break;
            case 'Orta':
                titleValue = 1;
                break;
            case 'Kýdemli':
                titleValue = 2;
                break;
            case 'Yönetici':
                titleValue = 3;
                break;
            default:
                titleValue = null;
                break;
        }

        if (titleValue === null) {
            alert("Lütfen geçerli bir baþlýk seçin.");
            return;
        }

        // Backend'e gönderilecek userDto objesi
        const userDto = {
            userName: username,
            firstName: firstname,
            surName: surname,
            title: titleValue  // Title'ý enum olarak gönderiyoruz
        };

        try {
            // Kullanýcý oluþturma isteði
            const response = await fetch('https://localhost:7299/User/CreateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDto),  // JSON formatýnda doðru þekilde gönderiyoruz
            });

            if (!response.ok) {
                // Hata durumunda, backend'den gelen hatayý alert ile gösteriyoruz
                const errorText = await response.text();

                // Özel durum: Eðer ayný kullanýcý adý varsa özel bir mesaj gösteriyoruz
                if (errorText.includes("Bu kullanýcý adýyla kullanýcý mevcut")) {
                    alert("Bu kullanýcý adý zaten mevcut! Lütfen baþka bir kullanýcý adý seçin.");
                } else {
                    alert(`Kullanýcý oluþturulamadý: ${errorText}`);
                }
            } else {
                alert('Kullanýcý baþarýyla oluþturuldu');
                resetFields(); // Alanlarý temizleme iþlemi
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Bir hata oluþtu. Lütfen tekrar deneyin.');
        }
    };

    // Tüm kullanýcýlarý listeleyen fonksiyon
    const fetchAllUsers = async () => {
        try {
            const response = await fetch('https://localhost:7299/User/GetAllUsers');
            if (!response.ok) throw new Error('kullanicilar alinamadi');

            const data = await response.json();
            console.log("API Yanýtý:", data);
            setUsers(data); // API'den gelen kullanýcýlarý state'e set eder
        } catch (error) {
            console.error('Hata:', error);
        }
    };

    // Belirli bir kullanýcýnýn detaylarýný getiren fonksiyon
    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`https://localhost:7299/User/GetUserDetails?id=${userIdToFetch}`);
            if (!response.ok) {
                throw new Error('girilen ID ile eslesen kullanici bulunamadi');
            }

            const data = await response.json();

            if (!data || !data.id) {
                // Eðer kullanýcý bulunamadýysa
                throw new Error('Girilen ID ile eþleþen kullanýcý bulunamadý.');
            }

            // Kullanýcý detaylarýný al ve kart bilgilerini ekle
            const userWithCardDetails = {
                ...data,
                card: data.card ? data.card : { // Eðer kart bilgisi yoksa varsayýlan deðerlerle doldur
                    type: 'null',
                    description: 'null',
                    department: 'null',
                    recordStatus: 'null',
                    recordTime: null,
                },
            };

            setFetchedUser(userWithCardDetails); // Kullanýcý detaylarýný state'e set et
        } catch (error) {
            alert(error.message); // Hata mesajýný alert ile göster
        }
    };

    // Kullanýcýyý silen fonksiyon
    const deleteUser = async () => {
        try {
            const response = await fetch(`https://localhost:7299/User/DeleteUser?id=${userIdToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('gonderilen id ile eslesen kullanici yok');
            }

            alert('Kullanýcý baþarýyla silindi');
            resetFields(); // Silindikten sonra formu sýfýrla
        } catch (error) {
            alert(error.message); // Hata mesajýný alert ile göster
        }
    };

    // Kullanýcý iþlemlerine göre farklý form veya tablo render eden fonksiyon
    const renderComponent = () => {
        switch (selectedAction) {
            case 'createUser':
                // Kullanýcý oluþturma formu
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
                                <option value="Kýdemli">Kýdemli</option>
                                <option value="Yönetici">Yönetici</option>
                            </select>
                        </div>
                        <button type="submit" style={{ padding: '10px', borderRadius: '4px', backgroundColor: '#28a745', color: '#fff', border: 'none' }}>Kaydet</button>
                    </form>
                );
            case 'getAllUsers':
                // Tüm kullanýcýlarý listeleyen tablo
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
                // Kullanýcý detaylarýný getirme formu ve detaylar
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
                // Kullanýcý silme formu
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
            {/* Kullanýcý iþlemi seçimi */}
            <select onChange={handleSelectChange} value={selectedAction}>
                <option value="">Bir islem secin...</option>
                <option value="createUser">Kullanici Olustur</option>
                <option value="getAllUsers">Tum Kullanicilari Getir</option>
                <option value="getUserDetails">Kullanici Detaylarini Getir</option>
                <option value="deleteUser">Kullanici Sil</option>
            </select>
            {renderComponent()} {/* Seçilen iþleme göre ilgili form veya tablo render edilir */}
        </div>
    );
};

export default User;
