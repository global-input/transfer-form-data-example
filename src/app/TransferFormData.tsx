import React, { useState, useCallback } from 'react';

import { useMobile, FormField, userWithDomainAsFormId } from './mobile';
import { FormContainer, DisplayInputCopyField, TextButton, FormFooter, AppFooter, MessageButton, MessageLink } from './app-layout';

interface Props {
    domain: string;
    formFields: FormField[];
    setFormFields: (formFields: FormField[]) => void;
    manageForm: () => void;
    editDomain: () => void;
    editConnectionSettings: () => void;
};
const TransferFormData: React.FC<Props> = ({ domain, formFields, setFormFields, manageForm, editDomain, editConnectionSettings }) => {
    const [visibility, setVisibility] = useState(FIELDS.visibility.options[0]);
    const initData = () => {
        const initData = {
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
    const mobile = useMobile(initData);


    const toggleVisibility = useCallback(() => {
        const vis = visibility === FIELDS.visibility.options[0] ? FIELDS.visibility.options[1] : FIELDS.visibility.options[0];
        setVisibility(vis);
        mobile.sendValue(FIELDS.visibility.id, vis.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibility, mobile.sendValue]);

    mobile.setOnFieldChange((field) => {
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
                for (const [index, formField] of formFields.entries()) {
                    if (formField.id === field.id) {
                        const changedFormFields = computeChangedFormFields(formFields, formField.id, field.value as string, index);
                        if (changedFormFields) {
                            setFormFields(changedFormFields);
                        }
                    }
                }
        }
    });

    const onFieldChanged = (formFields: FormField[], formField: FormField, index: number, value: string) => {
        const changedFormFields = computeChangedFormFields(formFields, formField.id, value, index);
        if (changedFormFields) {
            setFormFields(changedFormFields);
            mobile.sendValue(formField.id as string, value, index);
        }
    }
    const notConnected = (
        <AppFooter>
            <MessageButton label="Settings" onClick={editConnectionSettings} />
            <MessageLink href="https://github.com/global-input/transfer-form-data-example">Source Code</MessageLink>
        </AppFooter>
    );

    return (
        <mobile.ControlledContainer title="Form Data Transfer" domain={domain} notConnected={notConnected}>
            <FormContainer>
                {formFields.map((formField, index) => (<DisplayInputCopyField
                    field={formField}
                    key={formField.id}
                    hideValue={visibility.value === 0} onChange={value => onFieldChanged(formFields, formField, index, value)} />))}
            </FormContainer>
            <FormFooter>
                <TextButton onClick={editDomain} label="Edit Domain" />
                <TextButton onClick={toggleVisibility} label={visibility.label} />
                <TextButton onClick={manageForm} label="Manage" />
            </FormFooter>
        </mobile.ControlledContainer>);


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



const computeChangedFormFields = (formFields: FormField[], fieldId: string | null | undefined, value: string, index: number) => {
    let fieldModified = false;
    const fields = formFields.map((f, ind) => {
        if (fieldId) {
            if (f.id === fieldId) {
                fieldModified = true;
                return { ...f, value };
            }
        }
        else {
            if (index >= 0 && index < formFields.length) {
                if (ind === index) {
                    fieldModified = true;
                    return { ...f, value };
                }
            }
        }
        return f;
    });
    if (fieldModified) {
        return fields;
    }
    return null;
}



export default TransferFormData;