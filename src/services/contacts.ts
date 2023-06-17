import axios from "axios";
import config from "../config/config";
import { CONTACT } from "../constants/backend.constants";

/* Since .env is added in .gitignore I added the configuration over here in case
    REACT_APP_BACKEND_BASE_URL=https://inventory-dev-295903.appspot.com
    REACT_APP_BACKEND_TOKEN=154829a18860dd88e211e33091a8f00adb98e198
*/

const listContacts = (searchQuery?: string) => {
  let url = config.BACKEND_BASE + CONTACT.LIST;

  let query = (searchQuery && searchQuery !== "") ? searchQuery : "null";
  return axios.get(url, {
    params: {
        search: query
    }
  });
};

const getContactById = (searchQuery?: string) => {
    let url = config.BACKEND_BASE + CONTACT.LIST;
  
    let query = searchQuery ? searchQuery : "null";
    return axios.get(url, {
      params: {
          id: query
      }
    });
  };

export { listContacts , getContactById };