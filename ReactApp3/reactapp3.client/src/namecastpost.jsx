import { useState } from "react";

const NameCastPostForm = () => {
    const [id, setId] = useState(""); // ID alaný
    const [name, setName] = useState(""); // Ýsim alaný
    const [model, setModel] = useState(""); // Model alaný
    const [nameCastList, setNameCastList] = useState([]); // Post edilen veriler

    // Form gönderildiðinde çaðrýlan iþlev
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tüm alanlarýn doldurulup doldurulmadýðýný kontrol eder
        if (id.trim() === "" || name.trim() === "" || model.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }

        const data = { id, name, model }; // Post edilecek veri

        try {
            // Veriyi backend'e post eder
            const response = await fetch("https://localhost:7299/NameCast/PostNameCast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("An error occurred while submitting data.");
            }

            const result = await response.json();
            setNameCastList((prevList) => [...prevList, result.data]); // Yeni veriyi listeye ekler

            setId(""); // Form alanlarýný sýfýrlar
            setName("");
            setModel("");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Ana sayfaya yönlendirme iþlevi
    const handleHomeClick = () => {
        window.location.href = "https://localhost:5173";
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <label htmlFor="id" style={{ width: "100px" }}>Id:</label>
                    <input
                        type="text"
                        id="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        style={{ flex: "1", padding: "5px" }}
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <label htmlFor="name" style={{ width: "100px" }}>Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ flex: "1", padding: "5px" }}
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <label htmlFor="model" style={{ width: "100px" }}>Model:</label>
                    <input
                        type="text"
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        style={{ flex: "1", padding: "5px" }}
                    />
                </div>
                <div style={{ textAlign: "center" }}>
                    <button type="submit" style={{ padding: "5px 10px", marginRight: "10px" }}>Submit</button>
                    <button type="button" onClick={handleHomeClick} style={{ padding: "5px 10px" }}>Home</button>
                </div>
            </form>

            {/* Post edilen verilerin gösterimi */}
            {nameCastList.length > 0 && (
                <div style={{ marginTop: "30px" }}>
                    <h2>Submitted Data</h2>
                    <ul>
                        {nameCastList.map((item, index) => (
                            <li key={index}>
                                <p><strong>Id:</strong> {item.id}</p>
                                <p><strong>Name:</strong> {item.name}</p>
                                <p><strong>Model:</strong> {item.model}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NameCastPostForm;
