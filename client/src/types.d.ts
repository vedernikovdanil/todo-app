import { Params } from "react-router-dom";
import { StoreContextType } from ".";

declare global {
  type LoaderParams = { params: Params; request: Request };
  type LoaderType = (store: StoreContextType) => (props: LoaderParams) => any;
  type LoaderReturnType<T extends LoaderType> = Awaited<
    ReturnType<ReturnType<T>>
  >;
}
