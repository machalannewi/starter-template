"use client";

import Navbar from "@/components/dashboard/Navbar";
import Mapbox from "@/components/dashboard/Mapbox";
import SearchBox from "@/components/dashboard/SearchBox";
import { useState } from "react";
import { MapboxFeature } from "@/types/mapbox";

export default function Dashboard() {
    const [pickup, setPickup] = useState<MapboxFeature | null>(null);
    const [dropoff, setDropoff] = useState<MapboxFeature | null>(null);

    return (
        <>
            <div className="">
                <Navbar />
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="col-span-2">
                        <Mapbox pickup={pickup} dropoff={dropoff} />
                    </div>
                    <div>
                        <h1>Go wherever, whenever...</h1>
                        <SearchBox
                            onPickupSelect={setPickup}
                            onDropoffSelect={setDropoff}
                            pickup={pickup}
                            dropoff={dropoff}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
