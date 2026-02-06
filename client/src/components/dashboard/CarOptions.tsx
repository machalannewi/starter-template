import { CarIcon, User } from "lucide-react";
import { carListData, CarData } from "@/utils/CarListData";
import { useState } from "react";

interface CarOptionsProps {
    distance: number;
    location: string;
}

export default function CarOptions({ distance, location }: CarOptionsProps) {
    const [isActive, setIsActive] = useState<number>();
    const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
    const [selectedFare, setSelectedFare] = useState<number>(0);
    const [step, setStep] = useState<number>(1);

    // Convert meters to kilometers
    const distanceInKm = distance / 1000;

    // Calculate fare with base fare + per-km rate
    const calculateFare = (car: CarData): number => {
        return car.baseFare + car.amountPerKm * distanceInKm;
    };

    const handleCarSelect = (car: CarData, index: number): void => {
        const fare = calculateFare(car);
        setIsActive(index);
        setSelectedCar(car);
        setSelectedFare(fare);
    };

    const requestRide = (): void => {
        setStep(2);
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
                                ? `flex items-center justify-between p-4 cursor-pointer mt-5 rounded-md border-2`
                                : `flex items-center justify-between mt-5 p-4 hover:cursor-pointer hover:border hover:border-gray-300 rounded-md transition`
                        }
                        key={car.id}
                        onClick={() => handleCarSelect(car, index)}
                    >
                        <div className="flex items-center gap-5">
                            <CarIcon size={32} />
                            <div>
                                <h2 className="font-semibold text-[18px] flex gap-3 items-center">
                                    {car.name}
                                    <span className="flex gap-2 font-normal items-center text-[14px]">
                                        <User size={16} />
                                        {car.seat}
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {car.desc}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="font-semibold text-[18px]">
                                ₦{fare.toFixed(0)}
                            </h2>
                            <p className="text-xs text-gray-500">
                                ₦{car.amountPerKm}/km
                            </p>
                        </div>
                    </div>
                );
            })}

            {/* Step 1: Request Ride Button */}
            {step === 1 && selectedCar && (
                <div className="flex justify-between fixed bottom-8 right-7 border-[1px] p-3 shadow-xl rounded-lg w-full md:w-[30.5%] items-center bg-black">
                    <div>
                        <p className="text-white text-sm">Make Payment For</p>
                        <p className="text-lime-500 font-bold text-lg">
                            ₦{selectedFare.toFixed(0)}
                        </p>
                    </div>
                    <button
                        onClick={requestRide}
                        className="p-3 bg-lime-500 text-black rounded-lg text-center font-semibold hover:bg-lime-600 transition"
                    >
                        Request {selectedCar.name}
                    </button>
                </div>
            )}

            {/* Step 2: Confirm Order */}
            {step === 2 && selectedCar && (
                <div className="flex flex-col gap-3 fixed bottom-8 right-7 border-[1px] p-4 shadow-xl rounded-lg w-full md:w-[30.5%] bg-black">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-xs">Destination</p>
                            <p className="text-white text-sm font-medium">
                                {location}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs">Total Fare</p>
                            <p className="text-lime-500 font-bold text-xl">
                                ₦{selectedFare.toFixed(0)}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-3">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Vehicle:</span>
                            <span className="text-white font-medium">
                                {selectedCar.name}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Distance:</span>
                            <span className="text-white">
                                {distanceInKm.toFixed(2)} km
                            </span>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                            <span className="text-gray-400">Base Fare:</span>
                            <span className="text-white">
                                ₦{selectedCar.baseFare}
                            </span>
                        </div>
                    </div>

                    <button
                        className="w-full p-3 bg-lime-500 text-black rounded-lg text-center font-semibold hover:bg-lime-600 transition"
                        onClick={() => {
                            console.log("Order confirmed:", {
                                car: selectedCar,
                                fare: selectedFare,
                                distance: distanceInKm,
                                location,
                            });
                        }}
                    >
                        Confirm Order
                    </button>

                    <button
                        className="w-full p-2 text-gray-400 text-sm hover:text-white transition"
                        onClick={() => setStep(1)}
                    >
                        ← Back to car selection
                    </button>
                </div>
            )}
        </section>
    );
}
