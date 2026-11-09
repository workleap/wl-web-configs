declare module "*.svg" {
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}
declare module "*.svg?react" {
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}
