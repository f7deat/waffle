import PageContainer from "@/components/layout/page-container";
import { apiPokemonList } from "@/service/apps/pokemon";

const Page: React.FC = async () => {

    const data = await apiPokemonList({ limit: 10, offset: 0 });

    return (
        <PageContainer title="Pokemon">
            {
                data.data.results.map((pokemon: { name: string }) => (
                    <div key={pokemon.name} className="border-b border-dashed px-2 py-1">{pokemon.name}</div>
                ))
            }
        </PageContainer>
    );
}
export default Page;