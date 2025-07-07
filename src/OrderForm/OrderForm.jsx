import React, { useState } from "react";
import checkmark_grey from '../images/checkmark_grey.png'
import './OrderForm.css'

const OrderForm = ({total, onSubmit}) => {

    const [formData, setFormData] = useState({
        name:"",
        phone:"",
        email:"",
        promo: "",
        comment: "",
        prepayType:"50",
        agreed: false
    })

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handlePrepayChange = (value) => {
        setFormData(prev => ({...prev, prepayType: value}))
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!formData.name.trim() || !formData.phone.trim() || !formData.agreed){
             alert("Пожалуйста, заполните все обязательные поля и подтвердите согласие.");
            return;
        }

        onSubmit({...formData})

        setFormData({
        name: "",
        phone: "",
        email: "",
        promo: "",
        comment: "",
        prepayType: "50",
        agreed: false,
      });

  setPromo("");
  setPromoValid(null);
    }

    const calculatedPrepay = Math.round(
        total * (formData.prepayType === "50" ? 0.5 : 1)
    )

   const [promo, setPromo] = useState('');
    const [promoValid, setPromoValid] = useState(null);
    const validCodes = ['SAVE10', 'FOTO']; 

  const handlePromoChange = (e) => {
  const value = e.target.value;
  setPromo(value);

  const isValid = validCodes.includes(value.trim().toUpperCase());
  setPromoValid(isValid);
};

    return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="order-form__header">
        <h2 className="section__title">Оформление заказа</h2>
      </div>
      

      <div className="order-form__grid">
        <div className="order-form__left">
          <div className="field-group">
            <label>Имя</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              placeholder="+7 (999) 999-99-99"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          
            <div className="field-group field-group--promo">
            <label>Промокод</label>
              <div className="promo__flex">
                  <input
                      className="input-promo"
                      type="text"
                      value={promo}
                      onChange={handlePromoChange}
                    />
                    <div className="promo-valid">
                     <span>{promoValid === true ? <img src={checkmark_grey} alt="checkmark" /> : '\u2007'}</span> 
                    </div>
              </div> 
             </div>
          
          
          

          <div className="field-group field-group--commentary">
            <label>Комментарий</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="order-form__right">
          <div className="prepay-switcher">
            <label>Предоплата</label>
            <div className="switcher">
              <div className="switcher__buttons">
                <button
                type="button"
                className={formData.prepayType === "50" ? "active" : ""}
                onClick={() => handlePrepayChange("50")}
              >
                50%
              </button>
              <button
                type="button"
                className={formData.prepayType === "100" ? "active" : ""}
                onClick={() => handlePrepayChange("100")}
              >
                100%
              </button>
              </div>
              
               <div className="prepay-amount">{calculatedPrepay.toLocaleString('ru-RU')} ₽</div>
            </div>
           
          </div>

          <div className="agreement">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
              />
              <span className="custom-box"></span>
              <span className="agreement-text">
                Я ознакомлен с <a href="#">правилами студии</a> и <a href="#">правилами бронирования</a>
              </span>
            </label>
          </div>

          <button
            className="submit-button"
            type="submit"
            disabled={!formData.agreed}
          >
            Забронировать
          </button>

          <p className="policy-note">
            Нажимая на кнопку, я предоставляю согласие на обработку своих персональных данных
          </p>
        </div>
      </div>
    </form>
  );
}

export default OrderForm