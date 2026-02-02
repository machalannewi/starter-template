import Navbar from "@/components/dashboard/Navbar";
import Mapbox from "@/components/dashboard/Mapbox";
import SearchBox from "@/components/dashboard/SearchBox";

export default function Dashboard() {
    return (
        <>
            <div className="">
                <Navbar />
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="col-span-2">
                        <Mapbox />
                    </div>
                    <div>
                        <h1>Go wherever, whenever...</h1>
                        <SearchBox />
                    </div>
                </div>
            </div>
        </>
    );
}
