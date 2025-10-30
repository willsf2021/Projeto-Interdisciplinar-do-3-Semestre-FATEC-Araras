import { CustomSelect } from "./CustomSelect";
import { EggFried, CupHot, Basket, Cart4 } from "react-bootstrap-icons";

export const ExemploTACO = () => {
  return (
    <CustomSelect
      endpoint={"alimentos"}
      placeholder={"alimentos"}
      type="foods"
      variant="modern"
      icon={<EggFried />}
    />
  );
};
