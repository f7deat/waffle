import { apiPokemonList } from "@/service/apps/pokemon";
import { Pagination } from "antd";

const Page: React.FC = async () => {

    const data = await apiPokemonList({ limit: 10, offset: 0 });

    return (
        <div className="container mx-auto p-4">
            <h1>Pokemon</h1>
            {
                data.data.results.map((pokemon: { name: string }) => (
                    <div key={pokemon.name}>{pokemon.name}</div>
                ))
            }
            <Pagination total={data.data.count} />
        </div>
    );
}
export default Page;