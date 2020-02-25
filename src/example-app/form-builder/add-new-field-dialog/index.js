import React from 'react';
import {styles} from './styles';
import {InputWithLabel,TextButton}  from '../../app-layout';

export default class AddNewFieldDialog extends React.Component{

  constructor(props){
    super(props);
    this.state={label:"", multiline:false}
  }

  setFormLabel(label){
    this.setState(Object.assign({},this.state,{label}));
  }
  setMultiline(multiline){
    this.setState(Object.assign({},this.state,{multiline}));
  }
  onCancel(){

    this.props.onCancel();
  }
  onAddNewField(){
    var data={
      label:this.state.label,
      nLines:1
    };
    if(this.state.multiline){
      data.nLines=5;
    }
    this.props.onAddNewField(data);
  }
  
  render(){
      return(
        <div style={styles.container}>
              <div style={styles.dialog}>
                      <div style={styles.title}>Adding a New Field</div>
                      <div style={styles.content}>
                      <div>Enter the name of the new field </div>
                          <div>
                          <InputWithLabel label="Name of the field" id="newFieldLabel"
                            onChange={this.setFormLabel.bind(this)}
                            value={this.state.label}/>
                          </div>
                          <div style={styles.multiline.container}>
                            <div style={styles.multiline.item}>
                              <input type="radio" name="multiline" checked={this.state.multiline?false:true} onChange={evt=>this.setMultiline(false)}/>
                              <span style={styles.multiline.text}>Single-line</span>
                            </div>
                            <div style={styles.multiline.item}>
                              <input type="radio" name="multiline" checked={this.state.multiline?true:false} onChange={evt=>this.setMultiline(true)}/>
                              <span style={styles.multiline.text}>Multi-line</span>
                            </div>
                          </div>
                      </div>

                     <div style={styles.footer}>
                          <TextButton onClick={this.onCancel.bind(this)} label="Cancel"/>
                          <TextButton onClick={this.onAddNewField.bind(this)} label="Add"/>
                     </div>
              </div>



        </div>
      );




  }

}
