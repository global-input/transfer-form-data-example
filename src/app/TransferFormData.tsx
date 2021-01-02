import React, { useState, useCallback } from 'react';
//+//import { useHistory } from 'react-router-dom'; ////website
import { useMobile, ConnectButton,DisConnectButton,ConnectWidget,FormField, InitData} from './mobile';

import {AppContainer,Form,Field,Input,Label,Footer, DarkButton,Help,
ConnectContainer} from './components';
//+//import * as mobileUI from '../../micro-apps/mobile-ui'; ////website

import {DisplayInputField,computeChangedFormFields,isFieldChecked} from './formFields';
interface Props {
    domain: string;
    formFields: FormField[];
    onChangeFormFields: (formFields: FormField[]) => void;
    manageForm: () => void;
    editDomain: () => void;
    configId:number;
    changeDomain:(domain:string)=>void;
    selectedFields:FormField[];
    setSelectedFields:(fields:FormField[]) =>void;
    onDeleteSelected:()=>void;
};

export const TransferFormData: React.FC<Props> = ({ domain, changeDomain,configId,formFields, onChangeFormFields, manageForm, editDomain,selectedFields,setSelectedFields,onDeleteSelected}) => {
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
    const mobile = useMobile(initData, false,configId);



    const toggleVisibility = useCallback(() => {
        const vis = visibility === FIELDS.visibility.options[0] ? FIELDS.visibility.options[1] : FIELDS.visibility.options[0];
        setVisibility(vis);
        mobile.sendValue(FIELDS.visibility.id, vis.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibility, mobile.sendValue]);
    const canDelete=!!selectedFields.length

    const onFieldChanged = (formFields: FormField[], formField: FormField, index: number, value: string) => {
        const changedFormFields = computeChangedFormFields(formFields, formField.id, value, index);
        if (changedFormFields) {
            onChangeFormFields(changedFormFields);
            mobile.sendValue(formField.id as string, value, index);
        }
    }

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
                //+//let matched = false;
                for (const [index, formField] of formFields.entries()) {
                    if (formField.id === field.id) {
                        //+//matched = true;
                        const changedFormFields = computeChangedFormFields(formFields, formField.id, field.value as string, index);
                        if (changedFormFields) {
                            onChangeFormFields(changedFormFields);
                        }
                    }
                }
            //+//if (!matched) {
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
                    {formFields.map((formField, index) => (<DisplayInputField  key={formField.id} index={index}
                        formField={formField} onFieldChanged={onFieldChanged} formFields={formFields} visibility={visibility}
                        selectedFields={selectedFields} setSelectedFields={setSelectedFields}/>
                ))}
                </Form>








            <Footer>

                {canDelete && (<DarkButton onClick={onDeleteSelected}>Deleted Selected</DarkButton>)}
                <DarkButton onClick={toggleVisibility}>{visibility.label}</DarkButton>

            </Footer>




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
