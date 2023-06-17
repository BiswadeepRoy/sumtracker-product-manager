import { FC, useEffect, useState } from "react";
import ResultString from "../../../components/content/result.content";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";
import { PAGINATION_LIMIT } from "../../../constants/app.constants";
import { PaginateDataType, UrlType } from "../../../interface/common";
import { listProducts } from "../../../services/products";
import { listContacts, getContactById } from "../../../services/contacts"
import { getQueryFromUrl } from "../../../utils/common.utils";
import ProductsTable from "./components/products.table";
import { useNavigate, createSearchParams } from "react-router-dom"

const fixedListParams = {
    paginate: true
}


const ProductList: FC = () => {

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoding] = useState<boolean>(false);

    const [contacts, setContacts] = useState<any[]>([]);
    const [contactsLoading, setContactsLoading] = useState<boolean>(false);
    const [searchString, setSearchString] = useState<string>("");
    const [companySelected, setCompanySelected] = useState<boolean>(false);
    const navigate = useNavigate()

    const [pagination, setPagination] = useState<PaginateDataType>({
        next: null,
        prev: null,
        reset: false,
        count: null,
        resultsCount: 0,
        offset: null,
        hasOffset: true,
        limit: PAGINATION_LIMIT
    });

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        /* This will trigger whenever the search string is changed */
        if (!companySelected && searchString !== "") {
            loadContacts(searchString);
        }
    }, [searchString, companySelected]);

    const init = async () => {
        /* Init will first check the query parameters from browser 
        and if nothing is present then it will load the initial page */

        if (window?.location?.search) {
            var { query, contact } = getValuesFromParams();

            loadProducts(query);

            const contactResponse = await getContactById(contact?.toString());

            const contactObject = contactResponse.data?.results[0];

            setSearchString(`${contactObject.code} - ${contactObject.company_name}`);
            setCompanySelected(true);

        } else {
            loadProducts();
        }


        function getValuesFromParams() {
            const queryString = window.location.search;

            const urlParams = new URLSearchParams(queryString);

            const contact = urlParams.get('contact');
            const paginate = urlParams.get('paginate');
            const limit = urlParams.get('limit')
            const offset = urlParams.get('offset')

            const query = {
                contact,
                paginate,
                limit,
                offset
            };

            console.log(query)
            return { query, contact };
        }
    }

    const loadProducts = async (queryParams?: Record<string, any>, newContactSelected?: boolean) => {
        let query = queryParams || {};
        setLoding(true);
        try {
            const res = await listProducts({
                query: { ...fixedListParams, ...query }
            });

            setProducts(res.data.results);
            setPagination(prev => {
                return {
                    ...prev,
                    next: res.data.next,
                    prev: res.data.previous,
                    reset: companySelected,
                    count: res.data.count,
                    resultsCount: res.data.results.length,
                    offset: query?.offset ? Number(query.offset) : null,
                }
            });

            if (newContactSelected) {

                const navigateParams = {
                    paginate: fixedListParams.paginate?.toString(),
                    limit: PAGINATION_LIMIT.toString(),
                    offset: query?.offset ? query.offset : null,
                    contact: query?.contact
                };

                navigate({
                    pathname: window.location.pathname,
                    search: `?${createSearchParams(navigateParams)}`
                }, { replace: true })
            }

        } catch (err) {
            console.log(err);
        }
        setLoding(false);
    }

    const loadContacts = async (searchQuery: string) => {
        setContactsLoading(true);
        try {
            const res = await listContacts(searchQuery);
            setContacts(res.data.results);

        } catch (err) {
            console.log(err);
        }
        setContactsLoading(false);
    }

    const handleNext = (next: UrlType) => {
        if (next === null) {
            return;
        }
        let query = getQueryFromUrl(next);
        loadProducts(query, true);
    }

    const handlePrev = (prev: UrlType) => {
        if (prev === null) {
            return;
        }
        let query = getQueryFromUrl(prev);
        loadProducts(query, true);
    }
    return (
        <>
            <div style={{ marginBottom: '1rem' }}>
                <Heading
                    titleLevel={2}
                >
                    Products
                    <div className="type-ahead">
                        <div className="search-box">
                            <input type="text"
                                className="search-box-input"
                                onChange={(e) => {
                                    e.preventDefault();
                                    setSearchString(e.target.value);
                                }}
                                name="searchString"
                                value={searchString}
                                placeholder="Search for Supplier" />
                            {companySelected && <button className="cross-button" onClick={(e) => {
                                /* This button will not reset the whole page but will
                                 rather clear the search string */
                                e.preventDefault();
                                setSearchString("");
                                setCompanySelected(false);
                            }}>X</button>}
                        </div>
                        {
                            contactsLoading ?
                                <ul>
                                    <li key="loader"> Loading ... </li>
                                </ul> :
                                contacts?.length > 0 && !contactsLoading &&
                                <ul>
                                    {contacts.map(contact => {
                                        return <li key={contact?.id}
                                            onClick={(e) => {
                                                /* This will load the product information 
                                                as well as append the query parameters of the browser */

                                                e.preventDefault();
                                                loadProducts({
                                                    contact: contact?.id
                                                }, true);
                                                setContacts([]);
                                                setSearchString(`${contact.code} - ${contact.company_name}`);
                                                setCompanySelected(true);
                                            }}
                                        >
                                            {contact.code}
                                            <br></br>
                                            Company: {contact.company_name}
                                        </li>
                                    })}
                                </ul>
                        }
                    </div>
                </Heading >
            </div >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '0.5rem',
                }}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <ResultString
                                loading={loading}
                                pagination={pagination}
                                pageString={'product'}
                            />
                        </div>
                        <div>
                            <Pagination
                                next={pagination.next}
                                prev={pagination.prev}
                                reset={companySelected}
                                onNextClick={handleNext}
                                onPrevClick={handlePrev}
                                onResetClick={() => {
                                    /* This will reset the whole page of the browser */
                                    init();
                                    setSearchString("");
                                    setCompanySelected(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <ProductsTable
                        list={products}
                        loading={loading}
                    />
                </div>
                <div>
                    <Pagination
                        next={pagination.next}
                        prev={pagination.prev}
                        reset={false}
                    />
                </div>
            </div>
        </>)
}

export default ProductList;