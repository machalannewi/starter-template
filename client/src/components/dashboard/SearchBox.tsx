import Input from "./Input";

export default function SearchBox() {
    return (
        <section className="p-4 border-[2px] rounded-xl">
            <p className="text-[20px] font-bold">Get a ride</p>
            <Input placeholder="Pickup location" icon="pickup" />
            <Input placeholder="Dropoff location" icon="dropoff" />

            <button className="p-3 bg-lime-500 w-full mt-5 text-black rounded-lg font-semibold">
                Search
            </button>
        </section>
    );
}
