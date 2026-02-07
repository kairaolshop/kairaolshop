interface ContainerProps {
    children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({
    children
}) => {
    return ( 
        <div className="mx-auto px-2 max-w-4xl ">
            {children}
        </div>
     );
}
 
export default Container;