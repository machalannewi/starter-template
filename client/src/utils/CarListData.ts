export interface CarData {
    id: number;
    name: string;
    seat: number;
    desc: string;
    baseFare: number;    // Base fare to start the trip
    amountPerKm: number; // Price per kilometer
    image: string;
}

export const carListData: CarData[] = [
    {
        id: 1,
        name: "Ubex X",
        seat: 4,
        desc: "Affordable, Everyday rides",
        baseFare: 500,      // ₦500 base fare
        amountPerKm: 200,   // ₦200 per km
        image: '/uber.png'
    },
    {
        id: 2,
        name: "Ubex Comfort",
        seat: 4,
        desc: "Newer cars with extra legroom",
        baseFare: 700,
        amountPerKm: 300,
        image: '/uber.png'
    },
    {
        id: 3,
        name: "Ubex XL",
        seat: 6,
        desc: "Affordable rides for groups up to 6",
        baseFare: 900,
        amountPerKm: 400,
        image: '/uber.png'
    },
]