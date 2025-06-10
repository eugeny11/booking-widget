export const fetchPrice = (date, price) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                price: {
                    origin: 1300,
                    total: 1300,
                    prepay: 650, 
                    discount: 0,
                    prepay_decline: {
                         date: "2025-05-09T09:30:39",
                minutes: 1440
                    }
                },
                status:'ok'
            })
        },600)
    })
}