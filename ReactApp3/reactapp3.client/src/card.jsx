import { useState, useEffect } from 'react';

const Card = () => {
    // Aksiyonlar�n tutuldu�u state (create veya list se�enekleri)
    const [action, setAction] = useState('');
    // Kullan�c� ID'sinin tutuldu�u state
    const [userId, setUserId] = useState('');
    // Kart tipinin tutuldu�u state
    const [cardType, setCardType] = useState('');
    // Kart a��klamas�n�n tutuldu�u state
    const [cardDescription, setCardDescription] = useState('');
    // Kart�n ba�l� oldu�u departman�n tutuldu�u state
    const [cardDepartment, setCardDepartment] = useState('');
    // Kart�n aktif/pasif durumunun tutuldu�u state
    const [cardRecordStatus, setCardRecordStatus] = useState('');
    // Kart�n kay�t zaman�n�n tutuldu�u state
    const [cardRecordTime, setCardRecordTime] = useState('');
    // Kart listesinin tutuldu�u state
    const [cardList, setCardList] = useState([]);
    // Departman listesinin tutuldu�u state (dropdown i�in)
    const [departments, setDepartments] = useState([]);
    // ��lemlerden sonra geri d�n�� mesaj� i�in state
    const [message, setMessage] = useState('');
    // Form do�rulama hatalar�n� tutan state
    const [errors, setErrors] = useState({});

    // Departmanlar� API'den almak i�in fonksiyon (Card olu�turulurken hangi departmana ba�l� oldu�unu se�mek i�in)
    const fetchDepartments = async () => {
        try {
            const response = await fetch('https://localhost:7299/Card/GetDepartments');
            if (!response.ok) {
                throw new Error('Failed to load departments.');
            }
            const data = await response.json();
            setDepartments(data); // Departmanlar� state'e atar
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // T�m kartlar� listelemek i�in fonksiyon (Kullan�c�n�n sahip oldu�u t�m kartlar g�sterilir)
    const fetchAllCards = async () => {
        try {
            const response = await fetch('https://localhost:7299/Card/GetAllCards');
            if (!response.ok) {
                throw new Error('Failed to fetch cards.');
            }
            const data = await response.json();
            setCardList(data); // Kart listesini state'e atar
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Sayfa y�klendi�inde departmanlar� almak i�in
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Formun do�rulamas�n� yapar, bo� alan varsa hata mesaj� g�sterir
    const validateForm = () => {
        const newErrors = {};
        if (!userId) newErrors.userId = 'User ID cannot be empty';
        if (!cardType) newErrors.cardType = 'Card Type cannot be empty';
        if (!cardDescription) newErrors.cardDescription = 'Card Description cannot be empty';
        if (!cardRecordTime) newErrors.cardRecordTime = 'Record Time cannot be empty';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Yeni kart olu�turmak i�in API'ye POST iste�i g�nderen fonksiyon
    const handleCreateCard = async (e) => {
        e.preventDefault();

        // Form do�rulamas�n� kontrol eder
        if (!validateForm()) {
            return;
        }

        // Yeni kart ili�kisini olu�turur (Kullan�c� ID'si ve kart bilgileri ile birlikte)
        const newCardRelation = {
            userId: parseInt(userId),
            card: {
                recordTime: cardRecordTime || new Date().toISOString(),
                type: cardType,
                description: cardDescription,
                department: parseInt(cardDepartment),
                recordStatus: parseInt(cardRecordStatus),
                id: 0
            }
        };

        try {
            // Kart olu�turma API iste�i
            const response = await fetch('https://localhost:7299/Card/CreateUserCardRelation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCardRelation),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Card creation failed: ${errorText}`);
            }

            const result = await response.json();
            // Ba�ar�l� olu�turma mesaj�
            setMessage(`Card successfully created: Card ID - ${result.cardId}, User ID - ${result.userId}`);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div>
            <h1>Card Operations</h1>

            {/* Aksiyon se�me alan�: Kart olu�turma veya kartlar� listeleme */}
            <div>
                <label>Select Action:</label>
                <select value={action} onChange={(e) => setAction(e.target.value)}>
                    <option value="">Select</option>
                    <option value="create">Add Card</option>
                    <option value="list">Get Card List</option>
                </select>
            </div>

            {/* E�er 'create' aksiyonu se�ilirse, kart olu�turma formu g�sterilir */}
            {action === 'create' && (
                <form onSubmit={handleCreateCard} style={{ textAlign: "left", maxWidth: "400px", margin: "auto" }}>
                    <h2>Create Card</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <label>User ID:</label>
                        {errors.userId && <p style={{ color: 'red' }}>{errors.userId}</p>}
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Card Type:</label>
                        {errors.cardType && <p style={{ color: 'red' }}>{errors.cardType}</p>}
                        <input
                            type="text"
                            value={cardType}
                            onChange={(e) => setCardType(e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Card Description:</label>
                        {errors.cardDescription && <p style={{ color: 'red' }}>{errors.cardDescription}</p>}
                        <input
                            type="text"
                            value={cardDescription}
                            onChange={(e) => setCardDescription(e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Department:</label>
                        <select value={cardDepartment} onChange={(e) => setCardDepartment(e.target.value)} style={{ width: "100%" }}>
                            <option value="">Seciniz</option>
                            {departments.map((dept) => (
                                <option key={dept.value} value={dept.value}>
                                    {dept.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Record Status:</label>
                        <select value={cardRecordStatus} onChange={(e) => setCardRecordStatus(e.target.value)} style={{ width: "100%" }}>
                            <option value="">Seciniz</option>
                            <option value="0">Passive</option>
                            <option value="1">Active</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Record Time:</label>
                        {errors.cardRecordTime && <p style={{ color: 'red' }}>{errors.cardRecordTime}</p>}
                        <input
                            type="datetime-local"
                            value={cardRecordTime}
                            onChange={(e) => setCardRecordTime(e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <button type="submit" style={{ width: "100%", padding: "10px" }}>Create Card</button>

                    {message && <p>{message}</p>}
                </form>
            )}

            {/* E�er 'list' aksiyonu se�ilirse, kartlar� listeleme alan� g�sterilir */}
            {action === 'list' && (
                <div>
                    <button onClick={fetchAllCards} style={{ padding: '10px', marginBottom: '20px' }}>List Cards</button>
                    {cardList.length > 0 && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>User ID</th>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Card ID</th>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Type</th>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Description</th>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Department</th>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Status</th>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Record Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cardList.map((card) => (
                                    <tr key={card.card.id}>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{card.userId}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{card.card.id}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{card.card.type}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{card.card.description}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{card.card.department}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{card.card.recordStatus === 'Active' ? 'Active' : 'Passive'}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{new Date(card.card.recordTime).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default Card;
