import axios from "axios";
import { URLAPI/* , URLAPIPruebas  */} from "./Helpers";

export default axios.create({
    baseURL:`${URLAPI}/v1`
})