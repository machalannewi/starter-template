import { CarIcon, User } from "lucide-react";
import { carListData, CarData } from "@/utils/CarListData";
import { useState } from "react";

// interface RouteData {
//     distance: number | null;
// }
interface CarOptionsProps {
    distance: number; // distance in meters from Mapbox
}

export default function CarOptions({ distance }: CarOptionsProps) {
    const [isActive, setIsActive] = useState<number>();

    // Convert meters to kilometers
    const distanceInKm = distance / 1000;

    // Calculate fare with base fare + per-km rate
    const calculateFare = (car: CarData): number => {
        return car.baseFare + car.amountPerKm * distanceInKm;
    };
    return (
        <section className="py-10 px-2 overflow-auto h-[250px]">
            <h2 className="text-[22px] font-bold">Recommended</h2>
            <p className="text-sm text-gray-600 mb-2">
                {distanceInKm.toFixed(2)} km trip
            </p>
            {carListData.map((car, index) => {
                const fare = calculateFare(car);
                return (
                    <div
                        className={
                            isActive === index
                                ? `flex items-center justify-between p-4 cursor-pointer mt-5 rounded-md border border-neutral-500 `
                                : `flex items-center justify-between mt-5 p-4 hover:cursor-pointer`
                        }
                        key={car.id}
                        onClick={() => setIsActive(index)}
                    >
                        <div className="flex items-center gap-5">
                            <CarIcon />
                            <div>
                                <h2 className="font-semibold text-[18px] flex gap-3 items-center">
                                    {car.name}
                                    <span className="flex gap-2 font-extrabold items-center text-[14px]">
                                        <User />
                                        {car.seat}
                                    </span>
                                </h2>
                                <p>{car.desc}</p>
                            </div>
                        </div>
                        <h2 className="font-semibold text-[18px]">
                            ₦{fare.toFixed(0)}
                        </h2>
                    </div>
                );
            })}
        </section>
    );
}
