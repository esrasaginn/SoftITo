import { useState } from "react";

export default function Offer() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Teklif talebiniz alınmıştır.");
  };

  return (
    <>
      <section className="offer">

        <div className="container">

          <h2 className="section-title">
            Teklif Al
          </h2>

          <form
            className="offer-form"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              name="name"
              placeholder="Ad Soyad"
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="E-Posta"
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Telefon"
              onChange={handleChange}
            />

            <textarea
              name="project"
              rows="6"
              placeholder="Projeniz hakkında bilgi veriniz..."
              onChange={handleChange}
            />

            <button type="submit">
              Teklif Gönder
            </button>

          </form>

        </div>

      </section>
    </>
  );
}