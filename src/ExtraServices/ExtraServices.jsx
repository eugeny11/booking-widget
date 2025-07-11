import React, {useState} from "react";
import { extraServices } from "./extraServicesData";
import './ExtraServices.css'
import parse from 'html-react-parser';
import arrowUpDown from "../images/arrow-up-down.png"
import questionImg from '../images/question.png'

const ExtraServices = ({selectedServices, setSelectedServices}) => {

    const [activeDescriptionId, setActiveDescriptionId] = useState(null)

    const [servicesOpen, setServicesOpen] = useState(false)

    const toggleServices = () => {
            setServicesOpen(prev => !prev);
        }

    const toggleDescription = (id) => {
      setActiveDescriptionId(prevId => (prevId === id ? null : id));
     };

     

    const updateService = (id, count) => {
       setSelectedServices(prev => {
        const newServices = [...prev];
        const index = newServices.findIndex(service => service.id === id);

        const serviceData = extraServices.find(s => s.id === id);
        if (!serviceData) return prev;

        if (count <= 0) {
            // Удаляем, если count <= 0
            if (index !== -1) {
                newServices.splice(index, 1);
            }
        } else {
            const serviceObj = {
                id: serviceData.id,
                title: serviceData.title,
                price: serviceData.price * count,
                unitPrice: serviceData.price,
                count: count,
            };

            if (index !== -1) {
                newServices[index] = serviceObj;
            } else {
                newServices.push(serviceObj);
            }
        }

        return newServices;
});



    }

    return(
        <div className="extra__services">
            <div className="services__header">
                <h2 className="section__title">Дополнительные услуги</h2>
                <div className='services__header-up' onClick={toggleServices}>
                    <img className={servicesOpen ? 'rotated' : ''} src={arrowUpDown} alt="arrow-toggle"  />
                </div>
            </div>
            
            <div className={`services__column-wrapper ${servicesOpen ? 'open' : ''}`}>
                    <div className="services__column">
                            {extraServices.map(service => {
                            const selectedItem = selectedServices.find(s => s.id === service.id);
                            const count = selectedItem ? selectedItem.count : 0;
                            const total = count * service.price;

                            return(
                                <div className="service__item__wrapper">
                                    <div className="service__item" key={service.id}>
                                    
                                        <img className="service__item-img" src={service.image} alt={service.title} />
                                    <div className="service__flex">
                                                <div className="service__info__desc">
                                                     <div className="service__info">
                                                <div className="title-row">
                                                    <div className="service-title"><span>{service.title}</span>
                                                    {service.full_description && (
                                                        <img
                                                        src={questionImg}
                                                        alt="question"
                                                        className="title-row--question"
                                                        onClick={() => toggleDescription(service.id)}
                                                        />
                                                    )}  
                                                        </div> 
                                                    <span className="title-row--splash" >|</span> 
                                                    <div className="service-price">
                                                        {service.price} <span>{service.unit}</span>
                                                    </div>
                                                </div>

                                                
                                            </div>
                                            <p className="service-description">{service.description}</p>
                                                </div>
                                               
                                            <div className="service__control">
                                                <div className="counter">
                                                    <button onClick={() => updateService(service.id, count - 1)}>−</button>
                                                    <span>{count}</span>
                                                    <button onClick={() => updateService(service.id, count + 1)}>+</button>
                                                </div>
                                                <div className="service-total"><span className="service-total-count">+</span> {total} ₽</div>
                                            </div>
                                    </div>
                                    
                                       
                               
                                    

                                    </div>
                             <div className={`services__mobile-description-wrapper ${activeDescriptionId === service.id ? 'open' : ''}`}>
                                        <div className="services__mobile-description">
                                                {activeDescriptionId === service.id ? (
                                                service.full_description && service.full_description.trim() !== "" 
                                                    ? parse(service.full_description) 
                                                    : <em>Нет описания</em>
                                                ) : null}
                                        </div>
                                    </div>
                                    
                            </div>
                                
                            )
                        })}
                            
                        </div>
            </div>
           
            

            
        </div>
    )
}

export default ExtraServices