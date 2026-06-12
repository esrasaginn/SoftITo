import React from "react";

const Selamla=()=>{
    return(
        <div className="p-3 border">
            <h4 className="font-bold">Merhaba Dünya</h4>
        </div>
    )
}

const Demo2Component=()=>{
    return(
        <div className="p-2">
            <h3 className="text-xl font-bold">Demo 2 Bileşen</h3>
            <div className="mt-4">
                <Selamla/>
                <Selamla/>
                <Selamla/>

            </div>
        </div>
    )
}

export default Demo2Component;