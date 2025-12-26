import PageContainer from "@/components/layout/page-container";
import { apiPokemonList } from "@/service/apps/pokemon";
import Link from "next/link";

type Params = Promise<{ offset: number, url: { search: string } }>

type Props = {
    params: Params;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page: React.FC<Props> = async ({ searchParams }) => {

    const current = Number((await searchParams)?.current || 0);
    const data = await apiPokemonList({ limit: 20, offset: current });

    return (
        <PageContainer>
            <div className="mb-2">
                {
                    data.data.results.map((pokemon: { name: string }) => (
                        <div key={pokemon.name} className="border-b border-dashed px-2 py-1 hover:bg-slate-100">{pokemon.name}</div>
                    ))
                }
            </div>
            <div className="flex flex-end gap-1">
                <Link href={`/pokemon?current=${current + 1}`}>Next</Link>
            </div>
        </PageContainer>
    );
}
export default Page;