import { generateMockWeek } from "./generateMockWeek"

export const fetchWeek = async (date) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(generateMockWeek(date))
        },600)
    })
}