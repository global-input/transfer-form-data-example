import React, { useState } from 'react';
import type { FormField} from './mobile';
import {
    Field, Input, TextArea, Label, CopyToClipboardButton,
    InputGroup, CheckBox
} from './components';

export const isFieldChecked= (formField,selectedFields) => selectedFields.filter(s => s === formField).length;

export const DisplayInputField = ({ formFields,
    formField, index, onFieldChanged, visibility,
    selectedFields, setSelectedFields }) => {

    const [focused, setFocused] = useState(false);
    const checked = isFieldChecked(formField,selectedFields);
    const showCheckbox=(!focused) && (!formField.value);
    const type=visibility.value === 0 ? 'password' : 'text'
    const setChecked = () => {
            setSelectedFields([...selectedFields, formField]);
    };
    const setUnchecked = () => {
            setSelectedFields(selectedFields.filter(s => s !== formField));
    };
    const toggleSelect = () => {
        if (checked) {
            setUnchecked();
        }
        else {
            setChecked();
        }
    };
    const onFocus=()=>{
        setFocused(true);
        setUnchecked();
    }
    const onBlur=()=>{
        setFocused(false)
    }
    const onChange=(evt)=>{
        onFieldChanged(formFields, formField, index, evt.target.value)
    }

    if (visibility.value === 0 || (!formField.nLines) || formField.nLines <= 1) {
        return (
            <InputGroup>
                {showCheckbox && (<CheckBox checked={checked} onChange={toggleSelect} />)}
                <Field>
                    <Input id={formField.id} type={type}
                    value={formField.value}
                    placeholder={formField.label}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur} />
                    <Label htmlFor={formField.id}>{formField.label}</Label>
                </Field>
                <CopyToClipboardButton value={formField.value} position={2}>Copy</CopyToClipboardButton>
            </InputGroup>
        );


    }
    else {
        return (<Field>
            <InputGroup>
                {showCheckbox && (<CheckBox checked={checked} onChange={toggleSelect} />)}
                <TextArea id={formField.id} value={formField.value} placeholder={formField.label}
                    onChange={(evt) => onFieldChanged(formFields, formField, index, evt.target.value)} />
            </InputGroup>

            <Label htmlFor={formField.id}>{formField.label}</Label>
            <CopyToClipboardButton value={formField.value} position={2}>Copy</CopyToClipboardButton>
        </Field>);
    }
};


export const computeChangedFormFields = (formFields: FormField[], fieldId: string | null | undefined, value: string, index: number) => {
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
