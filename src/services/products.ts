import axios from "axios";
import config from "../config/config";
import { PRODUCT } from "../constants/backend.constants";

/* Since .env is added in .gitignore I added the configuration over here in case
    REACT_APP_BACKEND_BASE_URL=https://inventory-dev-295903.appspot.com
    REACT_APP_BACKEND_TOKEN=154829a18860dd88e211e33091a8f00adb98e198
*/

type ListProductApi = {
  query?: Record<string, any>;
};

const listProducts = (args?: ListProductApi) => {
  let url = config.BACKEND_BASE + PRODUCT.LIST;

  let query = args?.query || {};
  return axios.get(url, {
    params: query,
  });
};

export { listProducts };
