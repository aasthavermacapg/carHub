import { LightningElement, wire } from 'lwc';

// Car__c schema
import NAME_FIELD from '@salesforce/schema/Car__c.Name';
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c';
import FUEL_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c';
import SEATS_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c';
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c';

// function to extract field values
import { getFieldValue } from 'lightning/uiRecordApi';

//lightning message service and message channel
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c';

export default class CarCard extends LightningElement {

    // load context for LMS
    @wire(MessageContext)
    messageContext

    // exposing fields to make them available in the template
    categoryField = CATEGORY_FIELD;
    makeField = MAKE_FIELD;
    msrpField = MSRP_FIELD;
    fuelField = FUEL_FIELD;
    seatsField = SEATS_FIELD;
    controlField = CONTROL_FIELD;

    // Id of Car__c to display data
    recordId;

    //car fields to be displayed in specific format
    carName;
    carPictureUrl;

    // subscription reference for carSelected
    carSelectionSubscription;

    handleRecordLoaded(event){
        const { records } = event.detail;
        const recordData = records[this.recordId];
        this.carName = getFieldValue(recordData, NAME_FIELD);
        this.carPictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD);
    }
    connectedCallback(){
        this.subscribeHandler();
    }
    subscribeHandler(){
        this.carSelectionSubscription = subscribe(this.messageContext, CAR_SELECTED_MESSAGE, (message)=>this.handleCarSelected(message));
    }
    handleCarSelected(message){
        this.recordId = message.carId;
        // console.log(message.carId);
    }
    disconnectedCallback(){
        unsubscribe(this.carSelectionSubscription);
        this.carSelectionSubscription = null;
    }
}