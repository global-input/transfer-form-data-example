import React, { useState, useCallback } from 'react';
//+//import { useHistory } from 'react-router-dom'; ////website
import { useMobile, ConnectButton,DisConnectButton,ConnectWidget,FormField, InitData} from './mobile';

import {AppContainer,Form,Field,Input,Label,Footer, DarkButton,Help,
ConnectContainer} from './components';
//+//import * as mobileUI from '../../micro-apps/mobile-ui'; ////website

import {DisplayInputField,AddNewField} from './formFields';

interface Props {
    domain: string;
    formFields: FormField[];
    onFormModified: (formFields: FormField[],isStructureChanged:boolean) => void;
    manageForm: () => void;
    editDomain: () => void;
    configId:number;
    changeDomain:(domain:string)=>void;
    selectedFields:FormField[];
    setSelectedFields:(fields:FormField[]) =>void;
};

export const TransferFormData: React.FC<Props> = ({ domain, changeDomain,configId,formFields, manageForm, editDomain,selectedFields,setSelectedFields,onFormModified}) => {
    const [visibility, setVisibility] = useState(FIELDS.visibility.options[0]);
    const [expand,setExpand]=useState('')
    const initData = () => {
        const initData = {
            id: 'transfer-form',
            form: {
                title: domain,
                domain: domain,
                label: domain,
                fields: [...Object.values(FIELDS), ...formFields]
            }
        }
        userWithDomainAsFormId(initData);
        return initData;
    };
    //+//const history = useHistory();////website
    const mobile = useMobile(initData, true,configId);
    const toggleVisibility = useCallback(() => {
        const vis = visibility === FIELDS.visibility.options[0] ? FIELDS.visibility.options[1] : FIELDS.visibility.options[0];
        setVisibility(vis);
        mobile.sendValue(FIELDS.visibility.id, vis.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibility, mobile.sendValue]);

    const onDeleteSelected=()=>{
        const newFormFields=formFields.filter(f=>selectedFields.indexOf(f)===-1);
        onFormModified(newFormFields,true);
    };

    const canDelete=!!selectedFields.length;

    mobile.setOnchange(({ field }) => {
        switch (field.id) {
            case FIELDS.visibility.id:
                toggleVisibility();
                break;
            case FIELDS.manage.id:
                manageForm();
                break;
            case FIELDS.editDomain.id:
                editDomain();
                break;
            default:
                let fieldModified = false;
                const newFormFields=formFields.map(f=>{
                    if (f.id === field.id) {
                        fieldModified = true;
                        return {...f,value:field.value};
                    }
                    else{
                        return f;
                    }
                });
                if(fieldModified){
                    onFormModified(newFormFields,false);
                }
                //+//if (!fieldModified) {
                //+//mobileUI.onFieldChange(field, history); ////website
                //+//}
        }
    });
    return (
        <AppContainer>

<ConnectContainer>
    <ConnectButton mobile={mobile}/>
    <DisConnectButton mobile={mobile}/>
    <ConnectWidget mobile={mobile}/>

</ConnectContainer>




            <Field>
                <Input id='changeDomain'  type="text"
                value={domain} placeholder="Domain"
                onChange={(evt)=>changeDomain(evt.target.value)}/>
                <Label htmlFor="changeDomain">Domain</Label>
                <Help expand={expand} setExpand={setExpand} expandId="changeDomain" position={3}>
                    Domain is used to organize forms as well as matching data in your mobile secure storage to help you locate the data for filling the form displayed.
                </Help>
            </Field>



                <Form>
                    {formFields.map((formField, index) => (
                    <DisplayInputField  key={formField.id}
                        formField={formField} onChange={(evt)=>{
                            const newFormFields=formFields.map(f=>{
                                if (f === formField) {
                                    return {...f,value:evt.target.value};
                                }
                                else{
                                    return f;
                                }
                            });
                            onFormModified(newFormFields,false);
                            mobile.sendValue(formField.id as string, evt.target.value, index);
                        }}  visibility={visibility}
                        selectedFields={selectedFields} setSelectedFields={setSelectedFields}/>
                ))}
                </Form>








            <Footer>

                {canDelete && (<DarkButton onClick={onDeleteSelected}>Deleted Selected</DarkButton>)}
                <DarkButton onClick={toggleVisibility}>{visibility.label}</DarkButton>

            </Footer>



            <AddNewField formFields={formFields} onFormModified={onFormModified}/>



        </AppContainer>);


};



const FIELDS = {
    editDomain: {
        id: "editDomain",
        type: "button",
        label: "Edit Domain",
        viewId: "row1"
    },
    manage: {
        id: "manageForm",
        type: "button",
        label: "Manage",
        viewId: "row1"
    },
    visibility: {
        id: "fieldValueVisibility",
        type: 'button',
        viewId: "row1",
        options: [{ value: 0, label: 'Show' }, { value: 1, label: 'Hide' }],
        value: 0
    }

};
//+//mobileUI.add(FIELDS);////website





const userWithDomainAsFormId = (initData: InitData) => {
    if (initData?.form?.domain && initData?.form?.fields?.length) {
        const textFields = initData.form.fields.filter(f => {
            if ((!f.type) || f.type === 'text') {
                if (f.nLines && f.nLines > 1) {
                    return false;
                }
                return true;
            }
            return false;
        });
        if (!textFields.length) {
            return null;
        }
        initData.form.id = `###${textFields[0].id}###@${initData.form.domain}`;
    }
};
