import Block from "../block"

const BlockRender: React.FC<API.BlockEditor> = (props) => {

    const { blocks } = props;
    if (!blocks || blocks.length === 0) {
        return null;
    }

    return (
        <div>
            {blocks.map((block, index) => (
                <Block key={index} {...block} />
            ))}
        </div>
    )
}

export default BlockRender;