import { useEffect, useState } from "react";

export function Fetch() {
    const [pokemons, setPokemons] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/pokemons")
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                throw res;
            })
            .then(data => {
                setPokemons(data);
            })
            .catch(() => {
                console.error("An error occured while fetching pokemons.");
            });
    }, []);

    return (
        <>
            <h1>Fetch</h1>
            <ul>
                {pokemons.map(x => (
                    <li key={x}>{x}</li>
                ))}
            </ul>
        </>
    );
}
