import React, { useCallback, useState, useEffect } from 'react';

import * as storage from './storage';

import { FormField } from './mobile';

import CreateField from './CreateField';
import ManageForm from './ManageForm';
import {TransferFormData} from './TransferFormData';
import EditDomain from './EditDomain';
import { loadFormFromQuery } from './url-query';


export enum PAGES {
    TRANSFER_FORM_DATA,
    MANAGER_FORM,
    CREATE_FIELD,
    EDIT_DOMAIN
};

interface Props {
    location?: any;

}
const MainControl: React.FC<Props> = ({ location }) => {
    const [domain, setDomain] = useState(loadDomain);
    const [configId,setConfigId]=useState(0);
    const [selectedFields, setSelectedFields]=useState<FormField[]>([]);
    const [page, setPage] = useState(PAGES.TRANSFER_FORM_DATA);
    const [formFields, setFormFields] = useState(() => buildFormFields(domain));



    const transferFormData = useCallback(() => setPage(PAGES.TRANSFER_FORM_DATA), []);
    const manageForm = useCallback(() => setPage(PAGES.MANAGER_FORM), []);
    const createField = useCallback(() => setPage(PAGES.CREATE_FIELD), []);
    const editDomain = useCallback(() => setPage(PAGES.EDIT_DOMAIN), []);

    const onFormFieldsValuesModified=(formFields:FormField[])=>{
        setSelectedFields([]);
        setFormFields(formFields);
    }
    const onFormStructureModified = (formFields: FormField[]) => {
        setFormFields(formFields);
        storage.saveFormFields(domain, formFields);
        setConfigId(configId=>configId+1);
        setSelectedFields([]);
    };
    const onDeleteSelected=()=>{
        const newFormFields=formFields.filter(f=>selectedFields.indexOf(f)===-1);
        onFormStructureModified(newFormFields);
    }

    const onFormModified=(formFields: FormField[], isStructureChanged:boolean) => {
        if(isStructureChanged){
            storage.saveFormFields(domain, formFields);
            setConfigId(configId=>configId+1);
        }
        setSelectedFields([]);
        setFormFields(formFields);
    }

    const changeDomain = useCallback((domain) => {
        setDomain(domain);
        storage.setDomain(domain);
        setConfigId(configId=>configId+1);
        //transferFormData();
    }, []);


    useEffect(() => {
        const formData = loadFormFromQuery(location);
        if (formData) {
            if (formData.id) {
                const parts = formData.id.split('@');
                const domain = parts && parts.length && parts[parts.length - 1];
                if (domain) {
                    setDomain(domain);
                }
                else {
                    setDomain(formData.id.replace('@'));
                }
            }
            if (formData.fields) {
                setFormFields(formFields);
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    switch (page) {
        case PAGES.TRANSFER_FORM_DATA:
            return (<TransferFormData configId={configId}
                    domain={domain} changeDomain={changeDomain}
                    formFields={formFields} onFormModified={onFormModified}
                    manageForm={manageForm} editDomain={editDomain}
                   selectedFields={selectedFields} setSelectedFields={setSelectedFields}/>);
        case PAGES.MANAGER_FORM:
            return (<ManageForm formFields={formFields} onFormStructureChanged={onFormStructureModified} back={transferFormData} createField={createField} />);
        case PAGES.CREATE_FIELD:
            return (<CreateField formFields={formFields} onFormStructureChanged={onFormStructureModified} back={manageForm} />);
        case PAGES.EDIT_DOMAIN:
            return (<EditDomain back={transferFormData} domain={domain} changeDomain={changeDomain} />);
        default:
    }
    return null
};

const defaultFormFields = [{
    id: "username",
    label: "Username",
    value: ''
}, {
    id: "password",
    label: "Password",
    type: "secret",
    value: ''
}, {
    id: "note",
    label: "Note",
    nLines: 5, value: '',
}];

const buildFormFields = (domain: string) => {
    let fields = storage.loadSavedFormFields(domain);
    if (!fields) {
        fields = defaultFormFields;
    }
    return fields;
};

const loadDomain = () => {
    const domain = storage.getDomain();
    return domain ? domain : "globalinput.co.uk";
};




export default MainControl;