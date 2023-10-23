import axios from "axios";
import { URLAPI } from "./Helpers";
export default axios.create({
    baseURL:`${URLAPI}/tienda`
})